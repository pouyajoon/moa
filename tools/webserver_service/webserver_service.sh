#!/bin/sh

APPLI_DIR=/home/node/moa

current_pid=`ps x | grep \'node web-server.js\' | grep -v grep | cut -d\' \' -f 1`
[ $current_pid != "" ] && kill -9 $current_pid
cd $APPLI_DIR && node web-server.js 2> &1 > /var/log/moa.log
