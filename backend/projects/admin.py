"""
Django Admin configuration for Project Management System.
"""

from django.contrib import admin
from .models import Organization, Project, Task, TaskComment


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'contact_email', 'created_at']
    search_fields = ['name', 'slug', 'contact_email']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'status', 'due_date', 'task_count', 'completion_rate']
    list_filter = ['status', 'organization', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'task_count', 'completed_task_count', 'completion_rate']
    
    def task_count(self, obj):
        return obj.task_count
    task_count.short_description = 'Total Tasks'
    
    def completion_rate(self, obj):
        return f"{obj.completion_rate}%"
    completion_rate.short_description = 'Completion'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'priority', 'assignee_email', 'due_date']
    list_filter = ['status', 'priority', 'project__organization', 'created_at']
    search_fields = ['title', 'description', 'assignee_email']
    readonly_fields = ['created_at', 'updated_at', 'comment_count']
    
    def comment_count(self, obj):
        return obj.comment_count
    comment_count.short_description = 'Comments'


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'created_at']
    list_filter = ['task__project__organization', 'created_at']
    search_fields = ['content', 'author_email']
    readonly_fields = ['created_at', 'updated_at']
