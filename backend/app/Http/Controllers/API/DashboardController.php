<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user()
            ->load([
                'roles:id,name',
                'permissions:id,name'
            ]);

        return response()->json([
            'name'        => $user->name,
            'username'    => $user->username,
            'employee_id' => $user->employee_id,
            'email'       => $user->email,
            'mobile'      => $user->mobile,
            'image'       => $user->image,
            'status'      => $user->status,
            'role'        => $user->roles->value('name'),
            'permissions' => $user->permissions->pluck('name')->values()
        ]);
    }
}
