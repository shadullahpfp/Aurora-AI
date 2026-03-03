.PHONY: dev frontend backend build clean docker-up

# Startup Environment Management
dev:
	@echo "Starting full Aurora AI SaaS stack..."
	@make -j 2 frontend backend

frontend:
	@echo "Initializing Next.js environment on port 3000..."
	cd frontend && npm run dev

backend:
	@echo "Initializing FastAPI microservice on port 8000..."
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

build:
	@echo "Generating rigorous production assets..."
	cd frontend && npm ci && npm run build
	@echo "Production binaries synthesized."

docker-up:
	@echo "Mounting isolated Docker containers..."
	cd backend && docker pull postgres:15-alpine && docker-compose up -d

clean:
	@echo "Pruning temporary caches..."
	rm -rf frontend/.next frontend/node_modules
	rm -rf backend/venv backend/__pycache__
	@echo "Clean sweep complete."
