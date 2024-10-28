# Use the Debian-based Node.js image
FROM node:18-bullseye

# Update package list and install Python, pip, and required build tools
RUN apt-get update && apt-get install -y python3 python3-pip gcc libffi-dev

# Install SAM CLI and LocalStack
RUN pip3 install aws-sam-cli localstack

# Set environment variables to disable Docker mode
ENV LOCALSTACK_HOSTNAME=localhost
ENV LOCALSTACK_DOCKER_HOST=""
ENV LOCALSTACK_DOCKER_API=""
ENV LOCALSTACK_API_KEY=""
ENV LOCALSTACK_DOCKER=0

# Expose LocalStack port
EXPOSE 4566

# Start LocalStack in foreground mode
CMD ["localstack", "start"]
