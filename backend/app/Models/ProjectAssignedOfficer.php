<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ProjectAssignedOfficer extends Model
{
    use SoftDeletes;

 protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}