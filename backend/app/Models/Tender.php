<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tender extends Model
{
    use SoftDeletes;

    protected $guarded = [];
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function workType()
    {
        return $this->belongsTo(WorkType::class);
    }

    public function timeline()
    {
        return $this->hasOne(TenderTimeline::class);
    }

    public function milestones()
    {
        return $this->hasMany(TenderMilestone::class)->orderBy('sequence_no');
    }

    public function documents()
    {
        return $this->hasMany(TenderDocument::class);
    }


    public function tenderStatus(){
        return $this->belongsTo(TenderStatusMaster::class);
    }
}
