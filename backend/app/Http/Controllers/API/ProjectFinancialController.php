<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\FundRelease;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ProjectProgressUpdate;
use App\Models\ProjectProgressPhoto;

class ProjectFinancialController extends Controller
{

    // Dashboard cards
public function financial()
{
   // ---------- SUMMARY STATS ----------

    $totalBudget = Project::sum('total_budget');

    $totalReleased = FundRelease::sum('release_amount');

    $pendingBills = Billing::whereHas('status', function($q){
        $q->where('billing_status_id','1');
    })->sum('amount');

    // mismatch alerts
    $projectsMismatch = Project::get()->filter(function ($project) {

        $utilized = Billing::where('project_id',$project->id)
            ->whereHas('status', function($q){
                $q->whereIn('billing_status_id',['2','3']);
            })
            ->sum('amount');

        if($project->total_budget == 0) return false;

        $financialPercent = ($utilized / $project->total_budget) * 100;

        return abs($financialPercent - $project->actual_progress) > 5;

    })->count();


    // ---------- PROJECT TABLE ----------

    $projects = Project::with('department')
        ->get()
        ->map(function ($project) {

            $released = FundRelease::where('project_id',$project->id)
                        ->sum('release_amount');

            $utilized = Billing::where('project_id',$project->id)
                        ->whereHas('status', function($q){
                            $q->whereIn('billing_status_id',['2','3']);
                        })
                        ->sum('amount');

            $pending = Billing::where('project_id',$project->id)
                        ->whereHas('status', function($q){
                            $q->where('billing_status_id','1');
                        })
                        ->sum('amount');

            $financialPercent = $project->total_budget > 0
                ? ($utilized / $project->total_budget) * 100
                : 0;

            $difference = $financialPercent - $project->actual_progress;

            $status = abs($difference) > 5 ? 'MISMATCH' : 'MATCH';

            return [

                'project_id' => $project->id,
                'project_name' => $project->project_name,
                'contractor' => $project->contractor_name,

                'total_budget' => $project->total_budget,
                'released' => $released,
                'utilized' => $utilized,
                'pending' => $pending,

                'physical_progress' => $project->actual_progress,
                'financial_progress' => round($financialPercent,2),

                'difference' => round($difference,2),

                'status' => $status
            ];
        });


    return response()->json([
        'status' => true,
        'data' => [

            'stats' => [
                'total_budget' => $totalBudget,
                'total_released' => $totalReleased,
                'pending_bills' => $pendingBills,
                'mismatch_alerts' => $projectsMismatch
            ],

            'projects' => $projects
        ]
    ]);
}

  

}