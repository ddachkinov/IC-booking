# Multi-Tenant SaaS Booking Platform - Setup Guide

## Overview

This is a complete multi-tenant SaaS booking platform built with NestJS, React, PostgreSQL, and Redis. The platform supports service businesses like salons, spas, and clinics with features including appointment scheduling, client management, staff management, analytics, and more.

## Tech Stack

### Backend
- **Framework**: NestJS 10
- **ORM**: TypeORM 0.3
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT + Passport
- **Validation**: Class Validator & Transformer
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend)
- **Process Manager**: PM2 (optional)

## Project Structure

```
.
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── tenants/        # Multi-tenancy
│   │   ├── businesses/     # Business profiles
│   │   ├── staff/          # Staff management
│   │   ├── services/       # Service catalog
│   │   ├── locations/      # Locations
│   │   ├── appointments/   # Booking system
│   │   ├── clients/        # Client management
│   │   ├── analytics/      # Analytics & reporting
│   │   ├── notifications/  # Notification system
│   │   └── common/         # Shared utilities
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── stores/        # Zustand stores
│   │   ├── lib/           # Utilities
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── package.json
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 15 (if running locally)
- Redis 7 (if running locally)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IC-booking
   ```

2. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings

   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your settings
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Start PostgreSQL and Redis**
   ```bash
   docker-compose up -d postgres redis
   ```

3. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. **Run database migrations** (when ready)
   ```bash
   cd backend
   npm run migration:run
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   # This starts both backend (port 3000) and frontend (port 3001)
   ```

6. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

## Environment Variables

### Backend (.env)

```env
# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=booking_user
DATABASE_PASSWORD=booking_password
DATABASE_NAME=booking_platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRATION=30d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@bookingplatform.com
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Database Setup

### Create Database (if not using Docker)

```sql
CREATE DATABASE booking_platform;
CREATE USER booking_user WITH ENCRYPTED PASSWORD 'booking_password';
GRANT ALL PRIVILEGES ON DATABASE booking_platform TO booking_user;
```

### Run Migrations

```bash
cd backend
npm run migration:run
```

### Generate New Migration

```bash
cd backend
npm run migration:generate -- src/migrations/MigrationName
```

## Features

### Multi-Tenant Architecture
- Complete business isolation with row-level security
- Tenant ID extraction from subdomain or header
- Automatic tenant context in all queries

### Authentication & Authorization
- JWT-based authentication
- Email verification
- Password reset flow
- Token refresh mechanism
- Role-based access control (Owner, Admin, Staff, Receptionist)

### Core Modules

#### Appointments
- Create, update, cancel appointments
- Conflict detection (no double-booking)
- Status management (scheduled, confirmed, in progress, completed, cancelled, no-show)
- Automatic reminder scheduling

#### Clients
- Complete client profiles
- Appointment history
- Preferences and notes
- Tags and categorization
- Total spent and visit tracking

#### Services
- Service catalog management
- Pricing and duration
- Categories and colors
- Staff assignment
- Online booking settings

#### Staff Management
- Invite staff members
- Role and permission management
- Service and location assignment
- Working hours configuration
- Performance tracking

#### Analytics
- Dashboard statistics
- Revenue tracking
- Top services report
- Staff performance metrics
- Completion rates

#### Notifications
- Scheduled email/SMS reminders
- Appointment confirmations
- Cancellation notifications
- Automated cron-based processing

## API Documentation

Once the backend is running, access the Swagger documentation at:
- http://localhost:3000/api/docs

The API documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## Development Commands

### Root Level
```bash
npm run install:all      # Install all dependencies
npm run dev              # Start both backend and frontend
npm run build            # Build both projects
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs
```

### Backend
```bash
cd backend
npm run start:dev        # Development mode with hot reload
npm run build            # Build for production
npm run start:prod       # Start production build
npm run lint             # Lint code
npm run test             # Run tests
npm run migration:run    # Run migrations
npm run migration:revert # Revert last migration
```

### Frontend
```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

## Production Deployment

### Using Docker Compose

1. **Update environment variables for production**
   - Set `NODE_ENV=production`
   - Use strong secrets for JWT
   - Configure production database
   - Set up SMTP for emails

2. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

3. **Monitor logs**
   ```bash
   docker-compose logs -f
   ```

### Manual Deployment

1. **Build backend**
   ```bash
   cd backend
   npm ci
   npm run build
   ```

2. **Build frontend**
   ```bash
   cd frontend
   npm ci
   npm run build
   ```

3. **Set up Nginx**
   - Use the included `frontend/nginx.conf`
   - Configure SSL/TLS certificates
   - Set up reverse proxy for API

4. **Run database migrations**
   ```bash
   cd backend
   npm run migration:run
   ```

5. **Start backend**
   ```bash
   cd backend
   NODE_ENV=production node dist/main.js
   # Or use PM2: pm2 start dist/main.js --name booking-api
   ```

## Security Considerations

1. **JWT Secrets**: Use strong, randomly generated secrets
2. **Database**: Enable SSL in production
3. **CORS**: Configure allowed origins properly
4. **Rate Limiting**: Implemented in backend (100 requests/minute)
5. **Helmet**: Security headers enabled
6. **Validation**: All inputs validated with class-validator
7. **SQL Injection**: Protected by TypeORM parameterized queries
8. **XSS**: React escapes output by default

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in .env file
- Ensure database exists
- Check firewall rules

### Redis Connection Issues
- Verify Redis is running
- Check Redis host and port
- Test connection: `redis-cli ping`

### Frontend Not Loading
- Check if backend is running
- Verify API_URL in frontend .env
- Check browser console for errors
- Ensure proxy is configured in vite.config.ts

### Docker Issues
- Check Docker is running: `docker info`
- View logs: `docker-compose logs`
- Restart services: `docker-compose restart`
- Rebuild: `docker-compose up -d --build`

## Next Steps

1. **Seed Database**: Create initial data for testing
2. **Configure Email**: Set up SMTP for notifications
3. **Add Tests**: Write unit and integration tests
4. **Customize**: Modify branding and features for your needs
5. **Deploy**: Deploy to production environment
6. **Monitor**: Set up logging and monitoring

## Support

For issues, questions, or contributions, please refer to the repository's issue tracker.

## License

MIT License - See LICENSE file for details
