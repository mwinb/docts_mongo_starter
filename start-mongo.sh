set -e

SERVER="my_mongo_server"
PORT="27017"
USERNAME="mongo_user"
PASSWORD="mysecretpassword"
PWD=$(pwd)

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER] --- $PWD"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -p $PORT:$PORT \
  -e MONGO_INITDB_ROOT_USERNAME=$USERNAME \
  -e MONGO_INITDB_ROOT_PASSWORD=$PASSWORD \
  -d mongo:latest


# wait for mongodb to start
echo "sleep wait for server [$SERVER] to start"
sleep 10

# create the db 
echo "FINISHED"