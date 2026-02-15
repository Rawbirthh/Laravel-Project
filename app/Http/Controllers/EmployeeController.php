<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $todos = $user->todos()->latest()->get();

        return Inertia::render('Employee/Dashboard', [
            'todos' => $todos,
        ]);
    }
}
