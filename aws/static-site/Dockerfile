FROM node:8

# Create Application Directory
WORKDIR /usr/src/app

# Copy over the package.json 
COPY ["package*.json", "/usr/src/app"]

# Copy over source code

# Install dependencies
RUN ["npm", "install"]

# List dependencies testing
CMD ["npm", "list"]