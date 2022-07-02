#!/bin/sh
if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit -1
fi
VERSION=$1
kind --name featurehub-cluster load docker-image featurehub/mr:$VERSION
kind --name featurehub-cluster load docker-image featurehub/edge:$VERSION
kind --name featurehub-cluster load docker-image featurehub/dacha:$VERSION
