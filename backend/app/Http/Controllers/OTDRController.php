<?php

namespace App\Http\Controllers; 

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Mail;


use Illuminate\Http\Request;

class OTDRController extends Controller
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
    
    public function addOtdr(Request $request){

        $final = array();
        $sequence = 2;

        $city = $request->input('city');
        $area = $request->input('area');
        $locA = $request->input('locA');
        $locB = $request->input('locB');
        $length = $request->input('length');

        DB::table('otdr_results')->insert([
            'city' => $city,
            'area' => $area,
            'locA' => $locA,
            'locB' => $locB,
            'length' => $length,
            'cust_id' => $sequence
        ]);

        return 'added';
    }

    public function otdrInit(Request $request){
        
        $stat = $this->auth_checker($request);
        if($stat == false){
            return "login";
        }

        $data = DB::table('otdr_results')->get();

        return $data;
        
    }

    public function otdrUploadFile(Request $request){

        $file = $request->file('file');
        $id = $request->input('id');

        DB::table('otdr_results')->where('id', $id)->update([
            'pdf_file' => $id . '.' . $file->extension(),
        ]);

        $destinationPath = public_path('otdrResults');

        $file->move($destinationPath, $id . '.' . $file->extension());


        return 'done';
    }

    public function otdrDeleteFile(Request $request){

        $id = $request->input('id');

        $filename = DB::table('otdr_results')->where('id', $id)->pluck('pdf_file')[0];

        DB::table('otdr_results')->where('id', $id)->update([
            'pdf_file' => null,
        ]);

        $file_path = public_path('otdrResults' . '/' . $filename);

        unlink($file_path);

        return $filename;
    }

    public function otdrDeleteEntry(Request $request){

        $id = $request->input('id');
        
        $filename = DB::table('otdr_results')->where('id', $id)->pluck('pdf_file')[0];
        $file_path = public_path('otdrResults' . '/' . $filename);

        DB::table('otdr_results')->where('id', $id)->delete();
        return 'deleted';
        
    }

}