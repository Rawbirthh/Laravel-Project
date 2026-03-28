import { User } from './User';
import { Department } from './Department';

export interface TaskStatus {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface TaskPriority {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface TaskType {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status_id: number;
    priority_id: number;
    type_id?: number;
    due_date?: string;
    group_id?: string;
    assigned_to: number;
    assigned_by: number;
    department_id?: number;
    created_at: string;
    updated_at: string;
    assignee?: User;
    assigner?: User;
    department?: Department;
    task_status?: TaskStatus;
    task_priority?: TaskPriority;
    task_type?: TaskType;
    other_group_assignees?: Task[];
}

export interface TaskStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    high_priority?: number;
}