<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Illuminate\Http\Request;

class AppController extends Controller
{
    public function taskImagesApp(Request $request){
        
        Log::info('from ibrar images');
        
        Log::info($request->file('image')->getClientOriginalName());
        Log::info($request->input('task_id'));
        
        $task_id = $request->input('task_id');
        $file = $request->file('image');
        
        $images = DB::table('tasks')->where('id', $task_id)->pluck('images')[0];
        
        if($images != null){
            $images = json_decode($images, true);
        }else{
            $images = array();
        }
        
        array_push($images,  strtotime("now").$file->getClientOriginalName());
        
        $imagesToEnter = json_encode($images);
        
        DB::table('tasks')->where('id', $task_id)->update(['images' => $imagesToEnter]);
        
        $destinationPath = public_path('taskImages');
        $file->move($destinationPath.'/' . $task_id . '/', strtotime("now").$file->getClientOriginalName());
        
        return 'ok';
    }
    
    public function taskCompleteApp(Request $request){
        
        Log::info($request->all());
        
        $task_id = $request->input('data_id');
        
        $snag_id = $request->input('data_snag_id');
        
        $status = 'Complete';
        
        $dateValue=date('Y-m');
        
        if($request->input('data_snags_0_Remarks')){
            $remarks = $request->input('data_snags_0_Remarks');
        }else{
            $remarks = $request->input('data_Remarks');
        } 
        
        $snag = DB::table('audit_result')->where('id', $snag_id)->get();
        
        DB::table('audit_result')
              ->where('id', $snag_id)
              ->update([  
                    'task_assignment_status' => $status,
                    'Remarks' => $remarks,
                    'closed_status' => 'yes',
                    'status' => 'old',
                    'dateOfClosing' => date("Y-m-d H:i:s")
                ]);

        
        DB::table('tasks')->where('id', $task_id)->update([
            'status' => $status,
            'Remarks' => $remarks,
        ]);
        
        DB::table('audit_result')->insert([
                'type'=>$snag[0]->type,
                'identification'=>$snag[0]->identification,
                'customer_id'=>$snag[0]->customer_id,
                'name'=>$snag[0]->name,
                'media'=>$snag[0]->media,
                'q_id'=>$snag[0]->q_id,
                'q_name'=>$snag[0]->q_name,
                'value'=>$snag[0]->value,
                'position'=>$snag[0]->position,
                'status'=> $snag[0]->status,
                'worker_id'=>$snag[0]->worker_id,
                 'City' => $snag[0]->City,
                 'Region' => $snag[0]->Region,
                 'Area' => $snag[0]->Area,
                 'Snag_Status' => 'OK',
                 'dateEntered'=>$dateValue,
                 'form_name'=>$snag[0]->form_name,
                 'severity'=>$snag[0]->severity,
                 'Remarks' => $remarks,
                 'created' => date("Y-m-d H:i:s"),
                 'visit' => 'revisit',
                 'closed_status' => 'yes'
            ]);
        
        return 'success';
        
    }
    
    public function taskAcceptanceStatusApp(Request $request){
        
        Log::info('Acceptance Status');
        $data = $request->input('data');
        $task_id = $data['id'];
        $task_approval_status= $data['approval_status'];
        $task_approval_remarks = $data['approval_remarks'];
        $user_id = $request->input('user_id');
        
        $dateValue=date('Y-m');
        
        DB::table('task_assignment')->where('task_id', $task_id)->where('member_id', $user_id)->update([
            
            'approval_status' => $task_approval_status,
            'remarks' => $task_approval_remarks,
        
        ]);
        
        if($task_approval_status == 'decline'){
            $snagId = DB::table('tasks')->where('id', $task_id)->pluck('snag_id')[0];
            
            Log::info($task_approval_status);
            Log::info($snagId);
            
            $snag = DB::table('audit_result')->where('id', $snagId)->get();
            
            DB::table('audit_result')
              ->where('id', $snagId)
              ->update([  
                    'task_assignment_status' => 'Complete',
                    'Remarks' => $task_approval_remarks,
                    'status' => 'old',
                ]);
            
            $id = DB::table('audit_result')->insertGetId([
                'type'=>$snag[0]->type,
                'identification'=>$snag[0]->identification,
                'customer_id'=>$snag[0]->customer_id,
                'name'=>$snag[0]->name,
                'media'=>$snag[0]->media,
                'q_id'=>$snag[0]->q_id,
                'q_name'=>$snag[0]->q_name,
                'value'=>$snag[0]->value,
                'position'=>$snag[0]->position,
                'status'=> $snag[0]->status,
                'worker_id'=>$snag[0]->worker_id,
                 'City' => $snag[0]->City,
                 'Region' => $snag[0]->Region,
                 'Area' => $snag[0]->Area,
                 'Snag_Status' => 'NOK',
                 'dateEntered'=>$dateValue,
                 'form_name'=>$snag[0]->form_name,
                 'severity'=>$snag[0]->severity,
                 'Remarks' => $task_approval_remarks,
                 'created' => date("Y-m-d H:i:s"),
                 'visit' => 'revisit'
            ]);
            
        }
        
        return 'done';
        
    }
    
    public function appLogin(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');
        $token = $request->input('devicetoken');
        Log::info($request->all());
        if ($email && $password){
            $checker = DB::table('users')->where('email',$email)->pluck('id');
            Log::info($checker);
            if(count($checker) > 0){
               $db_password = DB::table('users')->where('id',$checker[0])->pluck('password')[0];
               if (Hash::check($password, $db_password)){
                   DB::table('team_members')
                  ->where('user_id', $checker[0])
                  ->update([
                        'device_token' => $token,
                    ]);
                   $member =  DB::table('users')->where('id', $checker[0])->get()[0];
                   $member->device_token = DB::table('team_members')->where('user_id', $checker[0])->pluck('device_token')[0];
                   $member->id = DB::table('team_members')->where('user_id', $checker[0])->pluck('id')[0];
                   Log::info($member->name);
                   return $member;
               }else{
                return abort(500, 'incorrect password'); 
               }
            }else{
                return abort(500, 'email or password incorrect'); 
            }
        }else{
            return abort(500, 'no email and password');
        }
    }
    
    public function getTasksApp(Request $request){
        
        $final = array();
        
        $id = $request->input('id');
        
        // $taskIds = DB::table('task_assignment')->where('member_id', $id)->whereNull('status')->pluck('task_id');
        
        $taskIds = DB::table('task_assignment')->where('member_id', $id)->where('approval_status', 'pending')->pluck('task_id');
        
        $tasksCustom = DB::table('tasks')->whereIn('id', $taskIds)->where('status' , '!=', 'Complete')->where('type', 'Custom')->pluck('id');
        
        $tasksSnag = DB::table('tasks')->whereIn('id', $taskIds)->where('status' , '!=', 'Complete')->where('type', 'Snag')->pluck('id');
        
        $tasksCustomNumber = array();
        
        $tasksSnagNumber = array();
        
        $final['tasksCustom'] = $tasksCustom;
        
        $final['tasksSnag'] = $tasksSnag;
        
        return $final;
        
    }
    
    public function getSingleTaskApp(Request $request){
        
        $task_id = $request->input('task_id');
        $user_id = $request->input('user_id');
        
        $task = DB::table('tasks')->where('id', $task_id)->get();
        
        $snagsIds = [$task[0]->snag_id];
        
        $snags = DB::table('audit_result')->whereIn('id', $snagsIds)->get();
        
        $task[0]->snags = $snags;
        
        $task[0]->approval_status = DB::table('task_assignment')->where('task_id', $task_id)->where('member_id', $user_id)->pluck('approval_status')[0];
        
        $task[0]->approval_remarks = DB::table('task_assignment')->where('task_id', $task_id)->where('member_id', $user_id)->pluck('remarks')[0];
        
        $task[0]->images = array();
        
        Log::info($task);
        
        DB::table('task_assignment')->where('task_id', $task_id)->where('member_id', $user_id)->update(['status' => 'read']);
        
        return $task;
    }
    
    public function getSnagsApp(Request $request){
        
        $task_id = $request->input('id');
        
        $snagsIds = DB::table('task_snags')->where('task_id', $task_id)->pluck('snag_id');
        
        $response = Http::post('https://joynaudits.com/api/getTaskSnags', [
            'snagsIds' => $snagsIds,
        ]);
        
        if($response->failed() || $response->clientError() || $response->serverError()){
            return abort(500, 'Ambigious response');
        }
        
        return $response->json();
    }
}


