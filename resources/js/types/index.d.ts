export interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    roles: Role[];
    departments?: Department[];
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Role {
    id: number;
    code: string;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface Department {
    id: number;
    code: string;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface SearchFilter {
    search: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
