export interface Role {
    id: number;
    code: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    permission_name: string;
    display_name: string;
}
