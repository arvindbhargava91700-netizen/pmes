<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        try {

            $data = Role::query()->withCount('permissions')
                ->orderBy('name', 'asc')
                ->paginate(10);

            return response()->json([
                'status' => true,
                'message' => 'Role list fetched successfully',
                'data' => $data->items(),
                'pagination' => [
                    'current_page' => $data->currentPage(),
                    'last_page'    => $data->lastPage(),
                    'per_page'     => $data->perPage(),
                    'total'        => $data->total(),
                ]
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function createPage()
    {
        $permissions = Permission::get();

        $data = [];
        foreach ($permissions as $permission) {
            $temp = explode('.', $permission->name);
            if (!isset($data[$temp[0]])) {
                $data[$temp[0]] = [];
            }
            $name = '';
            for ($i = 0; $i < count($temp); $i++) {
                $namePart = str_replace('_', ' ', $temp[$i]);
                $name .= $namePart;
                if ($i < count($temp) - 1) {
                    $name .= ' ';
                }
            }
            $data[$temp[0]][] = (object) ['name' => $name, 'id' => $permission->id];
        }

        $dataArray = $data;

        return response()->json([
            'status' => true,
            'message' => 'Successfully fetch Permission group wise',
            'data' => $dataArray
        ], 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|unique:roles,name',
            'description' => 'nullable|string|min:5',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {

            $role = Role::create([
                'name'        => $request->name,
                'description' => $request->description,
                'guard_name'  => 'api',
            ]);

            // assign permissions
            if ($request->permissions) {
                $permissionNames = Permission::whereIn('id', $request->permissions)
                    ->pluck('name')->toArray();

                $role->syncPermissions($permissionNames);
            }

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Role Created & Permissions Assigned!'
            ], 201);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong!',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }



    public function show($id)
    {
        try {

            $role = Role::with('permissions:id,name')->find($id);

            if (!$role) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Role not found!'
                ], 404);
            }

            // selected permission ids
            $selectedPermissions = $role->permissions->pluck('id')->toArray();

            // all permissions
            $permissions = Permission::select('id', 'name')->get();

            $groupedPermissions = [];

            foreach ($permissions as $permission) {

                $parts = explode('.', $permission->name);
                $module = $parts[0];

                // format name
                $formattedName = ucwords(str_replace(['.', '_'], ' ', $permission->name));

                $groupedPermissions[$module][] = [
                    'id'       => $permission->id,
                    'name'     => $formattedName,
                    'selected' => in_array($permission->id, $selectedPermissions) ? true : false
                ];
            }

            return response()->json([
                'status'  => true,
                'message' => 'Role fetched successfully',
                'data'    => [
                    'role' => [
                        'id'   => $role->id,
                        'name' => $role->name,
                        'description' => $role->description
                    ],
                    'permissions' => $groupedPermissions
                ]
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong!',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|unique:roles,name,' . $id,
            'description' => 'nullable|string|min:5',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {

            $role = Role::find($id);

            if (!$role) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Role not found!'
                ], 404);
            }

            $role->update([
                'name'        => $request->name,
                'description' => $request->description,
            ]);

            // update permissions
            if ($request->permissions) {
                $permissionNames = Permission::whereIn('id', $request->permissions)
                    ->pluck('name')->toArray();

                $role->syncPermissions($permissionNames);
            }

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Role & Permissions Updated Successfully!'
            ], 200);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong!',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }




    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $role = Role::find($id);

            if (!$role) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Role not found!'
                ], 404);
            }

            // super admin protection
            if ($role->name === 'Commissioner / Admin') {
                return response()->json([
                    'status'  => false,
                    'message' => 'Admin role cannot be deleted!'
                ], 403);
            }

            // check role assigned to users
            if ($role->users()->count() > 0) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Role already assigned to users, cannot delete!'
                ], 400);
            }

            // detach permissions first (pro safety)
            $role->syncPermissions([]);

            // delete role
            $role->delete();

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Role & Permissions Deleted Successfully!'
            ], 200);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong!',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
