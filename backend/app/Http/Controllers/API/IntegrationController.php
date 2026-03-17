<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    public function index() {
        $cards = [
            'livefeeds' => 127,
            'activealerts' => 5,
            'mentionedsites' => 48,
            'systemhealth' => 98
        ];

        return response()->json([
            'status' => true,
            'data' => $cards
        ], 200);
    }
}
