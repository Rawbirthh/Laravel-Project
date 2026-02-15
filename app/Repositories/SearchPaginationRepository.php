<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

class SearchPaginationRepository
{
    public function searchAndPaginate(
        Model $model,
        $search = '',
        array $searchableFields = ['code', 'name'],
        int $perPage = 10
    ) {
        return $model
            ->newQuery()
            ->when($search, function ($query) use ($search, $searchableFields) {
                $query->where(function ($q) use ($search, $searchableFields) {
                    foreach ($searchableFields as $field) {
                        $q->orWhere($field, 'like', "%{$search}%");
                    }
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }
}
