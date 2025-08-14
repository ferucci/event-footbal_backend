#!/bin/bash
SSH_CONFIG="${1}"
PROJECT_PATH="${2}"
scp -v .env "$SSH_CONFIG:${PROJECT_PATH}/current/"
