#!/bin/bash
SSH_CONFIG="${1}"
PROJECT_PATH="${2}"

# Проверка существования .env
if [ ! -f ".env" ]; then
  echo "Error: .env file not found in current directory!"
  exit 1
fi

scp -v .env "$SSH_CONFIG:${PROJECT_PATH}/current/"
