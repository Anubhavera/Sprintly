/**
 * Project Detail page
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { GET_PROJECT, GET_PROJECT_STATISTICS } from '../graphql/queries';
import { DELETE_PROJECT } from '../graphql/mutations';
import { TaskBoard } from '../components/Tasks/TaskBoard';
import { ProjectForm } from '../components/Projects/ProjectForm';
import { Button } from '../components/UI/Button';
import { Loading } from '../components/UI/Loading';
import { Modal } from '../components/UI/Modal';
import type { ProjectStatus } from '../types';

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

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PROJECT, {
    variables: { id },
    skip: !id,
  });

  const { data: statsData } = useQuery(GET_PROJECT_STATISTICS, {
    variables: { projectId: id },
    skip: !id,
  });

  const [deleteProject, { loading: deleting }] = useMutation(DELETE_PROJECT);

  const project = (data as { project?: any })?.project;
  const stats = (statsData as { projectStatistics?: any })?.projectStatistics;

  const handleDelete = async () => {
    await deleteProject({ variables: { id } });
    navigate('/projects');
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    refetch();
  };

  if (loading) {
    return <Loading message="Loading project..." />;
  }

  if (error || !project) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400 mb-4">Project not found</p>
        <Link to="/projects" className="text-indigo-400 hover:text-indigo-300">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
              <span className={`status-badge ${statusStyles[project.status as ProjectStatus]}`}>
                {statusLabels[project.status as ProjectStatus]}
              </span>
            </div>
            <p className="text-slate-500 max-w-2xl">
              {project.description || 'No description provided'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowEditModal(true)}
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
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-red-500/30"
        >
          <p className="text-red-500 mb-4">
            Are you sure you want to delete this project? This will also delete all tasks and comments.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
              Yes, Delete Project
            </Button>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Project Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" />
            <span className="text-slate-500 text-sm">Total Tasks</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats?.totalTasks || 0}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-500 text-sm">Completed</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats?.completedTasks || 0}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 rounded-full bg-cyan-500" />
            <span className="text-slate-500 text-sm">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats?.inProgressTasks || 0}</p>
        </div>
        {project.dueDate && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              <span className="text-slate-500 text-sm">Due Date</span>
            </div>
            <p className="text-lg font-medium text-slate-800">
              {new Date(project.dueDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-500 text-sm">Completion Progress</span>
          <span className="text-lg font-bold gradient-text">
            {stats?.completionRate || 0}%
          </span>
        </div>
        <div className="progress-bar h-3">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${stats?.completionRate || 0}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Task Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TaskBoard projectId={id!} />
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
        size="lg"
      >
        <ProjectForm
          organizationSlug={project.organization.slug}
          project={project}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
}

export default ProjectDetail;
