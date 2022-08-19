#!/bin/sh
#
# -------------------- Stop ERS Daemon --------------------
echo "Shutdown ERS Daemon ...: `cat $PWD/daemon.pid`"
kill -9 `cat $PWD/daemon.pid`
echo "" > $PWD/daemon.pid
