#!/bin/sh

echo "Starting testing by running entrypoint.sh"

# exit if fails
set -e

echo "TEST_MODE=$TEST_MODE"
case $TEST_MODE in
'e2e')
	exec npm run test:e2e
	;;
'e2e:watch')
	exec npm run test:e2e:watch
	;;
*)
	echo 'ERROR: Unrecognized TEST_MODE value'
	;;
esac
