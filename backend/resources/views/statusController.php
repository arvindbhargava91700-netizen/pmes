/**<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\ProjectStatusMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjectStatusController extends Controller
{

    /**
     * List all project statuses (Cached)
     */
    public function index()
    {
        try {

            $data = Cache::remember('project_status_all', 60 * 60, function () {
                return ProjectStatusMaster::select('id','name','color','sort_order')
                        ->orderBy('sort_order','asc')
                        ->get();
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch project status list',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Store new project status
     */
    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:project_status_masters,name'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status = ProjectStatusMaster::create([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('project_status_all');

            return response()->json([
                'status' => true,
                'message' => 'Project status created successfully'
            ],201);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to create project status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show single project status
     */
    public function show($id)
    {
        try {

            $data = Cache::remember("project_status_{$id}", 60 * 60, function () use ($id) {
                return ProjectStatusMaster::findOrFail($id);
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Project status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch project status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Update project status
     */
    public function update(Request $request,$id)
    {
        try {

            $status = ProjectStatusMaster::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:project_status_masters,name,' . $id
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ],422);
            }

            $status->update([
                'name' => $request->name,
                'color' => $request->color,
                'sort_order' => $request->sort_order
            ]);

            Cache::forget('project_status_all');
            Cache::forget("project_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Project status updated successfully',
                'data' => $status
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Project status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to update project status',
                'error' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Delete project status
     */
    public function destroy($id)
    {
        try {

            $status = ProjectStatusMaster::findOrFail($id);
            $status->delete();

            Cache::forget('project_status_all');
            Cache::forget("project_status_{$id}");

            return response()->json([
                'status' => true,
                'message' => 'Project status deleted successfully'
            ],200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'status' => false,
                'message' => 'Project status not found'
            ],404);

        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete project status',
                'error' => $e->getMessage()
            ],500);
        }
    }

}


<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectStatusResource;
use App\Models\ProjectStatusMaster;
use App\Services\ProjectStatusService;
use App\Http\Requests\StoreProjectStatusRequest;
use App\Http\Requests\UpdateProjectStatusRequest;

class ProjectStatusController extends Controller
{

    protected $service;

    public function __construct(ProjectStatusService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $data = $this->service->list();

        return ProjectStatusResource::collection($data);
    }

    public function store(StoreProjectStatusRequest $request)
    {

        $status = $this->service->store($request->validated());

        new ProjectStatusResource($status);
        return response()->json([
            'status' => true,
            'message' => 'Project status created successfully'
        ], 201);
    }

    public function show($id)
    {
        $status = $this->service->list()->find($id);

        return new ProjectStatusResource($status);
    }

    public function update(UpdateProjectStatusRequest $request, $id)
    {
        $status = $this->service->update($id, $request->validated());

        new ProjectStatusResource($status);
        return response()->json([
            'status' => true,
            'message' => 'Project status updated successfully'
        ], status: 200);
    }

    public function destroy($id)
    {

        $status = $this->service->delete($id);
        if ($status) {
            return response()->json([
                'message' => 'Project status deleted successfully'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Project status not found'
            ], 404);
        }
    }


  -->






}