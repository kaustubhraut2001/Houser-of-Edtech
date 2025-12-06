# Docker Setup Guide

This guide will help you set up and run the Inventory Management application using Docker and PostgreSQL.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Basic knowledge of command line/terminal

## Quick Start

There are two ways to run this application:

### Option 1: Complete Docker Setup (Recommended)

This runs everything (database, app, and pgAdmin) in Docker containers:

#### 1. Set Up Environment Variables

The application uses environment variables defined in `docker-compose.yml`. For production, update the `NEXTAUTH_SECRET` in the docker-compose.yml file:

```bash
# Generate a secure secret
openssl rand -base64 32
```

> [!IMPORTANT]
> For production, replace `NEXTAUTH_SECRET` in docker-compose.yml with your generated secret

#### 2. Build and Start All Services

```bash
docker-compose up --build
```

This will:
- Build the Next.js application Docker image
- Start PostgreSQL database on port `5432`
- Start the Next.js app on port `3000`
- Start pgAdmin (database management UI) on port `5050`
- Automatically run database migrations

Your application will be available at http://localhost:3000

#### 3. Seed the Database (Optional)

To add sample data:

```bash
docker-compose exec app npx prisma db seed
```

---

### Option 2: Local Development with Docker Database

This runs only the database in Docker while you run the app locally:

#### 1. Start PostgreSQL Database Only

First, temporarily comment out the `app` service in `docker-compose.yml`, then:

```bash
docker-compose up -d db pgadmin
```

#### 2. Set Up Environment Variables

Copy the example environment file:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

The `.env` file should contain:

```env
DATABASE_URL="postgresql://inventory_user:inventory_password@localhost:5432/inventory_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

> [!IMPORTANT]
> For production, generate a secure secret with `openssl rand -base64 32` and update `NEXTAUTH_SECRET`

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Run Database Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### 5. Seed the Database (Optional)

```bash
npx prisma db seed
```

#### 6. Start the Development Server

```bash
npm run dev
```

Your application will be available at http://localhost:3000

## Accessing Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Application** | http://localhost:3000 | N/A |
| **pgAdmin** | http://localhost:5050 | Email: `admin@inventory.com`<br>Password: `admin` |
| **PostgreSQL** | `localhost:5432` | User: `inventory_user`<br>Password: `inventory_password`<br>Database: `inventory_db` |

## Common Commands

### Docker Commands

```bash
# Start all services (database + app + pgAdmin)
docker-compose up

# Start all services in detached mode (background)
docker-compose up -d

# Build and start all services (after code changes)
docker-compose up --build

# Stop all services
docker-compose down

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f db

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart app

# Execute commands in the app container
docker-compose exec app npx prisma db seed
docker-compose exec app npx prisma studio

# Stop and remove volumes (clears database data)
docker-compose down -v

# Rebuild app without using cache
docker-compose build --no-cache app
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (WARNING: destroys all data)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

## Connecting to PostgreSQL with pgAdmin

1. Open pgAdmin at http://localhost:5050
2. Login with the credentials above
3. Right-click "Servers" → "Register" → "Server"
4. **General Tab:**
   - Name: `Inventory Database`
5. **Connection Tab:**
   - Host: `db` (if pgAdmin is running in Docker) or `localhost`
   - Port: `5432`
   - Database: `inventory_db`
   - Username: `inventory_user`
   - Password: `inventory_password`
6. Click "Save"

## Troubleshooting

### Port Already in Use

If you get an error about ports already in use:

```bash
# Check what's using the port
# On Windows (PowerShell)
Get-NetTCPConnection -LocalPort 5432

# On Mac/Linux
lsof -i :5432

# Stop the conflicting service or change the port in docker-compose.yml
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs db

# Restart the database
docker-compose restart db
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Reset Everything

If you want to start fresh:

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove node_modules
rm -rf node_modules

# Reinstall dependencies
npm install

# Start fresh
docker-compose up -d
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name <description>`
3. **Prisma generates client automatically**
4. **Use the updated models** in your code

## Production Deployment

For production, you'll need to:

1. Use a managed PostgreSQL database (AWS RDS, Heroku Postgres, etc.)
2. Update `DATABASE_URL` in your production environment
3. Generate a secure `NEXTAUTH_SECRET`
4. Run migrations: `npx prisma migrate deploy`
5. Build the application: `npm run build`
6. Start production server: `npm start`

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
