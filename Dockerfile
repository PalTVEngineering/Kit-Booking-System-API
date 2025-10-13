#DO NOT CHANGE!!!

#Uses a lightweight Node.js image
FROM node:20-alpine

#Set the working directory inside the container
WORKDIR /app

#Copy package files and install dependencies
COPY package*.json ./
RUN npm install

#Copy the rest of your application's source code
COPY . .

#Expose the API port
EXPOSE 5000

#Start the application
CMD ["node", "server.js"]
