sudo rm /home/data/moa/mongod.lock
mongod --dbpath /home/data/moa &
NODE_ENV=dev nodemon moa-server.js