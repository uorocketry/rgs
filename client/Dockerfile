FROM node

WORKDIR /app

# Copy application code
COPY . .

# Expose the application's port
EXPOSE 8080

# Build the application
RUN npm run build
# Run preview server
ENTRYPOINT ["npm", "run", "preview", "--", "--port" , "8080"]