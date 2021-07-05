#!/bin/bash

git fetch --all
git checkout --force "origin/main"
npm i
npm run build
pm2 restart finra-short-api