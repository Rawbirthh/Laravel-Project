export interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    email_verified_at?: string;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
