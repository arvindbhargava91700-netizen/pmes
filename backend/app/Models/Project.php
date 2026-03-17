<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function location()
    {
           return $this->hasOne(ProjectLocation::class)->with(['zone:id,name','ward:id,name']);
    }

    public function officers()
    {
        return $this->hasOne(ProjectAssignedOfficer::class);
    }


    public function milestones()
{
    return $this->hasMany(ProjectMilestone::class);
}

public function photos()
{
    return $this->hasMany(ProjectProgressPhoto::class);
}


public function department()
{
    return $this->belongsTo(Department::class, 'department_id', 'id')->withTrashed();
}
public function work_classification()
{
    return $this->belongsTo(WorkClassifaction::class, 'work_classification_id', 'id')->withTrashed();
}
public function contractor()
{
    return $this->belongsTo(Contractor::class, 'contractor_id', 'id')->withTrashed();
}
public function billings()
{
    return $this->hasMany(Billing::class, 'project_id');
}

public function status()
{
    return $this->belongsTo(ProjectStatusMaster::class,'project_status_id','id');
}



public static function generateProjectCode()
{
    $year = date('Y');

    $lastProject = self::whereYear('created_at', $year)
        ->latest('id')
        ->first();
    $nextNumber = 1;
    if ($lastProject && $lastProject->project_code) {
        $parts = explode('-', $lastProject->project_code);
        $lastNumber = (int) end($parts);
        $nextNumber = $lastNumber + 1;
    }
    $formattedNumber = str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    return "PRJ-{$year}-{$formattedNumber}";
}

}