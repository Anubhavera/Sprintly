import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
      projectCount
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      createdAt
    }
  }
`;

export const GET_ORGANIZATION_STATISTICS = gql`
  query GetOrganizationStatistics($organizationSlug: String!) {
    organizationStatistics(organizationSlug: $organizationSlug) {
      organizationId
      organizationName
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      overallCompletionRate
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!, $status: String) {
    projects(organizationSlug: $organizationSlug, status: $status) {
      id
      name
      description
      status
      dueDate
      createdAt
      taskCount
      completedTaskCount
      completionRate
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      taskCount
      completedTaskCount
      completionRate
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT_STATISTICS = gql`
  query GetProjectStatistics($projectId: ID!) {
    projectStatistics(projectId: $projectId) {
      projectId
      projectName
      totalTasks
      completedTasks
      inProgressTasks
      todoTasks
      blockedTasks
      completionRate
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID!, $status: String, $priority: String) {
    tasks(projectId: $projectId, status: $status, priority: $priority) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      commentCount
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      commentCount
      project {
        id
        name
        organization {
          id
          slug
        }
      }
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
      updatedAt
    }
  }
`;
