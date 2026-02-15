<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use App\Models\Todo;
use Inertia\Inertia;

class ManagerController extends Controller
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function dashboard()
    {
        $user = auth()->user();
        
        return Inertia::render('Manager/Dashboard', [
            'stats' => $this->userRepository->getDashboardStats(),
            'users' => $this->userRepository->getSameDepartmentUsers($user),
            'recentTodos' => Todo::with('user')->latest()->take(10)->get(),
        ]);
    }

    public function team()
    {
        $users = $this->userRepository->getSameDepartmentUsers(auth()->user());

        return Inertia::render('Manager/Team', ['users' => $users]);
    }
}