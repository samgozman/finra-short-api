#!/bin/sh

echo "Starting testing by running entrypoint.sh"

# exit if fails
set -e

echo "TEST_MODE=$TEST_MODE"
echo "TEST_PATH=$TEST_PATH"
case $TEST_MODE in
'e2e')
  exec npm run test:e2e
  ;;
'e2e:watch')
  if [ "$TEST_PATH" ]; then
    echo "Running single e2e test for file: $TEST_PATH"
    exec npm run test:e2e:watch:single
  else
    exec npm run test:e2e:watch
  fi
  ;;
*)
  echo 'ERROR: Unrecognized TEST_MODE value'
  ;;
esac
