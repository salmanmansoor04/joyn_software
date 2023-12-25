<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Illuminate\Http\Request;

class SuperAdminUserManagementController extends Controller
{
    public function SAuserManagementInit(Request $request){
        $final = array();
        $users = DB::table('users')->get();
        $roles = DB::table('roles')->get();
        $permissions = DB::table('permissions')->get();
        $organizations = DB::table('customers')->get();
        foreach($users as $user){
            $organization = DB::table('customers')->where('id', $user->cust_id)->pluck('name');
            if(count($organization) > 0){
                $user->organization = $organization[0];
            }else{
                $user->organization = 'No Customer';
            }
            $roleName = DB::table('roles')->where('id', $user->role)->pluck('name');
            if(count($roleName) > 0){
                $user->roleName = $roleName[0];
            }else{
                $user->roleName = 'No Role';
            }
            
        }
        $final['users'] = $users;
        $final['roles'] = $roles;
        $final['permissions'] = $permissions;
        $final['organizations'] = $organizations;
        return $final;
    }
    
    public function SAuserManagementEnterOrganization(Request $request){
        
        $entryState = $request->input('entryState');
        $id = $request->input('id');
        $name = $request->input('name');
        
        Log::info($request->all());
        
        if($entryState == 'add'){
            DB::table('customers')->insert([
                'name' => $name,
            ]);
            
            return 'done';
        }
        
        if($entryState == 'update'){
            $affected = DB::table('customers')
              ->where('id', $id)
              ->update(['name' => $name]);
              
            return 'done';
        }
        
    }
    
    public function SAuserManagementEnterRole(Request $request){
        
        Log::info($request->all());
        $entryState = $request->input('entryState');
        $id = $request->input('id');
        $name = $request->input('name');
        $permissions = $request->input('permissions');
        
        if($entryState == 'add'){
            $id = DB::table('roles')->insertGetId([
                'name' => $name,
            ]);
            
            foreach($permissions as $permission){
                DB::table('roles_permissions')->insertGetId([
                    'role_id' => $id,
                    'permission_id' => $permission['id']
                ]);
            }
            
            return 'done';
        }
        
        if($entryState == 'update'){
            $affected = DB::table('roles')
              ->where('id', $id)
              ->update(['name' => $name]);
              
            DB::table('roles_permissions')->where('role_id', $id)->delete();
            
            foreach($permissions as $permission){
                DB::table('roles_permissions')->insertGetId([
                    'role_id' => $id,
                    'permission_id' => $permission['id']
                ]);
            }
              
            return 'done';
        }
    }
    
    public function SAuserManagementUserUpdate(Request $request){
        
        $request_content =  json_decode($request->getContent(),true);
        $dynamicData = [];
        
         $id = $request_content["id"];
         $dynamic_data["name"] = $request_content["name"];
         $dynamic_data["email"] = $request_content["email"];
         $dynamic_data["password"] = Hash::make($request_content["password"]);
         $dynamic_data["username"] = $request_content["username"];
         $dynamic_data["role"] = $request_content["role"];
         $dynamic_data["username"] = $request_content["username"];
         $dynamic_data["cust_id"] = $request_content["organization"];
         
         $affected = DB::table('users')
              ->where('id', $id)
              ->update($dynamic_data);
        return $dynamic_data;
    }
    
    public function SAuserManagementDelete(Request $request){
        
        $id = $request->input('id');
        $type = $request->input('type');
        
        if($type == 'user'){
            DB::table('users')->where('id', $id)->delete();
        }
        if($type == 'role'){
            DB::table('roles')->where('id', $id)->delete();
            DB::table('roles_permissions')->where('role_id', $id)->delete();
            $affected = DB::table('users')
              ->where('role', $id)
              ->update([
                    'role' => null
                  ]);
        }
        if($type == 'organization'){
            DB::table('customers')->where('id', $id)->delete();
            $userIds = DB::table('users')->where('cust_id', $id)->pluck('id');
            DB::table('users')->whereIn('id', $userIds)->delete();
        }
    }
    
    public function SAuserManagementGetRolesPermission(Request $request){
        
        $ids = DB::table('roles_permissions')->where('role_id', $request->input('id'))->pluck('permission_id');
        
        $permissions = DB::table('permissions')->whereIn('id', $ids)->get();
        
        return $permissions;
    }
}
