#!/bin/sh

APPLI_DIR=/home/moa

current_process=`ps x | grep 'node moa-server.js' | grep -v grep`
if [ "$current_process" != '' ]; then
	current_pid=`echo $current_process | cut -d' ' -f 1`
	kill -9 $current_pid
fi
cd $APPLI_DIR/server && node web-server.js 2>&1 > /var/log/moa.log
