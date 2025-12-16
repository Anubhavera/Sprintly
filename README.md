# Mini Project Management System

A multi-tenant project management tool built with Django + GraphQL backend and React + TypeScript frontend.

![Project Management System](https://via.placeholder.com/800x400?text=Project+Management+System)

## 🚀 Features

### Backend (Django + GraphQL)
- **Core Data Models**: Organization, Project, Task, TaskComment with proper relationships
- **GraphQL API**: Complete CRUD operations via Graphene-Django
- **Multi-tenancy**: Organization-based data isolation
- **Statistics**: Project and organization-level statistics (task counts, completion rates)

### Frontend (React + TypeScript)
- **Project Dashboard**: Overview with stats cards and active projects
- **Project Management**: Create, edit, delete projects with validation
- **Task Board**: Kanban-style board with status columns (To Do, In Progress, Done, Blocked)
- **Comment System**: Add and manage comments on tasks
- **Modern UI**: Glassmorphism design, animations, responsive layout

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Django 4.2, Graphene-Django, PostgreSQL |
| Frontend | React 18, TypeScript, Apollo Client, TailwindCSS |
| Styling | Custom CSS with glassmorphism, Framer Motion |
| Database | PostgreSQL (Docker) |

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

## 🏃 Quick Start

### 1. Clone and Setup

```bash
cd project-management-system
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d
```

### 3. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create demo organization
python manage.py shell -c "
from projects.models import Organization
Organization.objects.get_or_create(
    slug='demo-org',
    defaults={'name': 'Demo Organization', 'contact_email': 'demo@example.com'}
)
"

# Start development server
python manage.py runserver
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **GraphQL Playground**: http://localhost:8000/graphql/
- **Django Admin**: http://localhost:8000/admin/

## 📁 Project Structure

```
project-management-system/
├── docker-compose.yml          # PostgreSQL container
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                    # Environment variables
│   ├── core/
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # URL configuration
│   │   └── schema.py           # Root GraphQL schema
│   └── projects/
│       ├── models.py           # Data models
│       ├── schema.py           # GraphQL queries/mutations
│       ├── types.py            # GraphQL types
│       ├── admin.py            # Admin configuration
│       └── tests.py            # Test suite
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── App.tsx             # Main app with routing
    │   ├── index.css           # Global styles
    │   ├── types/              # TypeScript interfaces
    │   ├── graphql/            # Apollo Client + queries
    │   ├── components/         # React components
    │   │   ├── Layout/
    │   │   ├── Projects/
    │   │   ├── Tasks/
    │   │   ├── Comments/
    │   │   └── UI/
    │   ├── pages/
    │   └── hooks/
```

## 🔌 API Documentation

### GraphQL Schema

#### Queries

| Query | Description | Parameters |
|-------|-------------|------------|
| `organizations` | List all organizations | - |
| `organization` | Get single organization | `id` or `slug` |
| `projects` | List projects by organization | `organizationSlug`, `status?` |
| `project` | Get single project | `id` |
| `tasks` | List tasks by project | `projectId`, `status?`, `priority?` |
| `task` | Get single task | `id` |
| `taskComments` | List comments by task | `taskId` |
| `projectStatistics` | Get project stats | `projectId` |
| `organizationStatistics` | Get org stats | `organizationSlug` |

#### Mutations

| Mutation | Description |
|----------|-------------|
| `createOrganization` | Create new organization |
| `updateOrganization` | Update organization |
| `createProject` | Create new project |
| `updateProject` | Update project |
| `deleteProject` | Delete project |
| `createTask` | Create new task |
| `updateTask` | Update task |
| `deleteTask` | Delete task |
| `addTaskComment` | Add comment to task |
| `updateTaskComment` | Update comment |
| `deleteTaskComment` | Delete comment |

### Example Queries

```graphql
# Get all projects for an organization
query {
  projects(organizationSlug: "demo-org") {
    id
    name
    status
    taskCount
    completionRate
  }
}

# Create a new project
mutation {
  createProject(
    organizationSlug: "demo-org"
    name: "New Project"
    description: "Project description"
    status: "ACTIVE"
  ) {
    success
    project {
      id
      name
    }
  }
}

# Create a task
mutation {
  createTask(
    projectId: "1"
    title: "Implement feature"
    priority: "HIGH"
    status: "TODO"
  ) {
    success
    task {
      id
      title
    }
  }
}
```

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
source venv/bin/activate
python manage.py test projects
```

### Frontend Type Check

```bash
cd frontend
npm run build  # This also runs type checking
```

## 🎨 Design Decisions

### Backend Architecture
- **Graphene-Django** for GraphQL: Clean integration with Django ORM
- **Organization-based isolation**: All queries filter by organization slug
- **Computed properties**: Task counts and completion rates calculated dynamically

### Frontend Architecture
- **Apollo Client**: Optimistic updates, cache management, error handling
- **React Hook Form**: Efficient form validation
- **Framer Motion**: Smooth animations and transitions
- **Custom CSS with TailwindCSS**: Glassmorphism design system

## 📈 Trade-offs & Future Improvements

### Current Trade-offs
- No authentication (simplified for demo)
- Basic comment system without threading
- Client-side only filtering (works for demo scale)

### Future Improvements
- [ ] JWT authentication with user management
- [ ] Real-time updates via WebSocket subscriptions
- [ ] Drag-and-drop task reordering
- [ ] File attachments for tasks
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Activity log/audit trail
- [ ] Team members and role management

## 🐳 Docker Deployment (Optional)

For production deployment, additional Dockerfiles can be created:

```yaml
# docker-compose.prod.yml
services:
  db:
    image: postgres:15-alpine
    # ... production config
  
  backend:
    build: ./backend
    command: gunicorn core.wsgi:application --bind 0.0.0.0:8000
    
  frontend:
    build: ./frontend
    # Serve with nginx
```

## 📝 License

MIT License - feel free to use this project as a reference or starting point.

---

**Built with ❤️ for the Software Engineer Screening Task**
