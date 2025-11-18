# Multi-Tenant SaaS Booking Platform

A comprehensive booking platform for service businesses (salons, spas, clinics) with multi-tenant architecture.

## Features

- **Multi-Tenant Architecture**: Complete business isolation with row-level security
- **Staff Management**: Invite staff, assign services/locations, track performance
- **Service Catalog**: Manage services with pricing, duration, categories
- **Calendar & Appointments**: Drag-drop scheduling with conflict detection
- **Client Management**: Customer profiles, history, preferences
- **Admin Dashboard**: Analytics, revenue tracking, performance metrics
- **Authentication**: JWT with email verification and remember me functionality

## Tech Stack

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Redis
- JWT Authentication

### Frontend
- React 18
- TypeScript
- TailwindCSS
- React Query
- React Router

### Deployment
- Docker Compose
- Single server deployment ready

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for deployment)

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd IC-booking
```

2. Install dependencies:
```bash
npm run install:all
```

3. Start infrastructure (PostgreSQL & Redis):
```bash
docker-compose up -d postgres redis
```

4. Configure environment variables:

Backend (.env in `backend/` folder):
```env
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=booking_user
DATABASE_PASSWORD=booking_password
DATABASE_NAME=booking_platform
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
PORT=3000
FRONTEND_URL=http://localhost:3001
```

Frontend (.env in `frontend/` folder):
```env
REACT_APP_API_URL=http://localhost:3000
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start development servers:
```bash
npm run dev
```

Backend runs on http://localhost:3000
Frontend runs on http://localhost:3001

### Production Deployment

1. Build and start all services:
```bash
docker-compose up -d
```

2. View logs:
```bash
npm run docker:logs
```

3. Stop services:
```bash
npm run docker:down
```

## Database Schema

- **tenants**: Business isolation and configuration
- **users**: User accounts (shared across tenants)
- **businesses**: Tenant business profiles
- **staff_members**: Links users to businesses with roles
- **services**: Service catalog
- **locations**: Business locations
- **appointments**: Booking records
- **clients**: Customer profiles
- **notifications**: Email/SMS reminder queue

## Role-Based Access Control

- **Owner**: Full access to business settings
- **Admin**: Manage staff, services, appointments
- **Staff**: View schedule, manage own appointments
- **Receptionist**: Book appointments, manage clients

## API Documentation

Once running, API documentation is available at:
- Swagger UI: http://localhost:3000/api/docs

## Project Structure

```
.
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # User management
│   │   ├── tenants/     # Multi-tenancy
│   │   ├── businesses/  # Business profiles
│   │   ├── staff/       # Staff management
│   │   ├── services/    # Service catalog
│   │   ├── locations/   # Location management
│   │   ├── appointments/# Booking system
│   │   ├── clients/     # Client management
│   │   ├── analytics/   # Analytics & reporting
│   │   └── notifications/# Notification system
│   └── migrations/      # Database migrations
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── utils/       # Utilities
└── docker-compose.yml   # Docker orchestration
```

## License

MIT
