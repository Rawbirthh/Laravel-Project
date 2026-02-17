import { User } from './User';
import { Department } from './Department';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    assigned_to: number;
    assigned_by: number;
    department_id?: number;
    group_id?: string;
    created_at: string;
    updated_at: string;
    assignee?: User;
    assigner?: User;
    department?: Department;
    other_group_assignees?: Task[];
}

export interface TaskStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    high_priority?: number;
}