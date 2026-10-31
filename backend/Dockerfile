# 1. Use official lightweight Node.js 18 image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first (to leverage Docker layer caching)
COPY package*.json ./

# 4. Install production dependencies
RUN npm install --production

# 5. Copy the rest of the backend source code
COPY . .

# 6. Expose the backend port
EXPOSE 5000

# 7. Start the Express server
CMD ["npm", "start"]
