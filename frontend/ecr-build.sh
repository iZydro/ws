#!/bin/bash
cp env-prod.js src/Settings/index.js
docker build . -t 276623230946.dkr.ecr.us-east-1.amazonaws.com/rps-frontend:latest
