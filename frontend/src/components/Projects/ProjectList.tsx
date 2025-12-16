/**
 * Project List component
 */

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { GET_PROJECTS } from '../../graphql/queries';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Button } from '../UI/Button';
import { Loading } from '../UI/Loading';
import { Modal } from '../UI/Modal';
import type { Project, ProjectStatus } from '../../types';

interface ProjectListProps {
  organizationSlug: string;
}

const statusFilters: { value: string; label: string }[] = [
  { value: '', label: 'All Projects' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function ProjectList({ organizationSlug }: ProjectListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug, status: statusFilter || undefined },
    fetchPolicy: 'cache-and-network',
  });

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  if (loading && !data) {
    return <Loading message="Loading projects..." />;
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400 mb-4">Failed to load projects</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const projects: Project[] = (data as { projects?: Project[] })?.projects || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Projects</h1>
          <p className="text-slate-500">
            Manage your organization's projects
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<PlusIcon className="w-5 h-5" />}
        >
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-slate-400">
          <FunnelIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${statusFilter === filter.value
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold shadow-sm'
                  : 'bg-white text-slate-600 hover:text-emerald-600 hover:bg-slate-50 border border-slate-200'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <PlusIcon className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No projects yet</h3>
          <p className="text-slate-500 mb-6">
            Create your first project to get started
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Project
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          organizationSlug={organizationSlug}
          onSuccess={handleProjectCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}

export default ProjectList;
