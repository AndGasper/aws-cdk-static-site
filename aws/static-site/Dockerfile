FROM node:8

# Create Application Directory
WORKDIR /usr/src/app

# Copy over the package.json 
COPY ["package*.json", "/usr/src/app"]

# Copy over the typescript configuration
COPY ["tsconfig.json", "/usr/src/app"]

# Copy over source code
COPY ["src/", "/usr/src/app"]

# Install dependencies
RUN ["npm", "install"]

# List dependencies testing
CMD ["npm", "list"]