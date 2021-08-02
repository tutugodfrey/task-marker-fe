#! /bin/bash

IMAGE_NAME_FE="tutug/todoapp-fe"
CONTAINER_NAME_FE=todo-container-fe
API_URL="http://localhost:$PORT_BE/api"

function docker_deploy_help() {
  echo """
    Get help by providing the flags "-h" or "--help"

    build_image_fe: accepts 2 optional arguments ARG 1 API_URL the url to reach backend service, 
    ARG 2 imagename  to overide the default

    run_container_fe: Accept 2 optional arguments, ARG 1 PORT to map to container port, 
    ARG 2 CONTAINER_NAME to overide default container name.
    If not provided, container will map to the same port that was used to build the image.

    delete_image: Delete the image

    delete_container: Delete container. You can also specify -f to delete container if it is running.

    push_image: push docker image to repository
   """
}

if [[ $1 == "-h" ]] || [[ $1 == "--help" ]]; then
  docker_deploy_help
  return 0;
fi


# Frontend
function build_image_fe() {    
  API_URL=$API_URL;
  if [[ $# == 1 ]]; then
    API_URL=$1;
  fi

  if [[ $# == 2 ]]; then
    API_URL=$1;
    IMAGE_NAME_FE=$2
  fi

  command="docker build  -t $IMAGE_NAME_FE:latest --build-arg API_URL=$API_URL -f dockerfile-frontend .";
  echo Executing: $command;
  $command
}

function run_container_fe () {
  PORT_MAP=$PORT_FE
  if [[ $# == 1 ]]; then
    PORT_MAP=$1
  fi

  if [[ $# == 2 ]]; then
    PORT_MAP=$1
    CONTAINER_NAME_FE=$2
  fi

  # command="docker run -d --name $CONTAINER_NAME_FE -p $PORT_MAP:$PORT_FE $IMAGE_NAME_FE";
  command="docker run -d --name $CONTAINER_NAME_FE -p $PORT_MAP:$PORT_FE --link todoapp-container-be:todoapp-container-be $IMAGE_NAME_FE";
  echo Executing: $command;
  $command
}


function push_image() {
  command="docker push $IMAGE_NAME:latest";
  echo Executing: $command;
  $command
}

function delete_image () {
  command="docker rmi $IMAGE_NAME";
  echo Executing: $command;
  $command
}

function delete_container() {
  # Provide the -f flag to stop and delete container
  if [[ $2 == '-f' ]]; then
    command="docker container stop $CONTAINER_NAME";
    echo Executing: $command;
    $command

    command="docker container rm $CONTAINER_NAME";
    echo Executing: $command;
    $command
  else
    command="docker container rm $CONTAINER_NAME";
    echo Executing: $command;
    $command
  fi
}
  
echo Get help by providing the flags "-h" or "--help"
