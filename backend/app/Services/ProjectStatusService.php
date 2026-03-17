<?php

namespace App\Services;

use App\Models\ProjectStatusMaster;
use Illuminate\Support\Facades\Cache;

class ProjectStatusService
{

    public function list()
    {
        return Cache::remember('project_status_all',3600,function(){

            return ProjectStatusMaster::orderBy('sort_order','asc')->get();

        });
    }

    public function store($data)
    {
        $status = ProjectStatusMaster::create($data);

        Cache::forget('project_status_all');

        return $status;
    }

    public function update($id,$data)
    {
        $status = ProjectStatusMaster::findOrFail($id);

        $status->update($data);

        Cache::forget('project_status_all');
        Cache::forget("project_status_{$id}");

        return $status;
    }

    public function delete($id)
    {
        $status = ProjectStatusMaster::find($id);

        if(!$status){
            return false;
        }

        $status->delete();

        Cache::forget('project_status_all');
        Cache::forget("project_status_{$id}");

        return true;
    }
}