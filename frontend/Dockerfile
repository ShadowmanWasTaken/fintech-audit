# Build the React Application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Vite project for production
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Copy the compiled static files from the builder stage to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Standard HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]