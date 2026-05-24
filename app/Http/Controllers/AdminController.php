<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AdminDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct(
        protected AdminDashboardService $dashboardService
    ) {}

    public function dashboard(Request $request)
    {
        $search = $request->get('search', '');
        $users = User::query()
            ->select(['id', 'name', 'email', 'profile_picture', 'created_at'])
            ->with('roles:id,name,slug')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $overviewStats = $this->dashboardService->getOverviewStats();
        $taskDistribution = $this->dashboardService->getTaskDistribution();
        $departmentBreakdown = $this->dashboardService->getDepartmentBreakdown();
        $monthlyTrends = $this->dashboardService->getMonthlyTrends();
        $recentActivity = $this->dashboardService->getRecentActivity();
        $overdueTasks = $this->dashboardService->getOverdueTasks();

        return Inertia::render('Admin/Dashboard', [
            'users'               => $users,
            'filters'             => ['search' => $search],
            'overviewStats'       => $overviewStats,
            'taskDistribution'    => $taskDistribution,
            'departmentBreakdown' => $departmentBreakdown,
            'monthlyTrends'       => $monthlyTrends,
            'recentActivity'      => $recentActivity,
            'overdueTasks'        => $overdueTasks,
        ]);
    }
}
