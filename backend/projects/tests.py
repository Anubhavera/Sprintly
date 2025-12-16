"""
Tests for Project Management System.

Covers model creation, relationships, and GraphQL operations.
"""

from django.test import TestCase, Client
from django.utils import timezone
from datetime import timedelta
import json

from .models import Organization, Project, Task, TaskComment


class OrganizationModelTests(TestCase):
    """Tests for Organization model."""
    
    def test_create_organization(self):
        """Test creating an organization."""
        org = Organization.objects.create(
            name='Test Organization',
            contact_email='test@example.com'
        )
        self.assertEqual(org.name, 'Test Organization')
        self.assertEqual(org.slug, 'test-organization')
        self.assertEqual(org.contact_email, 'test@example.com')
    
    def test_organization_str(self):
        """Test organization string representation."""
        org = Organization.objects.create(
            name='My Company',
            contact_email='info@mycompany.com'
        )
        self.assertEqual(str(org), 'My Company')
    
    def test_organization_slug_auto_generation(self):
        """Test that slug is auto-generated from name."""
        org = Organization.objects.create(
            name='Another Test Org',
            contact_email='test@test.com'
        )
        self.assertEqual(org.slug, 'another-test-org')


class ProjectModelTests(TestCase):
    """Tests for Project model."""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name='Test Org',
            contact_email='test@org.com'
        )
    
    def test_create_project(self):
        """Test creating a project."""
        project = Project.objects.create(
            organization=self.org,
            name='Test Project',
            description='A test project',
            status=Project.Status.ACTIVE
        )
        self.assertEqual(project.name, 'Test Project')
        self.assertEqual(project.organization, self.org)
        self.assertEqual(project.status, Project.Status.ACTIVE)
    
    def test_project_task_count(self):
        """Test project task count property."""
        project = Project.objects.create(
            organization=self.org,
            name='Project with Tasks'
        )
        Task.objects.create(project=project, title='Task 1')
        Task.objects.create(project=project, title='Task 2')
        Task.objects.create(project=project, title='Task 3')
        
        self.assertEqual(project.task_count, 3)
    
    def test_project_completion_rate(self):
        """Test project completion rate calculation."""
        project = Project.objects.create(
            organization=self.org,
            name='Project for Completion'
        )
        Task.objects.create(project=project, title='Task 1', status=Task.Status.DONE)
        Task.objects.create(project=project, title='Task 2', status=Task.Status.DONE)
        Task.objects.create(project=project, title='Task 3', status=Task.Status.TODO)
        Task.objects.create(project=project, title='Task 4', status=Task.Status.IN_PROGRESS)
        
        self.assertEqual(project.task_count, 4)
        self.assertEqual(project.completed_task_count, 2)
        self.assertEqual(project.completion_rate, 50.0)


class TaskModelTests(TestCase):
    """Tests for Task model."""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name='Test Org',
            contact_email='test@org.com'
        )
        self.project = Project.objects.create(
            organization=self.org,
            name='Test Project'
        )
    
    def test_create_task(self):
        """Test creating a task."""
        task = Task.objects.create(
            project=self.project,
            title='Test Task',
            description='A test task',
            status=Task.Status.TODO,
            priority=Task.Priority.HIGH
        )
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.project, self.project)
        self.assertEqual(task.status, Task.Status.TODO)
        self.assertEqual(task.priority, Task.Priority.HIGH)
    
    def test_task_organization_property(self):
        """Test that task returns correct organization."""
        task = Task.objects.create(
            project=self.project,
            title='Task with Org'
        )
        self.assertEqual(task.organization, self.org)


class TaskCommentModelTests(TestCase):
    """Tests for TaskComment model."""
    
    def setUp(self):
        self.org = Organization.objects.create(
            name='Test Org',
            contact_email='test@org.com'
        )
        self.project = Project.objects.create(
            organization=self.org,
            name='Test Project'
        )
        self.task = Task.objects.create(
            project=self.project,
            title='Test Task'
        )
    
    def test_create_comment(self):
        """Test creating a comment."""
        comment = TaskComment.objects.create(
            task=self.task,
            content='This is a test comment',
            author_email='author@test.com'
        )
        self.assertEqual(comment.content, 'This is a test comment')
        self.assertEqual(comment.author_email, 'author@test.com')
        self.assertEqual(comment.task, self.task)
    
    def test_task_comment_count(self):
        """Test task comment count property."""
        TaskComment.objects.create(
            task=self.task,
            content='Comment 1',
            author_email='user1@test.com'
        )
        TaskComment.objects.create(
            task=self.task,
            content='Comment 2',
            author_email='user2@test.com'
        )
        
        self.assertEqual(self.task.comment_count, 2)


class GraphQLTests(TestCase):
    """Tests for GraphQL API."""
    
    def setUp(self):
        self.client = Client()
        self.org = Organization.objects.create(
            name='Test Org',
            slug='test-org',
            contact_email='test@org.com'
        )
        self.project = Project.objects.create(
            organization=self.org,
            name='Test Project',
            status=Project.Status.ACTIVE
        )
    
    def test_query_organizations(self):
        """Test querying all organizations."""
        query = '''
            query {
                organizations {
                    id
                    name
                    slug
                }
            }
        '''
        response = self.client.post(
            '/graphql/',
            json.dumps({'query': query}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('data', data)
        self.assertIn('organizations', data['data'])
        self.assertEqual(len(data['data']['organizations']), 1)
    
    def test_query_projects_by_organization(self):
        """Test querying projects filtered by organization."""
        query = '''
            query {
                projects(organizationSlug: "demo-org") {
                    id
                    name
                    status
                }
            }
        '''
        response = self.client.post(
            '/graphql/',
            json.dumps({'query': query}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['data']['projects']), 1)
        self.assertEqual(data['data']['projects'][0]['name'], 'Test Project')
    
    def test_create_project_mutation(self):
        """Test creating a project via mutation."""
        mutation = '''
            mutation {
                createProject(
                    organizationSlug: "test-org"
                    name: "New Project"
                    description: "A new project"
                    status: "ACTIVE"
                ) {
                    success
                    project {
                        id
                        name
                    }
                }
            }
        '''
        response = self.client.post(
            '/graphql/',
            json.dumps({'query': mutation}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['data']['createProject']['success'])
        self.assertEqual(data['data']['createProject']['project']['name'], 'New Project')
    
    def test_create_task_mutation(self):
        """Test creating a task via mutation."""
        mutation = f'''
            mutation {{
                createTask(
                    projectId: "{self.project.id}"
                    title: "New Task"
                    description: "A new task"
                    priority: "HIGH"
                ) {{
                    success
                    task {{
                        id
                        title
                        priority
                    }}
                }}
            }}
        '''
        response = self.client.post(
            '/graphql/',
            json.dumps({'query': mutation}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['data']['createTask']['success'])
        self.assertEqual(data['data']['createTask']['task']['title'], 'New Task')


class MultiTenancyTests(TestCase):
    """Tests for multi-tenancy and organization isolation."""
    
    def setUp(self):
        self.client = Client()
        # Create two organizations
        self.org1 = Organization.objects.create(
            name='Organization 1',
            slug='org-1',
            contact_email='org1@test.com'
        )
        self.org2 = Organization.objects.create(
            name='Organization 2',
            slug='org-2',
            contact_email='org2@test.com'
        )
        # Create projects in each organization
        self.project1 = Project.objects.create(
            organization=self.org1,
            name='Org1 Project'
        )
        self.project2 = Project.objects.create(
            organization=self.org2,
            name='Org2 Project'
        )
    
    def test_projects_isolated_by_organization(self):
        """Test that projects are isolated by organization."""
        # Query projects for org-1
        query = '''
            query {
                projects(organizationSlug: "org-1") {
                    id
                    name
                }
            }
        '''
        response = self.client.post(
            '/graphql/',
            json.dumps({'query': query}),
            content_type='application/json'
        )
        data = response.json()
        self.assertEqual(len(data['data']['projects']), 1)
        self.assertEqual(data['data']['projects'][0]['name'], 'Org1 Project')
        
        # Query projects for org-2
        query2 = '''
            query {
                projects(organizationSlug: "org-2") {
                    id
                    name
                }
            }
        '''
        response2 = self.client.post(
            '/graphql/',
            json.dumps({'query': query2}),
            content_type='application/json'
        )
        data2 = response2.json()
        self.assertEqual(len(data2['data']['projects']), 1)
        self.assertEqual(data2['data']['projects'][0]['name'], 'Org2 Project')
