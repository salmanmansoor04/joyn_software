<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Illuminate\Http\Request;

class AppController2 extends Controller
{
    
    public function appLogin2(Request $request){
        Log::info($request->all());
        $email = $request->input('email');
        $password = $request->input('pass');
        $temp = DB::table('users')->where('email',$email)->where('role', 4)->select('id','password', 'cust_id', 'name')->get()->toArray();
        Log::info('check');
        Log::info($temp);
        if($temp == null)return "0";
        $temp = array_map(function ($value) {
            return (array)$value;
        }, $temp);
        
        if($temp[0]['id'] && Hash::check($password, $temp[0]['password'])){
            $data2 = array();
            $markers = array();
            $cables = array();
            $data2['workerid'] = $temp[0]['id'];
            $data2['cust_id']=$temp[0]['cust_id'];
            $data2['name'] = $temp[0]['name'];
            $feature_ids = DB::table('customer_features')->where('cust_id', $temp[0]['cust_id'])->pluck('feature_id');
            $data2['features'] = DB::table('feature_library')->whereIn('id', $feature_ids)->get();
            Log::info($data2);
             return json_encode($data2);
        }else{
            Log::info('checking');
            return "0";
        } 
    }
    
    public function appGetMarkers(Request $request){
        
        $cust_id = $request->input('cust_id');
        
        $markers = array();
        
        $markerCategories = DB::table('marker_categories')->where('cust_id', $cust_id)->get();
        foreach($markerCategories as $cat){
            $markers[$cat->name] = DB::table('marker_library')->where('cust_id',$cust_id)->where('category', $cat->id)->pluck('name');
        }
        
        return $markers;
    
    }
    
    public function appGetCables(Request $request){
        
        $cust_id = $request->input('cust_id');
        
        $cables =  DB::table('cable_library')->where('cust_id', $cust_id)->pluck('name');
        
        return $cables;
    
    }
    
}
