#!/bin/bash

killall webhook
/usr/bin/webhook -hooks /root/webhooks/hooks.json -ip "0.0.0.0" -verbose