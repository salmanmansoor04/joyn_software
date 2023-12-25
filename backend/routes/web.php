<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $users = DB::table('users')->get();
    return $users;
}); 

// Route::get('/testingDate', function () {
    
//     DB::table('fiber')->insert([
        
//             'data' => "{}",
//             'city' => 'testCity',
//             'region' => 'testRegion',
//             'user_id' => '3',
//             'worker_id' => '4',
//             'dateEntered' => date("Y-m-d H:i:s")
        
//         ]);
// }); 

// Route::get('/testNotification', function () {
//       $beamsClient = new \Pusher\PushNotifications\PushNotifications(
//               array(
//                 "instanceId" => "f88803e7-2705-4329-92a4-390e6574566d",
//                 "secretKey" => "91E0EF5FF10959E88EA94CB3EB3E56B3CB0A880ED946F86666CABC8D761D4DD3",
//               )
//         );
        
//         return $beamsClient;
// });

