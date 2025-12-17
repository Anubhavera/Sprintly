/**
 * Task Board component - displays tasks grouped by status
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { GET_TASKS } from '../../graphql/queries';
import { UPDATE_TASK, DELETE_TASK } from '../../graphql/mutations';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskDetail } from './TaskDetail';
import { Button } from '../UI/Button';
import { Loading } from '../UI/Loading';
import { Modal } from '../UI/Modal';
import type { Task, TaskStatus } from '../../types';

interface TaskBoardProps {
  projectId: string;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To Do', color: 'from-slate-500 to-slate-600' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'from-cyan-500 to-blue-500' },
  { status: 'DONE', label: 'Done', color: 'from-emerald-500 to-green-500' },
  { status: 'BLOCKED', label: 'Blocked', color: 'from-red-500 to-rose-500' },
];

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: { projectId },
    fetchPolicy: 'cache-and-network',
  });

  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleTaskCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleTaskUpdated = () => {
    setShowDetailModal(false);
    setSelectedTask(null);
    refetch();
  };

  const handleTaskDeleted = async () => {
    if (selectedTask) {
      await deleteTask({ variables: { id: selectedTask.id } });
      setShowDetailModal(false);
      setSelectedTask(null);
      refetch();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask({ variables: { id: taskId, status: newStatus } });
    refetch();
  };

  // Drag and drop handlers
  const handleDragStart = (_e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggingTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDropTargetStatus(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetStatus(status);
  };

  const handleDragLeave = () => {
    setDropTargetStatus(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault();
    setDropTargetStatus(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { taskId, currentStatus } = data;

      if (currentStatus !== newStatus) {
        await handleStatusChange(taskId, newStatus);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }

    setDraggingTaskId(null);
  };

  if (loading && !data) {
    return <Loading message="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400 mb-4">Failed to load tasks</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const tasks: Task[] = (data as { tasks?: Task[] })?.tasks || [];

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, col) => {
    acc[col.status] = tasks.filter((task) => task.status === col.status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Tasks</h2>
        <Button
          size="sm"
          onClick={() => setShowCreateModal(true)}
          icon={<PlusIcon className="w-4 h-4" />}
        >
          Add Task
        </Button>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.status}
            className="space-y-4"
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
              <h3 className="font-medium text-slate-600">{column.label}</h3>
              <span className="ml-auto text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                {tasksByStatus[column.status]?.length || 0}
              </span>
            </div>

            {/* Tasks */}
            <div
              className={`space-y-3 min-h-[200px] rounded-xl p-2 transition-all duration-200 ${dropTargetStatus === column.status
                ? 'bg-emerald-50 border-2 border-dashed border-emerald-300 ring-2 ring-emerald-200'
                : 'border-2 border-transparent'
                }`}
            >
              {tasksByStatus[column.status]?.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskCard
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    isDragging={draggingTaskId === task.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                </motion.div>
              ))}

              {tasksByStatus[column.status]?.length === 0 && (
                <div className={`h-32 border-2 border-dashed rounded-xl flex items-center justify-center ${dropTargetStatus === column.status ? 'border-emerald-400 bg-emerald-100/50' : 'border-slate-300'
                  }`}>
                  <p className="text-slate-500 text-sm">
                    {dropTargetStatus === column.status ? 'Drop here' : 'No tasks'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          projectId={projectId}
          onSuccess={handleTaskCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Detail Modal */}
      {selectedTask && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedTask.title}
          size="xl"
        >
          <TaskDetail
            task={selectedTask}
            projectId={projectId}
            onUpdate={handleTaskUpdated}
            onDelete={handleTaskDeleted}
            onClose={() => setShowDetailModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default TaskBoard;
