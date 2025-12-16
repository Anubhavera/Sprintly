/**
 * Dashboard page
 */

import { useQuery } from '@apollo/client/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { GET_ORGANIZATION_STATISTICS, GET_PROJECTS } from '../graphql/queries';
import { Loading } from '../components/UI/Loading';
import { ProjectCard } from '../components/Projects/ProjectCard';
import type { Project } from '../types';

interface DashboardProps {
  organizationSlug: string;
}

export function Dashboard({ organizationSlug }: DashboardProps) {
  const { data: statsData, loading: statsLoading } = useQuery(GET_ORGANIZATION_STATISTICS, {
    variables: { organizationSlug },
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug, status: 'ACTIVE' },
  });

  const stats = (statsData as { organizationStatistics?: any })?.organizationStatistics;
  const activeProjects: Project[] = (projectsData as { projects?: Project[] })?.projects?.slice(0, 3) || [];

  if (statsLoading && projectsLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderIcon,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      label: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: ChartBarIcon,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: ClipboardDocumentListIcon,
      color: 'from-orange-500 to-amber-500',
    },
    {
      label: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: CheckCircleIcon,
      color: 'from-emerald-500 to-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-800 mb-2"
        >
          Dashboard
        </motion.h1>
        <p className="text-slate-500">
          Welcome back! Here's an overview of your organization.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-slate-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Completion Rate */}
      {stats && stats.totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Overall Progress</h3>
            <span className="text-2xl font-bold gradient-text">
              {stats.overallCompletionRate}%
            </span>
          </div>
          <div className="progress-bar h-4">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${stats.overallCompletionRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Active Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Active Projects</h2>
          <Link
            to="/projects"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FolderIcon className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-500">No active projects yet.</p>
            <Link
              to="/projects"
              className="inline-block mt-4 text-indigo-400 hover:text-indigo-300"
            >
              Create your first project
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
