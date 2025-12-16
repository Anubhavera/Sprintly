/**
 * Task Detail component with edit and comments
 */

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { GET_TASK_COMMENTS } from '../../graphql/queries';
import { TaskForm } from './TaskForm';
import { CommentList } from '../Comments/CommentList';
import { CommentForm } from '../Comments/CommentForm';
import { Button } from '../UI/Button';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskDetailProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  BLOCKED: 'Blocked',
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export function TaskDetail({ task, onUpdate, onDelete, onClose }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: commentsData, refetch: refetchComments } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId: task.id },
  });

  const comments = (commentsData as { taskComments?: any[] })?.taskComments || [];

  const handleEditSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  if (isEditing) {
    return (
      <TaskForm
        projectId={task.project.id}
        task={task}
        onSuccess={handleEditSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(true)}
          icon={<PencilIcon className="w-4 h-4" />}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          icon={<TrashIcon className="w-4 h-4" />}
        >
          Delete
        </Button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <p className="text-red-600 mb-3">Are you sure you want to delete this task?</p>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={onDelete}>
              Yes, Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Task Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Status</p>
          <p className="text-slate-800 font-medium">{statusLabels[task.status]}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Priority</p>
          <p className="text-slate-800 font-medium">{priorityLabels[task.priority]}</p>
        </div>
        {task.assigneeEmail && (
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Assignee</p>
            <p className="text-slate-800">{task.assigneeEmail}</p>
          </div>
        )}
        {task.dueDate && (
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Due Date</p>
            <p className="text-slate-800">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">Description</p>
          <p className="text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed">
            {task.description}
          </p>
        </div>
      )}

      {/* Comments Section */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-4">
          Comments ({comments.length})
        </h4>

        <CommentForm
          taskId={task.id}
          onSuccess={() => refetchComments()}
        />

        <div className="mt-4">
          <CommentList
            comments={comments}
            onUpdate={() => refetchComments()}
          />
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
