# MLops-1 Docker + Neon Setup

This repository is configured for two deployment modes:

- **Local development** with Neon Local proxy using Docker Compose
- **Production** with a real Neon Cloud database URL injected through environment variables

## Files added

- `Dockerfile`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.dockerignore`
- `.env.development`
- `.env.production`
- `README.md`

## How it works

### Development

Local development uses Neon Local via Docker Compose.
The app connects to Neon Local at `postgres://neon:npg@neon-local:5432/dbname`.
The Neon Local proxy automatically creates an ephemeral branch for the database when the container starts.

### Production

Production uses a remote Neon Cloud database URL from `DATABASE_URL`.
No Neon Local proxy is started in production.

## Start locally with Neon Local

1. Create or update `.env.development` with your Neon project values:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://neon:npg@neon-local:5432/dbname
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_default_branch_id_here
NEON_LOCAL=true
NEON_LOCAL_HOST=neon-local
NEON_LOCAL_PORT=5432
```

2. Start development services:

```bash
docker compose -f docker-compose.dev.yml up --build
```

3. Open the app at `http://localhost:3000`.

### What happens in dev

- `neondatabase/neon_local:latest` runs and creates an ephemeral branch from `PARENT_BRANCH_ID`
- Your app connects to that Neon Local proxy via `DATABASE_URL`
- The app uses the Neon serverless driver and local fetch endpoint automatically when `NEON_LOCAL=true`

## Start production with Neon Cloud

1. Create or update `.env.production` with your Neon Cloud URL:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://<username>:<password>@<your-neon-cluster>.neon.tech/<dbname>
JWT_SECRET=your_jwt_secret_here
LOG_LEVEL=info
```

2. Start production services:

```bash
docker compose -f docker-compose.prod.yml up --build
```

3. The app will run on `http://localhost:3000` and connect directly to Neon Cloud.

## Environment handling

- `docker-compose.dev.yml` loads `.env.development` and sets `DATABASE_URL` to the Neon Local endpoint
- `docker-compose.prod.yml` loads `.env.production` and uses the real `DATABASE_URL`
- `NEON_LOCAL=true` toggles Neon Local driver behavior in the app
- `NODE_ENV=production` disables Neon Local-specific configuration

## Notes

- `.env.*` is ignored by Git via `.gitignore`
- Keep your actual Neon Cloud URL and API key secret
- Use `docker compose -f docker-compose.dev.yml down` to stop local dev services
