# CloudDeploy — Local Docker Version

A local two-tier application for practicing Docker:
- React + Vite frontend served by Nginx
- FastAPI backend
- SQLite database persisted in a Docker named volume
- Docker Compose to run both containers together

Terraform, AWS deployment configuration, and GitHub Actions have been removed.

## Requirements
Install Docker Desktop on Windows and ensure the Docker Engine is running.

## Start the app
From this folder in PowerShell:
```powershell
docker compose up --build -d
```

Open:
- Dashboard: http://localhost:8080
- API health: http://localhost:8080/api/health

## Useful Docker commands
```powershell
# Check container status
docker compose ps

# Follow logs
docker compose logs -f

# Show only backend logs
docker compose logs -f backend

# Rebuild after changing source files
docker compose up --build -d

# Stop containers (keeps the database volume)
docker compose down

# Stop containers and delete the database volume (permanent data loss)
docker compose down -v
```

## Build images separately
```powershell
docker build -t clouddeploy-backend:local ./backend
docker build -t clouddeploy-frontend:local ./frontend
```

## Notes
- The app is available locally on port `8080`.
- The backend is reachable by the frontend through the private Compose network and is not published directly on your host.
- SQLite data is stored in the `clouddeploy_data` Docker volume.
- No Docker Hub login, AWS account, Terraform, or GitHub Actions is needed for local use.
