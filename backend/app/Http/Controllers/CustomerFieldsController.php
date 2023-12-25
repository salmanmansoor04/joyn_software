<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

use Kutia\Larafirebase\Facades\Larafirebase;

use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;

class CustomerFieldsController extends Controller
{
    public function getFields(Request $request){
        
        $cust_id = $request->input('cust_id');
        
        $fields = DB::table('customer_fields')->where('destination_id', $cust_id)->where('field_type', '<>', 'option')->get();
        
        // $options = DB::table('customer_fields')->where('destination_id', $cust_id)->where('field_type', '<>', 'option')->get();
    }
}
