export interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    profile_picture_url?: string;
    bio?: string;
    roles: Role[];
    departments?: Department[];
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    permissions?: string[];
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

export interface TaskStatusData {
    id: number;
    name: string;
    tasks?: any[];
}

export interface TaskPriorityData {
    id: number;
    name: string;
    tasks?: any[];
}

export interface TaskTypeData {
    id: number;
    name: string;
    tasks?: any[];
}

export interface OverviewStats {
    total_users: number;
    total_tasks: number;
    total_departments: number;
    total_roles: number;
    users_by_role: Record<string, number>;
    tasks_by_status: Record<string, number>;
    tasks_overdue: number;
}

export interface DistributionItem {
    name: string;
    count: number;
}

export interface TaskDistribution {
    by_status: DistributionItem[];
    by_priority: DistributionItem[];
    by_type: DistributionItem[];
}

export interface DeptItem {
    name: string;
    task_count?: number;
    user_count?: number;
    overdue_count?: number;
}

export interface DepartmentBreakdown {
    task_counts: DeptItem[];
    user_counts: DeptItem[];
    overdue_by_dept: DeptItem[];
}

export interface MonthlyTrends {
    months: string[];
    tasks: number[];
    users: number[];
}

export interface RecentActivity {
    recent_tasks: any[];
    new_users: any[];
}

export interface OverdueTask {
    id: number;
    title: string;
    due_date: string;
    assigned_to: number;
    assigned_by: number;
    status_id: number;
    priority_id: number;
    department_id: number;
    assignee: { id: number; name: string; email: string; profile_picture?: string; profile_picture_url?: string };
    assigner: { id: number; name: string };
    taskStatus: { id: number; name: string };
    taskPriority: { id: number; name: string };
    department: { id: number; name: string };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        permissions: string[];
        role: Role[];
    };
};
