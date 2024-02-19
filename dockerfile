
FROM node:20.11.1-bullseye-slim

# Set working directory
WORKDIR /project

# Install dependencies on the root directory and before copying the source
RUN npm install -g nodemon
RUN npm install --save-dev supertest mocha
RUN npm install socket.io-client
RUN npm install jsdom --save-dev


# Copy package.json and package-lock.json files to the working directory
COPY package.json /project

# Install dependencies
RUN npm install -y

# Copy the rest of the application code
COPY --chown=node:node . /project

# Expose port 80 (assuming your application listens on port 80)
EXPOSE 80

# Define the command to run your application
USER node
CMD ./start.sh