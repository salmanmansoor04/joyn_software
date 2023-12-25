<?php

namespace App\Http\Controllers; 

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Kutia\Larafirebase\Facades\Larafirebase;

use Illuminate\Support\Facades\Mail;


use Illuminate\Http\Request;

class TaskmanagementController extends Controller
{
    public function getMembers(Request $request){
        
        $final = array();
        $cust_id = $request->input('cust_id');
        $members = DB::table('team_members')->where('cust_id', $cust_id)->get();
        $functions = DB::table('functions')->where('cust_id', $cust_id)->get();
        foreach($members as $member){
            
            $function = $member->function;
            $userId = $member->user_id;
            Log::info($userId);
            $funcName = DB::table('functions')->where('id', $function)->pluck('name')[0];
            $memberInfo = DB::table('users')->where('id', $userId)->get();
            $member->email = $memberInfo[0]->email;
            $member->password = $memberInfo[0]->password;
            $member->name = $memberInfo[0]->name;
            $member->function = $funcName;
        }
        $final['members'] = $members;
        $final['functions'] = $functions;
        return $final;
        
    }
    
    public function addMember(Request $request){
        
        if($request->input('crudType') == 'add'){
        
            $member = $request->input('member');
            
            $cust_id = $request->input('cust_id');
            
            $password = strtolower($member['name']);
            $password = str_replace(' ', '', $password);
            $password = $password . '_1234@';
            $passwordHash = Hash::make($password);
            
            $users = [$member['email']];
            $data = ['email' => $member['email'], 'password' => $password];
            
            try{
                Mail::send('memberCreateMail', $data, function($messages) use ($users){
                    foreach($users as $user){
                        $messages->to($user);
                        $messages->subject('New Member');
                    }
                });
            }
            catch(\Exception $e){
                Log::info($e);
                return 'failed';
            }
            
            $member['cust_id'] = $cust_id;
            
            $id2 = DB::table('users')->insertGetId([
                'cust_id' => $cust_id,
                'role' => 4,
                'name' => $member['name'],
                'email' => $member['email'],
                'password' => $passwordHash,
                'username' => $member['name'],
                'access_token' => $this->random_strings(64),
                'refresh_token' => $this->random_strings(64)
            ]);
            
            DB::table('team_members')->insert([
                
                'user_id' => $id2,
                'function' => $member['function'],
                'city' => $member['city'],
                'region' => $member['region'],
                'number' => $member['number'],
                'cust_id' => $member['cust_id'],
                
            ]);
        
            return 'done';
        }
        if($request->input('crudType') == 'update'){
            
            $member = $request->input('member');
            $cust_id = $request->input('cust_id');
            $member['cust_id'] = $cust_id;
            DB::table('members')->where('id',$request->input('member_id'))->update($member);
            
        }
    }
    
    public function addFunction(Request $request){
        
        $cust_id = $request->input('cust_id');
        DB::table('functions')->insert([
                'name' => $request->input('function'),
                'cust_id' => $cust_id
            ]);
        return 'done';
        
    }
    
    public function getTasks(Request $request){
        $final = array();
        $cust_id = $request->input('cust_id');
        $members = DB::table('team_members')->where('cust_id', $cust_id)->get();
        $functions = DB::table('functions')->where('cust_id', $cust_id)->get();
        $tasks = DB::table('tasks')->where('cust_id', $cust_id)->get();
        foreach($members as $member){
            
            $function = $member->function;
            $userId = $member->user_id;
            Log::info($userId);
            $funcName = DB::table('functions')->where('id', $function)->pluck('name')[0];
            $memberInfo = DB::table('users')->where('id', $userId)->get();
            $member->email = $memberInfo[0]->email;
            $member->password = $memberInfo[0]->password;
            $member->name = $memberInfo[0]->name;
            $member->function = $funcName;
        }
        foreach($tasks as $task){
            $assigned = DB::table('task_assignment')->where('task_id', $task->id)->pluck('member_id');
            $assignedMembers = DB::table('team_members')->whereIn('id', $assigned)->get();
            foreach($assignedMembers as $member){
            
                $function = $member->function;
                $userId = $member->user_id;
                Log::info($userId);
                $funcName = DB::table('functions')->where('id', $function)->pluck('name')[0];
                $memberInfo = DB::table('users')->where('id', $userId)->get();
                $member->email = $memberInfo[0]->email;
                $member->password = $memberInfo[0]->password;
                $member->name = $memberInfo[0]->name;
                $member->function = $funcName;
            }
            $task->members = $assignedMembers;
            
            if($task->location != null){
                $task->location = json_decode($task->location);
            }
        }
        $final['members'] = $members;
        $final['functions'] = $functions;
        $final['tasks'] = $tasks;
        
        return $final;
        
    }
    
    public function addTasks(Request $request){
        
        $task = $request->input('task');
        $user_id = $request->input('user_id');
        $cust_id = $request->input('cust_id');
        $user_name = DB::table("users")->where('id',$user_id)->pluck('name')[0];
        $task['assigned_by_id'] = $user_id;
        $task['assigned_by_name'] = $user_name;
        $startDate = strtotime($task['startDate']);
        $dueDate = strtotime($task['dueDate']);
        $now = strtotime("now");
        if($now < $startDate){
          $task['status'] = 'assinged';
        }else if($now > $startDate && $now < $dueDate){
          $task['status'] = 'ongoing';
        }else{
          $task['status'] = 'pending';
        }
        $task['cust_id'] = $cust_id;
        if($task['Type'] == 'Custom'){
            $task['path'] = null;
        }
        if($task['Type'] == 'PJP'){
            $task['path'] = JSON_encode($task['path']);
        }
        DB::table('tasks')->insert($task);
        return 'done';
    }
    
    public function assignMembers(Request $request){
        
        $task = $request->input('task');
        $members = $request->input('members');
    
        
        $assigned = DB::table('task_assignment')->where('task_id', $task['id'])->select('member_id')->get();
        
        $assignedDeviceTokens = array();
        
        $assignedMembers = array();
        $assignedMails = array();
        
        foreach($assigned as $assi){
            array_push($assignedMembers, $assi->member_id);
            array_push($assignedMails, DB::table('members')->where('id', $assi->member_id)->pluck('email')[0]);
            array_push($assignedDeviceTokens, DB::table('members')->where('id', $assi->member_id)->pluck('device_token')[0]);
        }
        
        $memberEmails = array();
        
        DB::table('task_assignment')->where('task_id', $task['id'])->delete();

        foreach($members as $member){
            if (!in_array($member['id'], $assignedMembers)){
                DB::table('task_assignment')->insert([
                    'task_id' => $task['id'],
                    'member_id' => $member['id']
                ]);
                array_push($memberEmails, $member['email']);
            }
        }
        
        $data = ['task' => $task['name'], 'startDate' => $task['startDate'], 'dueDate' => $task['dueDate'], 'city' => $task['city'], 'region' => $task['region'], 'description' => $task['description']];

        $mailStatus = 'ok';

        try{
            Mail::send('taskAssignedMail', $data, function($messages) use ($memberEmails){
                foreach($memberEmails as $user){
                    $messages->to($user);
                    $messages->subject('Task Assigned');
                }
            });
        }
        catch(\Exception $e){
            $mailStatus = 'nok';
            Log::info('mail error');
            Log::info($e);
        }

        try{
            Mail::raw('Task named ' . '(' .$task['name'] . ')' . ' is no longer assigned to you', function ($message) use ($assignedMails) {
                $message->to($assignedMails);
                $message->subject('Task Unassinged');
              });
        }
        catch(\Exception $e){
            $mailStatus = 'nok';
            Log::info('mail error');
            Log::info($e);
        }
        
        $task['images'] = array();
        $task['approval_status'] = DB::table('task_assignment')->where('task_id', $task['id'])->where('member_id', $members[0]['id'])->pluck('approval_status')[0];
        
            $task['approval_remarks'] = DB::table('task_assignment')->where('task_id', $task['id'])->where('member_id', $members[0]['id'])->pluck('remarks')[0];
        
        $this->sendNotificationTaskAssinged($members[0]['device_token'], $task);
        
        if(count($assignedDeviceTokens) > 0){
            $this->sendNotificationTaskUnassinged($assignedDeviceTokens[0], $task);
        }
        
        return $mailStatus;
    }
    
    public function createTaskSnag(Request $request){
        
        $final = array();
        
        $snags = $request->input('snags');
        $task = $request->input('task');
        $members = $request->input('members');
        $user_id = $request->input('user_id');
        $status = 'pending';
        $cust_id = $request->input('cust_id');

        $startDate = strtotime($task['startDate']);
        $dueDate = strtotime($task['dueDate']);
        $now = strtotime("now");

        if($now < $startDate){
            $status = 'assinged';
          }else if($now > $startDate && $now < $dueDate){
            $status = 'ongoing';
          }else{
            $status = 'pending';
          }
        
        $user_name = DB::table("users")->where('id',$user_id)->pluck('name')[0];
        
        foreach($snags as $snag){

            DB::table('audit_result')
              ->where('id', $snag['id'])
              ->update([
                    'task_assignment_status' => $status,
                    'assigned_by_id' => $user_id,
                    'assigned_by_name'=> $user_name,

                ]);
        }

        $taskToInsert = array();
        $tasks = array();
        
        foreach($snags as $snag){
                $taskToInsert['name'] = $snag['q_name'];
                $taskToInsert['cust_id'] = $cust_id;
                $taskToInsert['urgency'] = $task['urgency'];
                $taskToInsert['city'] = $snag['City'];
                $taskToInsert['region'] = $snag['Region'];
                $taskToInsert['area'] = $snag['Area'];
                $taskToInsert['description'] = $task['description'];
                $taskToInsert['status'] = $status;
                $taskToInsert['startDate'] = $task['startDate'];
                $taskToInsert['dueDate'] = $task['dueDate'];
                $taskToInsert['Type'] = $task['Type'];
                $taskToInsert['snag_id'] = $snag['id'];
                $taskToInsert['location'] = $snag['position'];
                $taskToInsert['assigned_by_id'] = $user_id;
                $taskToInsert['assigned_by_name'] = $user_name;
                $taskToInsert['Remarks'] = $snag['Remarks'];
                
                $task_id = DB::table('tasks')->insertGetId($taskToInsert);
                
                $taskToInsert['id'] = $task_id;
                
                array_push($tasks, $taskToInsert);
                
                foreach($members as $member){
                    DB::table('task_assignment')->insert([
                        'task_id' => $task_id,
                        'member_id' => $member['id']
                    ]);
                }
        
        }
                
        
        $memberEmails = array();
        
        foreach($members as $member){
                array_push($memberEmails, $member['email']);
        }
        
        Log::info('emails');
        Log::info($memberEmails);

        $mailStatus = 'ok';
              
        $data = ['tasks' => $tasks];

        try{
            Mail::send('taskAssignedMail', $data, function($messages) use ($memberEmails){
                foreach($memberEmails as $user){
                    $messages->to($user);
                    $messages->subject('Task Assigned');
                }
            });
        }
        catch(\Exception $e){
            $mailStatus = 'nok';
            Log::info('mail error');
            Log::info($e);
        }
        
        $tasksPositions = DB::table('tasks')->whereNotNull('location')->select('location')->get();
        
        $locations = array();
        
        foreach($tasksPositions as $position){
            if(!in_array($position->location, $locations)){
                array_push($locations, $position->location);
            }
        }
        
        foreach($tasks as $task){
            $task['images'] = array();
            $task['approval_status'] = DB::table('task_assignment')->where('task_id', $task['id'])->where('member_id', $members[0]['id'])->pluck('approval_status')[0];
        
            $task['approval_remarks'] = DB::table('task_assignment')->where('task_id', $task['id'])->where('member_id', $members[0]['id'])->pluck('remarks')[0];
            $this->sendNotificationTaskAssinged($members[0]['device_token'], $task);
        }
        
        $final['snags'] = $snags;
        $final['task'] = $task;
        $final['members'] = $members;
        $final['taskPostions'] = $locations;
        $final['mailStatus'] = $mailStatus;
        
        return $final;
    }
    
    public function getSnags(Request $request){
        $task_id = $request->input('task_id');
        
        $snagsIds = DB::table('task_snags')->where('task_id', $task_id)->pluck('snag_id');

        $snags = DB::table('audit_result')->whereIn('id', $snagsIds)->get();

        return $snags;
    }
    
    public function taskDelete(Request $request){
        
        $task_id = $request->input('task_id');
        
        $task = DB::table('tasks')->where('id', $task_id)-> get();
        
        $snagsIds = DB::table('tasks')->where('id', $task_id)->pluck('snag_id');
        
        foreach($snagsIds as $snagId){

            DB::table('audit_result')
              ->where('id', $snagId)
              ->update([
                'task_assignment_status' => NULL,
                'assigned_by_id' => NULL,
                'assigned_by_name'=> NULL
                ]);

              
        }
        
        $memberIds = DB::table('task_assignment')->where('task_id', $task_id)->pluck('member_id');
        
        $memberTokens = DB::table('members')->whereIn('id', $memberIds)->pluck('device_token');
        
        Log::info($memberTokens);
        
        $task[0]->images = array();
        
        foreach($memberTokens as $memberToken){
            $this->sendNotificationTaskDeleted($memberToken, $task[0]);
        }
        
        
        DB::table('tasks')->where('id', $task_id)->delete();
        DB::table('task_assignment')->where('task_id', $task_id)->delete();
        
       
        
        return 'done';
        
    }

    public function memberDelete(Request $request){
        
        $member_id = $request->input('id');
        
        $user_id = DB::table('team_members')->where('id', $member_id)->pluck('user_id')[0];
        
        DB::table('team_members')->where('id', $member_id)->delete();
        DB::table('users')->where('id', $user_id)->delete();
        
        return 'done';
    }
    
    private function sendNotificationTaskAssinged($token, $task){
        
        // $deviceTokens =[$token];
        
        // return Larafirebase::withTitle('Task Assigned')
        //     ->withBody($task)
        //     ->withImage('https://firebase.google.com/images/social.png')
        //     ->withIcon('https://seeklogo.com/images/F/firebase-logo-402F407EE0-seeklogo.com.png')
        //     ->withSound('default')
        //     ->withPriority('high')
        //     ->withAdditionalData([
        //         'color' => '#rrggbb',
        //         'badge' => 0,
        //     ])
        //     ->sendNotification($deviceTokens);
        
        // // Or
        // return Larafirebase::fromArray(['title' => 'Test Title', 'body' => 'Test body'])->sendNotification($deviceTokens);
        
        return Larafirebase::fromRaw([
            'registration_ids' => [$token],
            'data' => [
                    'task' => $task,
                    'title' => 'Task Assigned',
                    'body' => 'You have a new task',
                    'notificationType' => 'Assigned'
                ],
            'android' => [
                'ttl' => '1000s',
                'priority' => 'high',
                'notification' => [
                    'title' => 'Task Assigned',
                    'body' => 'You have a new task'
                ],
            ],
        ])->send();
    }
    
    private function sendNotificationTaskUnassinged($token, $task){
        
        $deviceTokens =[$token];
        
        // return Larafirebase::withTitle('Task Unassigned')
        //     ->withBody($task)
        //     ->withImage('https://firebase.google.com/images/social.png')
        //     ->withIcon('https://seeklogo.com/images/F/firebase-logo-402F407EE0-seeklogo.com.png')
        //     ->withSound('default')
        //     ->withPriority('high')
        //     ->withAdditionalData([
        //         'color' => '#rrggbb',
        //         'badge' => 0,
        //     ])
        //     ->sendNotification($deviceTokens);
        
        // // Or
        // return Larafirebase::fromArray(['title' => 'Test Title', 'body' => 'Test body'])->sendNotification($deviceTokens);
        
        return Larafirebase::fromRaw([
            'registration_ids' => [$token],
            'data' => [
                    'task' => $task,
                    'title' => 'Task Unassigned',
                    'body' => 'A task has been unassigned to you',
                    'notificationType' => 'Unassigned'
                ],
            'android' => [
                'ttl' => '1000s',
                'priority' => 'high',
                'notification' => [
                    'title' => 'Task Unassigned',
                    'body' => 'A task has been unassigned to you'
                ],
            ],
        ])->send();
    }
    
    private function sendNotificationTaskDeleted($token, $task){
        
        // $deviceTokens =[$token];
        
        // return Larafirebase::withTitle('Task Deleted')
        //     ->withBody($task)
        //     ->withImage('https://firebase.google.com/images/social.png')
        //     ->withIcon('https://seeklogo.com/images/F/firebase-logo-402F407EE0-seeklogo.com.png')
        //     ->withSound('default')
        //     ->withPriority('high')
        //     ->withAdditionalData([
        //         'color' => '#rrggbb',
        //         'badge' => 0,
        //     ])
        //     ->sendNotification($deviceTokens);
        
        // // Or
        // return Larafirebase::fromArray(['title' => 'Test Title', 'body' => 'Test body'])->sendNotification($deviceTokens);
        
        return Larafirebase::fromRaw([
            'registration_ids' => [$token],
            'data' => [
                    'task' => $task,
                    'title' => 'Task Deleted',
                    'body' => 'A task has been deleted',
                    'notificationType' => 'Deleted'
                ],
            'android' => [
                'ttl' => '1000s',
                'priority' => 'high',
                'notification' => [
                    'title' => 'Task Deleted',
                    'body' => 'A task has been deleted'
                ],
            ],
        ])->send();
    }
    
    protected function random_strings($length_of_string)
    {
    
        // String of all alphanumeric character
        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
        // Shuffle the $str_result and returns substring
        // of specified length
        return substr(str_shuffle($str_result), 
                        0, $length_of_string);
    }
}
