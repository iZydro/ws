#!/bin/bash
rm -rf tmp.build
mkdir tmp.build
rsync -Lvr --progress . tmp.build --exclude bin --exclude obj --exclude .git --exclude .idea
cd tmp.build
docker build -f ../Dockerfile . -t 276623230946.dkr.ecr.us-east-1.amazonaws.com/rps-backend:latest
cd ..
rm -rf tmp.build
