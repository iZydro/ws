#!/bin/bash
sh ecr-build.sh
$(sh docker-login.sh)
sh ecr-push.sh
