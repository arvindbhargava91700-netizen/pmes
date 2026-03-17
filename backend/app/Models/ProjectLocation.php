<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ProjectLocation extends Model
{
    use SoftDeletes;

 protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id')->withTrashed();
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class, 'ward_id')->withTrashed();
    }

}