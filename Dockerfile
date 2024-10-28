# Use Node.js 20.18 as the base image
FROM node:20.18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies, including devDependencies, for the build stage
RUN npm install

# Copy the entire project into the container
COPY . .

# Устанавливаем переменные окружения, чтобы они были доступны на этапе сборки
ENV AUTH_SECRET=$AUTH_SECRET
ENV GCP_BUCKET_NAME=$GCP_BUCKET_NAME
ENV GCP_CLIENT_EMAIL=$GCP_CLIENT_EMAIL
ENV GCP_PRIVATE_KEY=$GCP_PRIVATE_KEY
ENV GCP_PROJECT_ID=$GCP_PROJECT_ID
ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Выполняем сборку проекта
RUN npm run build

# Remove devDependencies after the build to reduce image size
RUN npm prune --production

# Start a new stage for the production environment
FROM node:20.18-alpine

# Set the working directory inside the new container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# Set the environment variable for production
ENV NODE_ENV=production

# Expose port for the application
EXPOSE 8080

# Start the application
CMD ["npm", "start"]