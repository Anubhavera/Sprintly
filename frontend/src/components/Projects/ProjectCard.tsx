/**
 * Project Card component - Premium Redesign (Light)
 */

import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
import { CalendarIcon, CheckCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import type { Project, ProjectStatus } from '../../types';

interface ProjectCardProps {
  project: Project;
}

const statusStyles: Record<ProjectStatus, string> = {
  ACTIVE: 'status-active',
  COMPLETED: 'status-completed',
  ON_HOLD: 'status-on-hold',
  CANCELLED: 'status-cancelled',
};

const statusLabels: Record<ProjectStatus, string> = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
};

export function ProjectCard({ project }: ProjectCardProps) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <Link to={`/projects/${project.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        onMouseMove={handleMouseMove}
        className="group relative glass-card p-6 h-full flex flex-col overflow-hidden bg-white hover:border-emerald-200"
      >
        {/* Spotlight Effect (Green) */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(16, 185, 129, 0.08),
                transparent 80%
              )
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 truncate flex-1 mr-3 tracking-tight font-heading group-hover:text-emerald-700 transition-colors">
              {project.name}
            </h3>
            <span className={`status-badge ${statusStyles[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
            {project.description || 'No description provided'}
          </p>

          <div className="mt-auto space-y-5">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
                <span className="text-xs font-bold text-emerald-600">
                  {project.completionRate}%
                </span>
              </div>
              <div className="progress-bar bg-slate-100">
                <div
                  className="progress-fill"
                  style={{ width: `${project.completionRate}%` }}
                />
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500">
                <ClipboardDocumentListIcon className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium">{project.taskCount} tasks</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium">{project.completedTaskCount} done</span>
              </div>
              {project.dueDate && (
                <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default ProjectCard;
