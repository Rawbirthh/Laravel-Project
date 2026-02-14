<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $users = User::with('roles')->latest()->get();

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
        ]);
    }
}
