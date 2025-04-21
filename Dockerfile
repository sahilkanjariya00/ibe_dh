# Step 1: Build the app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build it
COPY . .
RUN npm run build

# Step 2: Serve the build using nginx
FROM nginx:stable-alpine

# Copy built files to nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default nginx config and copy custom one (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
