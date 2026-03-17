<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    public function index()
    {
        try {

            $data = Permission::query()
                ->orderBy('name', 'asc')
                ->paginate(10);

            return response()->json([
                'status'  => true,
                'message' => 'Permission list fetched successfully',
                'data'    => $data->items(),
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
                'message' => $e->getMessage(),
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|unique:permissions,name'
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

            Permission::create([
                'name'       => $request->name,
                'guard_name' => 'api'
            ]);

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Permission created successfully!'
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

            $data = Permission::find($id);

            if (!$data) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Permission not found!'
                ], 404);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Permission fetched successfully',
                'data'    => $data
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
            'name' => 'required|string|min:2|unique:permissions,name,' . $id
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

            $permission = Permission::find($id);

            if (!$permission) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Permission not found!'
                ], 404);
            }

            $permission->update([
                'name' => $request->name
            ]);

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Permission updated successfully!'
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

            $permission = Permission::find($id);

            if (!$permission) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Permission not found!'
                ], 404);
            }

            
            $permission->roles()->detach();

            $permission->delete();

            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Permission deleted successfully!'
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
