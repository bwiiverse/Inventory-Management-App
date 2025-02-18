# Use Node.js 22 as the base image for the API
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (better for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose port 3000 so the API can be accessed
EXPOSE 5000

# Start the Node.js API
CMD ["node", "server.js"]
