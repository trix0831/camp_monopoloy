# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# --- FRONTEND BUILD ---
# Copy and build the frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN yarn install && yarn build

# --- BACKEND SETUP ---
WORKDIR /app
COPY backend ./backend

# Copy frontend build output into backend folder to serve it
RUN cp -r ./frontend/build ./backend/frontend_build

# Set backend workdir and install dependencies
WORKDIR /app/backend
RUN yarn install

# Expose backend port
EXPOSE 4000

# Start backend
CMD ["yarn", "server"]
