<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class AdminDashboardCacheObserver
{
    protected array $keys = [
        'admin_overview_stats',
        'admin_task_distribution',
        'admin_department_breakdown',
        'admin_monthly_trends',
        'admin_recent_activity',
        'admin_overdue_tasks',
    ];

    public function created(): void { $this->flush(); }
    public function updated(): void { $this->flush(); }
    public function deleted(): void { $this->flush(); }

    protected function flush(): void
    {
        foreach ($this->keys as $key) {
            Cache::forget($key);
        }
    }
}
