<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

use Illuminate\Http\Request;

class ProjectMonitoringController extends Controller
{
    
    protected function auth_checker(Request $request){
        if ($request->hasHeader('X-Access-Token')) {
           
            $access_token = $request->header('X-Access-Token');
            $user_id = $request->header('X-User-ID');

            Log::info($access_token);
            Log::info($user_id);
           
            $checker = DB::table("users")->where('id',$user_id)->where("access_token",$access_token)->whereDate("access_token_expiry",">=",date('y-m-d',strtotime(now())))->whereTime("access_token_expiry",">=",date('H:i:s',strtotime(now())))->pluck('id');

            Log::info($checker);
            if (count($checker) > 0){
                return true;
            }else{
                return false;
            }
        }
        
    }
    
    
    public function getFieldsAndTable(Request $request){
        
        $final = array();
        
        $customer_id = $request->input('cust_id');
        $tableId = $request->input('form_id');
        
        $formName = DB::table('project_monitoring_forms')->where('id', $tableId)->get();
        $table = $customer_id . '_' . $formName[0]->name;
        
        $columnNames = DB::getSchemaBuilder()->getColumnListing($table);
        $columnsNamesFiltered = array();
        foreach($columnNames as $name){
            if($name != 'prev_id' && $name != 'chronology' && $name != 'dateEntered'){
                array_push($columnsNamesFiltered, $name);
            }
        }
     
        $data = DB::table($table)->where('chronology', 'latest')->get($columnsNamesFiltered);
        
        $fields = DB::table('project_monitoring_fields')->where('destination_id', $customer_id)->where('form_id', $tableId)->get();
        
        $options = DB::table('project_monitoring_fields')->where('field_type', 'option')->where('form_id', $tableId)->get();
        
        $forms = DB::table('project_monitoring_forms')->where('destination_id', $customer_id)->get();
        
        $final['forms'] = $forms;
        $final['columnNames'] = $columnsNamesFiltered;
        $final['data'] = $data;
        $final['fields'] = $fields;
        $final['options'] = $options;
        
        return $final;
    }
    
    public function formInsert(Request $request){
        
        $final = array();
        
        $sequence = $request->input('cust_id');
        $form_id = $request->input('form_id');
        
        
        $formName = DB::table('project_monitoring_forms')->where('id', $form_id)->get();
        
        $data = $request->input('data');
        
        $data['chronology'] = 'latest';
        
        $id = DB::table($sequence.'_'.$formName[0]->name)->insertGetId($data);
        
        DB::table($sequence.'_'.$formName[0]->name)
              ->where('id', $id)
              ->update([
                  'prev_id' => $id
                  ]);
        
        
        /*$final['sequence'] = $sequence;
        $final['data'] = $data;*/
        
        return 'done';
        
    }
    
    public function formUpdate(Request $request){
        
        $final = array();
        
        $sequence = $request->input('cust_id');
        $data = $request->input('data');
        $id = $request->input('id');
        
        $form_id = $request->input('form_id');
        
        $formName = DB::table('project_monitoring_forms')->where('id', $form_id)->get();
        
        //DB::table($sequence.'_projecttable')->insert($data);
        $affected = DB::table($sequence.'_'.$formName[0]->name)
              ->where('id', $id)
              ->update([
                  'chronology' => 'old'
                  ]);
                  
        $prev_id = DB::table($sequence.'_'.$formName[0]->name)->where('id', $id)->get();
                  
        $data['chronology'] = 'latest';
        $data['prev_id'] = $prev_id[0]->prev_id;
        
        DB::table($sequence.'_'.$formName[0]->name)->insert($data);
        
        /*$final['sequence'] = $sequence;
        $final['data'] = $data;
        $final['id'] = $id;*/
        
        return 'done';
        
    }
    
    public function deleteEntry(Request $request){
        $final = array();
        
        $id = $request->input('id');
        
        $sequence = $request->input('cust_id');
        
        $form_id = $request->input('form_id');
        
        $formName = DB::table('project_monitoring_forms')->where('id', $form_id)->get();
        
        DB::table($sequence.'_'.$formName[0]->name)->where('id', $id)->update([
                  'chronology' => 'deleted'
                  ]);
        
        return 'done';
    }
    
    public function getTables(Request $request){
        
        $stat = $this->auth_checker($request);
        if($stat == false){
            return "login";
        }
        
        $final = array();
        
        $sequence = $request->input('cust_id');
        
        $forms = DB::table('project_monitoring_forms')->where('destination_id', $sequence)->get();
        
        $final['forms'] = $forms;
        
        return $final;
    }
    
    public function addTable(Request $request){
        
        $final = array(); 
        
        $form = $request->input('name');
        $sequence = $request->input('cust_id');
        
        $final['form'] = $form;
        $final['sequence'] = $sequence;
        
        DB::table('project_monitoring_forms')->insert([
                'name' => $form,
                'destination_id' => $sequence
            ]);
        
        Schema::create($sequence.'_'.$form, function($table)
        {
            $table->increments('id');
            $table->text('chronology')->nullable();
            $table->text('prev_id')->nullable();
            $table->timestamp('dateEntered')->useCurrent();
        });
        
        return $final;
    }
    
    public function init(Request $request){
        $final = array();
        
        $sequence = $request->input('cust_id');
        
        $form_id = $request->input('form_id');
        
        $fields = DB::table('project_monitoring_fields')->where('destination_id', $sequence)->where('form_id', $form_id)->get();
        
        $options = DB::table('project_monitoring_fields')->where('field_type', 'option')->where('form_id', $form_id)->get();
        
        $final['fields'] = $fields;
        $final['options'] = $options;
        
        return $final;
    }
    
    public function addField(Request $request){
        
        $final = array();
        $sequence = $request->input('cust_id');
        
        $d_id = $request->input('d_id');
        $cust_id = $request->input('cust_id');
        $field_name = $request->input('field_name');
        $field_type = $request->input('field_type');
        $form_id = $request->input('form_id');
        
        $formName = DB::table('project_monitoring_forms')->where('id', $form_id)->get();
        
        
        if($d_id == ''){
            if($field_type == 'date'){
                Schema::table($sequence.'_'.$formName[0]->name, function($table) use ($field_name)
                {
                    $table->timestamp($field_name)->nullable();
                });
            }else{
                Schema::table($sequence.'_'.$formName[0]->name, function($table) use ($field_name)
                {
                    $table->text($field_name)->nullable();
                });
            }
            
            DB::table('project_monitoring_fields')->insert([
                [
                    'destination_id' => $cust_id, 
                    'field_name' => $field_name,
                    'field_type' => $field_type,
                    'form_id' => $form_id
                ]
            ]);
        }else{
            DB::table('project_monitoring_fields')->insert([
                [
                    'destination_id' => $d_id, 
                    'field_name' => $field_name,
                    'field_type' => $field_type,
                    'form_id' => $form_id
                ]
            ]);
        }
        
        return 'done';
        
    }
    
    public function deleteField(Request $request){
        
        $final = array();
        $id = $request->input('id');
        $type = $request->input('type');
        $name = $request->input('name');
        $sequence = $request->input('cust_id');
        
        $form_id = $request->input('form_id');;
        
        $formName = DB::table('project_monitoring_forms')->where('id', $form_id)->get();
        
        
        if($type == 'dropdown'){
            $deleted = DB::table('project_monitoring_fields')->where('id', $id)->orWhere('destination_id', $id)->delete();
            
            Schema::table($sequence.'_'.$formName[0]->name, function($table) use($name)
            {
                $table->dropColumn($name);
            });
        }
        else if($type == 'option'){
            $deleted = DB::table('project_monitoring_fields')->where('id', $id)->delete();
        }else{
            $deleted = DB::table('project_monitoring_fields')->where('id', $id)->delete();
            
            Schema::table($sequence.'_'.$formName[0]->name, function($table) use($name)
            {
                $table->dropColumn($name);
            });
        }
        
        return 'done';
    }
    
    
}
