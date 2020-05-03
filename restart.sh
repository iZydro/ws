#!/bin/bash

tasks=$(aws ecs list-tasks --cluster ecs-isidro | jq -r '.taskArns[]')

for i in ${tasks}
do
   # echo "Function:${i}"
   definition=$(aws ecs describe-tasks --tasks ${i} --cluster ecs-isidro | jq -r '.tasks[0].taskDefinitionArn')
   if [ ! -z $(echo $definition | grep "rps-backend") ]
   then
       echo $definition
       aws ecs stop-task --task ${i} --cluster ecs-isidro
       aws ecs run-task --task-definition ${definition} --cluster ecs-isidro
   fi

   if [ ! -z $(echo $definition | grep "rps-frontend") ]
   then
       echo $definition
       aws ecs stop-task --task ${i} --cluster ecs-isidro
       aws ecs run-task --task-definition ${definition} --cluster ecs-isidro
   fi

done