#!/bin/bash

# This script will start all services needed to run the project in a disposable fashion
# Which means if you exit the environment, it removes all containers the service created.
# This script also runs a build before actual project start.
# The build consists of a linting check and a regression test respectively
IMAGE_NAME="progo"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${SCRIPT_DIR}")"

echo " ----- Starting Up Containers -----"
docker-compose -p progo up -d

echo " ----- Starting Disposable Docker Container -----"
# Now start an interactive session for the web app container's shell and install dependencies
docker run \
-i \
-t \
-p 32801:8080 \
-p 9200 \
-p 9300 \
-p 8585 \
-p 9615 \
-v ${ROOT}:/src \
--env-file=${ROOT}/.env \
--network=progo_main_network \
${IMAGE_NAME} \
sh -c "npm install && bash"

echo " ----- EXITED from disposable container -----"
echo " ----- Removing Exited Containers -----"

# Now grep through all containers and stop those that have been "exited". Only do that for our service.
docker ps -a | grep Exited | awk '{ print $1,$2 }' | \
grep ${IMAGE_NAME} |  awk '{print $1 }' | xargs -I {} docker rm {}
echo " ----- Removed Exited Containers. -----"
echo " ----- Use bin/stop_all.sh to stop all running containers (if you're not sure this worked). -----"


