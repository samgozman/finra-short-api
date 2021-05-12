#!/bin/bash

git fetch --all
git checkout --force "origin/main"
npm i
pm2 restart finra-short-api