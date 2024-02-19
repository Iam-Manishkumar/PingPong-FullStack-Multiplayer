
# FullStack-Multiplayer-PingPong Application for the Master Thesis Project

❯ The application runs on port 80 on the server or on the localhost, and uses socket.io to establish a dual channel multiplayer session. 

❯ The application has been split into two different environments based on nodemon and node.

❯ npm install -y

❯ npm install --save-dev supertest mocha

❯ npm test - to run the unit tests

❯ npm run     
Scripts available in fullstack-multiplayer-pingpong@1.0.0 via `npm run-script`:

prod: node index.js

dev: nodemon index.js 

❯ npm run prod (or) npm run dev

❯ dockerfile has been added to build an image of the application locally. Ensure dockerengine runs locally to build the image. 

Steps to build the image, and deploy the application to a custom port locally

1. chmod +x start.sh
2. npm install --save-dev supertest mocha
3. npm install -y
4. docker build -t pingpong:1 . 
5. docker run -p 4026:80 -v $(pwd):/usr/src/app --env-file .env pingpong:1

❯ Before building the image on docker, export the env variable to build --platform linux/amd64 on the silicon chip host

export DOCKER_DEFAULT_PLATFORM=linux/amd64

❯ To push the image to dockerhub 
1. docker login (use username and the access key)
2. docker build . -t manishkumar10/pingpong:1 --platform linux/amd64
3. docker push manishkumar10/pingpong:1 (name of the image)

Update:
Added tests using mocha and supertest. Supertest allows us to test Nodejs HTTP servers. So for the testing framework, I decide to choose Mocha.