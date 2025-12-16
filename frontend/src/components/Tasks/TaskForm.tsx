/**
 * Task Form component for create/edit
 */

import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { CREATE_TASK, UPDATE_TASK } from '../../graphql/mutations';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';
import { Select } from '../UI/Select';
import { Button } from '../UI/Button';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeEmail: string;
  dueDate: string;
}

interface TaskFormProps {
  projectId: string;
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
  { value: 'BLOCKED', label: 'Blocked' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export function TaskForm({ projectId, task, onSuccess, onCancel }: TaskFormProps) {
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'TODO',
      priority: task?.priority || 'MEDIUM',
      assigneeEmail: task?.assigneeEmail || '',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    },
  });

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK);
  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;

      if (isEditing) {
        await updateTask({
          variables: {
            id: task.id,
            ...data,
            dueDate,
          },
        });
      } else {
        await createTask({
          variables: {
            projectId,
            ...data,
            dueDate,
          },
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const isLoading = isSubmitting || creating || updating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Task Title"
        placeholder="Enter task title"
        {...register('title', {
          required: 'Task title is required',
          minLength: { value: 2, message: 'Title must be at least 2 characters' },
        })}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        placeholder="Describe the task..."
        rows={3}
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          {...register('status')}
          error={errors.status?.message}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          {...register('priority')}
          error={errors.priority?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="email"
          label="Assignee Email"
          placeholder="assignee@example.com"
          {...register('assigneeEmail', {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.assigneeEmail?.message}
        />

        <Input
          type="date"
          label="Due Date"
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
