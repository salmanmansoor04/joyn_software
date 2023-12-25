<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Kutia\Larafirebase\Facades\Larafirebase;

use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;

class JourneyPlanController extends Controller
{
    public function journeyPlanInit(Request $request){
        
        $final = array();
        $cust_id = $request->input('cust_id');
        
        $journeyPlans = DB::table('journey_plans')->where('cust_id', $cust_id)->get();
        
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
        
        foreach($journeyPlans as $journeyPlan){
            $memberIds = DB::table('journey_plan_assignment')->where('journey_plan_id', $journeyPlan->id)->pluck('member_id');
            
            //Log::info($memberIds);
            
            $journeyMembers = DB::table('team_members')->whereIn('id', $memberIds)->get();
            
            Log::info($journeyMembers);
            
            foreach($journeyMembers as $member){
                $function = $member->function;
                $userId = $member->user_id;
                Log::info('running');
                Log::info($userId);
                $funcName = DB::table('functions')->where('id', $function)->pluck('name')[0];
                Log::info($funcName);
                $memberInfo = DB::table('users')->where('id', $userId)->get();
                $member->email = $memberInfo[0]->email;
                $member->password = $memberInfo[0]->password;
                $member->name = $memberInfo[0]->name;
                $member->function = $funcName;
            }
            
             Log::info($journeyMembers);
            
             $journeyPlan->teamMembers = $journeyMembers;
            
        }
        
        $final['functions'] = $functions;
        $final['journeyPlans'] = $journeyPlans;
        $final['teamMembers'] = $members;
        
        return $final;
    }
    
    public function journeyPlanInsert(Request $request){
        
        $cust_id = $request->input('cust_id');
        $name = $request->input('name');
        $areas = $request->input('areas');
        $locations = $request->input('locations');
        $directions = $request->input('directions');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $teamMembers = $request->input('teamMembers');
        
        $journey_id = DB::table('journey_plans')->insertGetId([
            'name' => $name,
            'areas' => json_encode($areas),
            'locations' => json_encode($locations),
            'directions' => json_encode($directions),
            'startDate' => $startDate,
            'endDate' => $endDate,
            'cust_id' => $cust_id
        ]);
        
        foreach($teamMembers as $member){
            DB::table('journey_plan_assignment')->insert([
                'journey_plan_id' => $journey_id,
                'member_id' => $member['id'],
            ]);
        }
        
        return 'done';
    }
}
