import { gql } from '@apollo/client';

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $contactEmail: String!, $slug: String) {
    createOrganization(name: $name, contactEmail: $contactEmail, slug: $slug) {
      success
      errors
      organization {
        id
        name
        slug
        contactEmail
      }
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $name: String, $contactEmail: String) {
    updateOrganization(id: $id, name: $name, contactEmail: $contactEmail) {
      success
      errors
      organization {
        id
        name
        contactEmail
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationSlug: String!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      errors
      project {
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
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      errors
      project {
        id
        name
        description
        status
        dueDate
        updatedAt
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      errors
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String
    $priority: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      priority: $priority
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      success
      errors
      task {
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
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $priority: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      priority: $priority
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      success
      errors
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
        updatedAt
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      errors
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      success
      errors
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

export const UPDATE_TASK_COMMENT = gql`
  mutation UpdateTaskComment($id: ID!, $content: String!) {
    updateTaskComment(id: $id, content: $content) {
      success
      errors
      comment {
        id
        content
        updatedAt
      }
    }
  }
`;

export const DELETE_TASK_COMMENT = gql`
  mutation DeleteTaskComment($id: ID!) {
    deleteTaskComment(id: $id) {
      success
      errors
    }
  }
`;
