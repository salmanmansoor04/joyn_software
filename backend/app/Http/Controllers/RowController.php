<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class RowController extends Controller
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
    
    public function getTracks(Request $request){
        $city = $request->input('city');
        $cust_id = 2;
        
        $data = DB::table('fiber')->where('city', $city)->where('user_id', $cust_id)->select('id', 'data', 'row_status', 'row_detail')->get();

        return $data;
    }

    public function rowInit(Request $request){
        $stat = $this->auth_checker($request);
        if($stat == false){
            return "login";
        }
        
        $cust_id = 2;

        $cities = DB::table('fiber')->where('user_id', $cust_id)->select('city')->distinct()->get();

        return $cities;
    }

    public function addRowStatus(Request $request){
        
        $data = $request->input('data');
        $trackid = $request->input('trackid');

        $id = DB::table('row_detail')->insertGetId([
            'Status' =>  $data['Status'],
            'Authority' => $data['Authority'],
            'Applied_Date' => $data['Applied_Date'],
            'Approval_Date' => $data['Approval_Date'],
            'cost/km' => $data['cost_km']
        ]);

        DB::table('fiber')->where('id', $trackid)->update([
            'row_status' => $data['Status'],
            'row_detail' => $id
        ]);

        return 'added';

    }

    public function getRowDetail(Request $request){

        $detail = DB::table('row_detail')->where('id', $request->input('detail_id'))->get();

        return $detail;
    }

    public function uptateRowStatus(Request $request){

        $final = array();

        $data = $request->input('data');
        $trackid = $request->input('trackid');
        $row_detail_id = $request->input('row_detail_id');

        DB::table('fiber')->where('id', $trackid)->update([
            'row_status' => $data['Status'],
        ]);

        DB::table('row_detail')->where('id', $row_detail_id)->update([
            'Status' =>  $data['Status'],
            'Authority' => $data['Authority'],
            'Applied_Date' => $data['Applied_Date'],
            'Approval_Date' => $data['Approval_Date'],
            'cost/km' => $data['cost_km']
        ]);

        return 'done';
    }
}