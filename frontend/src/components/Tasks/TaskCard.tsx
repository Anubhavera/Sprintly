/**
 * Task Card component - Premium Redesign (Light)
 */

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import {
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'status-todo',
  IN_PROGRESS: 'status-in-progress',
  DONE: 'status-done',
  BLOCKED: 'status-blocked',
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  BLOCKED: 'Blocked',
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'priority-low',
  MEDIUM: 'priority-medium',
  HIGH: 'priority-high',
  URGENT: 'priority-urgent',
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="group relative glass-card p-5 cursor-pointer overflow-hidden bg-white border-transparent hover:border-emerald-200"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.05),
              transparent 80%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with priority and status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`status-badge text-[10px] ${priorityStyles[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          {/* Status Dot for Tasks */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
            <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'DONE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                task.status === 'IN_PROGRESS' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]' :
                  task.status === 'BLOCKED' ? 'bg-red-500' :
                    'bg-slate-400'
              }`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {statusLabels[task.status]}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-slate-800 font-semibold mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
          {task.title}
        </h4>

        {/* Description */}
        {task.description && (
          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-slate-500">
          {task.assigneeEmail && (
            <div className="flex items-center gap-1.5" title={task.assigneeEmail}>
              <UserCircleIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium truncate max-w-[80px] text-slate-500 group-hover:text-emerald-600 transition-colors">
                {task.assigneeEmail.split('@')[0]}
              </span>
            </div>
          )}
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'
              }`}>
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs font-medium">
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
          {task.commentCount > 0 && (
            <div className="flex items-center gap-1 ml-auto text-slate-400 group-hover:text-emerald-600 transition-colors">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span className="text-xs font-bold">{task.commentCount}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;
