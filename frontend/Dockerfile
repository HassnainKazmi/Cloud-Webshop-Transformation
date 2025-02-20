# Use Node.js version 22 as the base image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 80

# Start the app
CMD ["npm", "run", "dev"]
