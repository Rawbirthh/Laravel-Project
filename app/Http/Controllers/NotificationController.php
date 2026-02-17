<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $notifications = $this->notificationService->getNotifications($user, 15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function unread()
    {
        $user = auth()->user();
        $notifications = $this->notificationService->getUnreadNotifications($user, 10);
        $count = $this->notificationService->getUnreadCount($user);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $count,
        ]);
    }

    public function markAsRead(Request $request, int $id)
    {
        $user = auth()->user();
        $success = $this->notificationService->markAsRead($id, $user);

        return response()->json(['success' => $success]);
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        $this->notificationService->markAllAsRead($user);

        return response()->json(['success' => true]);
    }
}
