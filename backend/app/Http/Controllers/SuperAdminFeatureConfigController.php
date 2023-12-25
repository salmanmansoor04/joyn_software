<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;


use Illuminate\Http\Request;

class SuperAdminFeatureConfigController extends Controller
{
    public function SAFeatureConfigInit(Request $request){
        
        $final = array();
        
        $customers = DB::table('customers')->get();
        $features = DB::table('feature_library')->get();
        
        foreach($customers as $customer){
            
            $feature_ids = DB::table('customer_features')->where('cust_id', $customer->id)->pluck('feature_id');
            $customer->features = DB::table('feature_library')->whereIn('id', $feature_ids)->get();
        }
        
        $final['customers'] = $customers;
        $final['features'] = $features;
        
        return $final;
        
    }
    
    public function SAFeatureConfigAssign(Request $request){
        
        $features = $request->input('features');
        $cust_id = $request->input('cust_id');
        
        DB::table('customer_features')->where('cust_id', $cust_id)->delete();
        
        foreach($features as $feature){
            DB::table('customer_features')->insert([
                    'cust_id' => $cust_id,
                    'feature_id' => $feature['id']
                ]);
        }
        
        return 'done';
    }
    
    public function SAFeatureConfigDelete(Request $request){
        
        $feature_id = $request->input('feature_id');
        $cust_id = $request->input('cust_id');
        
        DB::table('customer_features')->where('cust_id', $cust_id)->where('feature_id', $feature_id)->delete();
        
        return 'done';
        
    }
}
