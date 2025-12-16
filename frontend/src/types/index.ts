/**
 * TypeScript interfaces for Project Management System
 */

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
  projectCount?: number;
}

// Project Types
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export interface Project {
  id: string;
  organization: Organization;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedTaskCount: number;
  completionRate: number;
  tasks?: Task[];
}

export interface ProjectInput {
  organizationSlug: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  dueDate?: string;
}

// Task Types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  project: Project;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  comments?: TaskComment[];
}

export interface TaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeEmail?: string;
  dueDate?: string;
}

// Comment Types
export interface TaskComment {
  id: string;
  task: Task;
  content: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentInput {
  taskId: string;
  content: string;
  authorEmail: string;
}

// Statistics Types
export interface ProjectStatistics {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  blockedTasks: number;
  completionRate: number;
}

export interface OrganizationStatistics {
  organizationId: string;
  organizationName: string;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overallCompletionRate: number;
}

// Mutation Response Types
export interface MutationResponse<T> {
  success: boolean;
  errors: string[];
  [key: string]: T | boolean | string[];
}

// UI Helper Types
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  BLOCKED: 'Blocked',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};
