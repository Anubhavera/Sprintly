import graphene
from graphene_django import DjangoObjectType
from django_filters import FilterSet, CharFilter, ChoiceFilter

from .models import Organization, Project, Task, TaskComment


class ProjectFilter(FilterSet):
    status = ChoiceFilter(choices=Project.Status.choices)
    name = CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Project
        fields = ['status', 'organization', 'name']


class TaskFilter(FilterSet):
    status = ChoiceFilter(choices=Task.Status.choices)
    priority = ChoiceFilter(choices=Task.Priority.choices)
    title = CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = Task
        fields = ['status', 'priority', 'project', 'assignee_email', 'title']


class OrganizationType(DjangoObjectType):
    project_count = graphene.Int()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'contact_email', 'created_at', 'updated_at', 'projects']
    
    def resolve_project_count(self, info):
        return self.projects.count()


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_task_count = graphene.Int()
    completion_rate = graphene.Float()
    
    class Meta:
        model = Project
        fields = [
            'id', 'organization', 'name', 'description', 'status', 
            'due_date', 'created_at', 'updated_at', 'tasks'
        ]
        filterset_class = ProjectFilter
    
    def resolve_task_count(self, info):
        return self.task_count
    
    def resolve_completed_task_count(self, info):
        return self.completed_task_count
    
    def resolve_completion_rate(self, info):
        return self.completion_rate


class TaskType(DjangoObjectType):
    comment_count = graphene.Int()
    
    class Meta:
        model = Task
        fields = [
            'id', 'project', 'title', 'description', 'status', 'priority',
            'assignee_email', 'due_date', 'created_at', 'updated_at', 'comments'
        ]
        filterset_class = TaskFilter
    
    def resolve_comment_count(self, info):
        return self.comment_count


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'content', 'author_email', 'created_at', 'updated_at']


class ProjectStatisticsType(graphene.ObjectType):
    project_id = graphene.ID()
    project_name = graphene.String()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    in_progress_tasks = graphene.Int()
    todo_tasks = graphene.Int()
    blocked_tasks = graphene.Int()
    completion_rate = graphene.Float()


class OrganizationStatisticsType(graphene.ObjectType):
    organization_id = graphene.ID()
    organization_name = graphene.String()
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    overall_completion_rate = graphene.Float()
