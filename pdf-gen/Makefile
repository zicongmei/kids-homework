# Makefile for Math Homework PDF Generator

# Default image repository
IMAGE_REPO ?= zicongmei
# Image name
IMAGE_NAME := math-homework-pdf-gen
# Image tag, defaults to latest
IMAGE_TAG ?= latest

# Full image name with repository and tag
FULL_IMAGE_NAME := $(IMAGE_REPO)/$(IMAGE_NAME):$(IMAGE_TAG)

# Datetime tag for additional versioning
DATETIME_TAG := $(shell date +%Y%m%d-%H%M%S)
FULL_IMAGE_NAME_DATETIME := $(IMAGE_REPO)/$(IMAGE_NAME):$(DATETIME_TAG)

# Default port for running the container locally
LOCAL_PORT ?= 8080
CONTAINER_PORT := 8080

.PHONY: all build push run generate-local-pdf clean requirements server-logs k8s-apply k8s-delete

all: build

# Target to generate requirements.txt if it doesn't exist
# This ensures that the necessary Python packages are listed for Docker build
requirements.txt:
	@echo "Flask>=2.0" > requirements.txt
	@echo "reportlab>=3.6" >> requirements.txt
	@echo "gunicorn>=20.0" >> requirements.txt
	@echo "Generated requirements.txt"

# Target to build the Docker image
# Depends on source files, Dockerfile, and requirements.txt
build: requirements.txt Dockerfile math_question.py server.py
	@echo "Building Docker image $(IMAGE_REPO)/$(IMAGE_NAME) and tagging as '$(IMAGE_TAG)' and '$(DATETIME_TAG)'..."
	docker build -t $(FULL_IMAGE_NAME) -t $(FULL_IMAGE_NAME_DATETIME) .
	@echo "Build complete. Image tagged as $(FULL_IMAGE_NAME) and $(FULL_IMAGE_NAME_DATETIME)."

# Target to push the Docker image to the configured repository
push: build
	@echo "Pushing Docker image $(FULL_IMAGE_NAME) to $(IMAGE_REPO)..."
	docker push $(FULL_IMAGE_NAME)
	@echo "Pushing Docker image $(FULL_IMAGE_NAME_DATETIME) to $(IMAGE_REPO)..."
	docker push $(FULL_IMAGE_NAME_DATETIME)
	@echo "Pushes complete for $(FULL_IMAGE_NAME) and $(FULL_IMAGE_NAME_DATETIME)."

# Target to run the Docker container locally
# Maps local port to container port
run: build
	@echo "Running Docker container $(FULL_IMAGE_NAME) on port $(LOCAL_PORT)..."
	docker run --rm -p $(LOCAL_PORT):$(CONTAINER_PORT) --name math-pdf-gen-container $(FULL_IMAGE_NAME)

# Target to test local PDF generation script (math_question.py)
generate-local-pdf: math_question.py
	@echo "Generating local PDF using math_question.py..."
	python math_question.py
	@echo "Generated math_homework_add_subtract.pdf locally."

# Target to view logs of the running container (assuming container is named)
# This target is more useful if you run the container with a specific name.
# 'make run' now names the container 'math-pdf-gen-container'.
# If run in detached mode (-d), use this target.
server-logs:
	@echo "Fetching logs for container math-pdf-gen-container..."
	docker logs math-pdf-gen-container

# Target to apply Kubernetes deployment
k8s-apply: k8s-deploy.yaml
	@echo "Applying Kubernetes deployment from k8s-deploy.yaml..."
	kubectl apply -f k8s-deploy.yaml

# Target to delete Kubernetes deployment
k8s-delete: k8s-deploy.yaml
	@echo "Deleting Kubernetes deployment from k8s-deploy.yaml..."
	kubectl delete -f k8s-deploy.yaml

# Target to clean up generated files
clean:
	@echo "Cleaning up generated files..."
	rm -f requirements.txt math_homework_add_subtract.pdf
	@echo "Cleanup complete."