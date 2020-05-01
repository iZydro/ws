#!/bin/bash
cp env-prod.js src/Settings/index.js
docker build . -t 568076559061.dkr.ecr.eu-west-1.amazonaws.com/zydro-pve-frontend:latest
