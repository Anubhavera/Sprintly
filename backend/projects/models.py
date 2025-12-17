from django.db import models
from django.utils.text import slugify
from django.core.validators import EmailValidator


class Organization(models.Model):
    name = models.CharField(max_length=100, help_text="Organization name")
    slug = models.SlugField(
        unique=True, 
        max_length=100,
        help_text="URL-friendly unique identifier"
    )
    contact_email = models.EmailField(
        validators=[EmailValidator()],
        help_text="Primary contact email for the organization"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        COMPLETED = 'COMPLETED', 'Completed'
        ON_HOLD = 'ON_HOLD', 'On Hold'
        CANCELLED = 'CANCELLED', 'Cancelled'

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='projects',
        help_text="Parent organization"
    )
    name = models.CharField(max_length=200, help_text="Project name")
    description = models.TextField(blank=True, help_text="Project description")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        help_text="Current project status"
    )
    due_date = models.DateField(
        null=True, 
        blank=True,
        help_text="Project deadline"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
        unique_together = ['organization', 'name']

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

    @property
    def task_count(self):
        return self.tasks.count()

    @property
    def completed_task_count(self):
        return self.tasks.filter(status=Task.Status.DONE).count()

    @property
    def completion_rate(self):
        total = self.task_count
        if total == 0:
            return 0.0
        return round((self.completed_task_count / total) * 100, 2)


class Task(models.Model):
    class Status(models.TextChoices):
        TODO = 'TODO', 'To Do'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        DONE = 'DONE', 'Done'
        BLOCKED = 'BLOCKED', 'Blocked'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text="Parent project"
    )
    title = models.CharField(max_length=200, help_text="Task title")
    description = models.TextField(blank=True, help_text="Task description")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TODO,
        help_text="Current task status"
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        help_text="Task priority level"
    )
    assignee_email = models.EmailField(
        blank=True,
        help_text="Email of the person assigned to this task"
    )
    due_date = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Task deadline"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', '-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def __str__(self):
        return f"{self.title} ({self.project.name})"

    @property
    def organization(self):
        return self.project.organization

    @property
    def comment_count(self):
        return self.comments.count()


class TaskComment(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments',
        help_text="Parent task"
    )
    content = models.TextField(help_text="Comment content")
    author_email = models.EmailField(
        help_text="Email of the comment author"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Task Comment'
        verbose_name_plural = 'Task Comments'

    def __str__(self):
        return f"Comment by {self.author_email} on {self.task.title}"

    @property
    def organization(self):
        return self.task.project.organization
