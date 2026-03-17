<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserAuthMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;


class UserController extends Controller
{
    public function index()
    {
        try {

            $data = User::query()
                ->with('roles:id,name')
                ->select('id', 'name', 'username', 'mobile', 'image', 'status', 'last_login_at')
                ->orderBy('id', 'desc')
                ->paginate(10);


            $users = $data->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'mobile' => $user->mobile,
                    'image' => $user->image,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at,
                    'roles' => $user->roles->pluck('name')
                ];
            });

            return response()->json([
                'status'  => true,
                'message' => 'User list fetched successfully!',
                'data'    => $users,
                'pagination' => [
                    'current_page' => $data->currentPage(),
                    'last_page'    => $data->lastPage(),
                    'per_page'     => $data->perPage(),
                    'total'        => $data->total(),
                ]
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Something went wrong!',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }




    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|min:3',
            'email'  => 'required|email|unique:users,email',
            'mobile' => [
                'required',
                'unique:users,mobile',
                'regex:/^(?:\+91|91)?[6-9]\d{9}$/'
            ],
            'status' => 'required|in:0,1',
            'type'   => 'required|in:password,otp,dsc',

            'password' => [
                'required',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).+$/'
            ],

            'role'  => 'required|exists:roles,name',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ], [
            'password.regex' => 'Password must contain uppercase, lowercase, number and special character',
            'mobile.regex'   => 'Enter valid Indian mobile number',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {

            $imagePath = null;

            if ($request->hasFile('image')) {

                $today = date('d-m-Y');
                $folderPath = public_path("uploads/user/$today");
                if (!File::exists($folderPath)) {
                    File::makeDirectory($folderPath, 0755, true);
                }
                $file = $request->file('image');
                $filename = Str::slug($request->name) . '_' . time() . '.' . $file->getClientOriginalExtension();

                $file->move($folderPath, $filename);

                $imagePath = "uploads/user/$today/" . $filename;
            }
          
            $roleName = trim($request->role);

            switch ($roleName) {
                case 'Commissioner / Admin':
                    $prefix = 'CM';
                    break;

                case 'Municipal Dept User':
                    $prefix = 'MD';
                    break;

                case 'JE / AE / EE':
                    $prefix = 'EN';
                    break;

                case 'Contractor':
                    $prefix = 'CO';
                    break;

                case 'Public User':
                    $prefix = 'PU';
                    break;

                default:
                    $prefix = 'US';
            }

            
            $lastUser = User::where('username', 'like', $prefix . '%')
                ->orderBy('id', 'desc')
                ->first();

            if ($lastUser) {
                $lastNumber = (int) substr($lastUser->username, strlen($prefix));
                $newNumber = $lastNumber + 1;
            } else {
                $newNumber = 1;
            }

            
            $username = $prefix . str_pad($newNumber, 3, '0', STR_PAD_LEFT);


            $user = User::create([
                'name'   => $request->name,
                'username' => $username,
                'email'  => $request->email,
                'mobile' => $request->mobile,
                'status' => $request->status ?? 1,
                'image'  => $imagePath
            ]);


            UserAuthMethod::create([
                'user_id'  => $user->id,
                'type'     => $request->type,
                'password' => Hash::make($request->password),
                'is_active' => $request->status ?? 1,
            ]);

            $user->assignRole($request->role);

            return response()->json([
                'status' => true,
                'message' => 'User Created Successfully!',

            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {

            $user = User::with('roles:id,name')->find($id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'User fetched successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'mobile' => $user->mobile,
                    'status' => $user->status,
                    'image' => $user->image ? url($user->image) : null,
                    'roles' => $user->roles->pluck('name')
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|min:3',
            'email'  => 'required|email|unique:users,email,' . $id,
            'mobile' => [
                'required',
                'unique:users,mobile,' . $id,
                'regex:/^(?:\+91|91)?[6-9]\d{9}$/'
            ],
            'status' => 'required|in:0,1',
            'role'   => 'required|exists:roles,name',
            'password' => 'nullable|min:6|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).+$/',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        try {

            // 🔥 image update
            if ($request->hasFile('image')) {

                // delete old image
                if ($user->image && file_exists(public_path($user->image))) {
                    unlink(public_path($user->image));
                }

                $today = date('d-m-Y');
                $folderPath = public_path("uploads/user/$today");

                if (!File::exists($folderPath)) {
                    File::makeDirectory($folderPath, 0755, true);
                }

                $file = $request->file('image');
                $filename = Str::slug($request->name) . '_' . time() . '.' . $file->getClientOriginalExtension();
                $file->move($folderPath, $filename);

                $user->image = "uploads/user/$today/" . $filename;
            }

            // update basic
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'status' => $request->status
            ]);

            // update password if given
            if ($request->filled('password')) {
                $auth = UserAuthMethod::where('user_id', $user->id)->first();
                if ($auth) {
                    $auth->update([
                        'password' => Hash::make($request->password)
                    ]);
                }
            }

            // 🔥 role update
            $user->syncRoles([$request->role]);

            return response()->json([
                'status' => true,
                'message' => 'User updated successfully'
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found'
                ], 404);
            }


            if ($user->image && file_exists(public_path($user->image))) {
                unlink(public_path($user->image));
            }


            UserAuthMethod::where('user_id', $user->id)->delete();


            $user->syncRoles([]);

            $user->delete();

            return response()->json([
                'status' => true,
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function getUsersByRole($role)
{
    $users = User::role($role)->get();

    return response()->json([
        'status' => true,
        'role' => $role,
        'data' => $users
    ]);
}
}
