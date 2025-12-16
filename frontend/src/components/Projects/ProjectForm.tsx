/**
 * Project Form component for create/edit
 */

import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { CREATE_PROJECT, UPDATE_PROJECT } from '../../graphql/mutations';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';
import { Select } from '../UI/Select';
import { Button } from '../UI/Button';
import type { Project, ProjectStatus } from '../../types';

interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
}

interface ProjectFormProps {
  organizationSlug: string;
  project?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function ProjectForm({ organizationSlug, project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || 'ACTIVE',
      dueDate: project?.dueDate || '',
    },
  });

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT);
  const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        await updateProject({
          variables: {
            id: project.id,
            ...data,
            dueDate: data.dueDate || null,
          },
        });
      } else {
        await createProject({
          variables: {
            organizationSlug,
            ...data,
            dueDate: data.dueDate || null,
          },
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const isLoading = isSubmitting || creating || updating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Project Name"
        placeholder="Enter project name"
        {...register('name', {
          required: 'Project name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
        error={errors.name?.message}
      />

      <Textarea
        label="Description"
        placeholder="Describe your project..."
        rows={4}
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
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
