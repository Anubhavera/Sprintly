import graphene
from graphene_django.filter import DjangoFilterConnectionField
from django.db.models import Count, Q
from django.utils.text import slugify

from .models import Organization, Project, Task, TaskComment
from .types import (
    OrganizationType, ProjectType, TaskType, TaskCommentType,
    ProjectStatisticsType, OrganizationStatisticsType
)


class Query(graphene.ObjectType):
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(
        OrganizationType,
        id=graphene.ID(),
        slug=graphene.String()
    )
    
    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True),
        status=graphene.String()
    )
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    
    tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(required=True),
        status=graphene.String(),
        priority=graphene.String()
    )
    task = graphene.Field(TaskType, id=graphene.ID(required=True))
    
    task_comments = graphene.List(
        TaskCommentType,
        task_id=graphene.ID(required=True)
    )
    
    project_statistics = graphene.Field(
        ProjectStatisticsType,
        project_id=graphene.ID(required=True)
    )
    organization_statistics = graphene.Field(
        OrganizationStatisticsType,
        organization_slug=graphene.String(required=True)
    )
    
    def resolve_organizations(self, info):
        return Organization.objects.all()
    
    def resolve_organization(self, info, id=None, slug=None):
        if id:
            return Organization.objects.filter(id=id).first()
        if slug:
            return Organization.objects.filter(slug=slug).first()
        return None
    
    def resolve_projects(self, info, organization_slug, status=None):
        queryset = Project.objects.filter(organization__slug=organization_slug)
        if status:
            queryset = queryset.filter(status=status)
        return queryset
    
    def resolve_project(self, info, id):
        return Project.objects.filter(id=id).first()
    
    def resolve_tasks(self, info, project_id, status=None, priority=None):
        queryset = Task.objects.filter(project_id=project_id)
        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        return queryset
    
    def resolve_task(self, info, id):
        return Task.objects.filter(id=id).first()
    
    def resolve_task_comments(self, info, task_id):
        return TaskComment.objects.filter(task_id=task_id)
    
    def resolve_project_statistics(self, info, project_id):
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return None
        
        tasks = project.tasks.all()
        total = tasks.count()
        completed = tasks.filter(status=Task.Status.DONE).count()
        in_progress = tasks.filter(status=Task.Status.IN_PROGRESS).count()
        todo = tasks.filter(status=Task.Status.TODO).count()
        blocked = tasks.filter(status=Task.Status.BLOCKED).count()
        
        return ProjectStatisticsType(
            project_id=project.id,
            project_name=project.name,
            total_tasks=total,
            completed_tasks=completed,
            in_progress_tasks=in_progress,
            todo_tasks=todo,
            blocked_tasks=blocked,
            completion_rate=round((completed / total * 100), 2) if total > 0 else 0
        )
    
    def resolve_organization_statistics(self, info, organization_slug):
        org = Organization.objects.filter(slug=organization_slug).first()
        if not org:
            return None
        
        projects = org.projects.all()
        total_projects = projects.count()
        active_projects = projects.filter(status=Project.Status.ACTIVE).count()
        completed_projects = projects.filter(status=Project.Status.COMPLETED).count()
        
        total_tasks = Task.objects.filter(project__organization=org).count()
        completed_tasks = Task.objects.filter(
            project__organization=org,
            status=Task.Status.DONE
        ).count()
        
        return OrganizationStatisticsType(
            organization_id=org.id,
            organization_name=org.name,
            total_projects=total_projects,
            active_projects=active_projects,
            completed_projects=completed_projects,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            overall_completion_rate=round((completed_tasks / total_tasks * 100), 2) if total_tasks > 0 else 0
        )


class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)
        slug = graphene.String()
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, name, contact_email, slug=None):
        try:
            organization = Organization.objects.create(
                name=name,
                slug=slug or slugify(name),
                contact_email=contact_email
            )
            return CreateOrganization(organization=organization, success=True, errors=[])
        except Exception as e:
            return CreateOrganization(organization=None, success=False, errors=[str(e)])


class UpdateOrganization(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        contact_email = graphene.String()
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id, name=None, contact_email=None):
        try:
            organization = Organization.objects.get(id=id)
            if name:
                organization.name = name
            if contact_email:
                organization.contact_email = contact_email
            organization.save()
            return UpdateOrganization(organization=organization, success=True, errors=[])
        except Organization.DoesNotExist:
            return UpdateOrganization(organization=None, success=False, errors=['Organization not found'])
        except Exception as e:
            return UpdateOrganization(organization=None, success=False, errors=[str(e)])


class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, organization_slug, name, description='', status='ACTIVE', due_date=None):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            project = Project.objects.create(
                organization=organization,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            return CreateProject(project=project, success=True, errors=[])
        except Organization.DoesNotExist:
            return CreateProject(project=None, success=False, errors=['Organization not found'])
        except Exception as e:
            return CreateProject(project=None, success=False, errors=[str(e)])


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id, name=None, description=None, status=None, due_date=None):
        try:
            project = Project.objects.get(id=id)
            if name is not None:
                project.name = name
            if description is not None:
                project.description = description
            if status is not None:
                project.status = status
            if due_date is not None:
                project.due_date = due_date
            project.save()
            return UpdateProject(project=project, success=True, errors=[])
        except Project.DoesNotExist:
            return UpdateProject(project=None, success=False, errors=['Project not found'])
        except Exception as e:
            return UpdateProject(project=None, success=False, errors=[str(e)])


class DeleteProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id):
        try:
            project = Project.objects.get(id=id)
            project.delete()
            return DeleteProject(success=True, errors=[])
        except Project.DoesNotExist:
            return DeleteProject(success=False, errors=['Project not found'])
        except Exception as e:
            return DeleteProject(success=False, errors=[str(e)])


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, project_id, title, description='', status='TODO', 
               priority='MEDIUM', assignee_email='', due_date=None):
        try:
            project = Project.objects.get(id=project_id)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status,
                priority=priority,
                assignee_email=assignee_email,
                due_date=due_date
            )
            return CreateTask(task=task, success=True, errors=[])
        except Project.DoesNotExist:
            return CreateTask(task=None, success=False, errors=['Project not found'])
        except Exception as e:
            return CreateTask(task=None, success=False, errors=[str(e)])


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id, title=None, description=None, status=None, 
               priority=None, assignee_email=None, due_date=None):
        try:
            task = Task.objects.get(id=id)
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if status is not None:
                task.status = status
            if priority is not None:
                task.priority = priority
            if assignee_email is not None:
                task.assignee_email = assignee_email
            if due_date is not None:
                task.due_date = due_date
            task.save()
            return UpdateTask(task=task, success=True, errors=[])
        except Task.DoesNotExist:
            return UpdateTask(task=None, success=False, errors=['Task not found'])
        except Exception as e:
            return UpdateTask(task=None, success=False, errors=[str(e)])


class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id):
        try:
            task = Task.objects.get(id=id)
            task.delete()
            return DeleteTask(success=True, errors=[])
        except Task.DoesNotExist:
            return DeleteTask(success=False, errors=['Task not found'])
        except Exception as e:
            return DeleteTask(success=False, errors=[str(e)])


class AddTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)
    
    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(id=task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return AddTaskComment(comment=comment, success=True, errors=[])
        except Task.DoesNotExist:
            return AddTaskComment(comment=None, success=False, errors=['Task not found'])
        except Exception as e:
            return AddTaskComment(comment=None, success=False, errors=[str(e)])


class UpdateTaskComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        content = graphene.String(required=True)
    
    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id, content):
        try:
            comment = TaskComment.objects.get(id=id)
            comment.content = content
            comment.save()
            return UpdateTaskComment(comment=comment, success=True, errors=[])
        except TaskComment.DoesNotExist:
            return UpdateTaskComment(comment=None, success=False, errors=['Comment not found'])
        except Exception as e:
            return UpdateTaskComment(comment=None, success=False, errors=[str(e)])


class DeleteTaskComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, id):
        try:
            comment = TaskComment.objects.get(id=id)
            comment.delete()
            return DeleteTaskComment(success=True, errors=[])
        except TaskComment.DoesNotExist:
            return DeleteTaskComment(success=False, errors=['Comment not found'])
        except Exception as e:
            return DeleteTaskComment(success=False, errors=[str(e)])


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    update_organization = UpdateOrganization.Field()
    
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    
    add_task_comment = AddTaskComment.Field()
    update_task_comment = UpdateTaskComment.Field()
    delete_task_comment = DeleteTaskComment.Field()
