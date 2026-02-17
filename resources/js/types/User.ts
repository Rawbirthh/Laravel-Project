export interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    profile_picture_url?: string;
    roles?: Role[];
    departments?: Department[];
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    code: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: number;
    code: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}
