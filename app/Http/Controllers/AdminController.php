<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\SearchPaginationRepository;

class AdminController extends Controller
{
    protected $searchPaginationRepository;

    public function __construct(SearchPaginationRepository $searchPaginationRepository)
    {
        $this->searchPaginationRepository = $searchPaginationRepository;
    }

    public function dashboard(Request $request)
    {
        $search = $request->get('search', '');
        $users = User::query()
            ->with('roles')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
