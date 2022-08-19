#!/bin/sh

# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#---------------------------------------------------------
# Start Script for the ERS Daemon 6.2
#---------------------------------------------------------
# Environment Variables
#
# ERS_HOME           May point at your ERS installation directory
# ERS_LIB            jar files or directories to the RD Server
# ERS_PORT           RD Server options used when server starting the listening port. The default is 8283
# JRE_HOME           Must point at your Java Runtime Environment installation. (jre6 or later version)
# JAVA_HOME          Must point at your Java Development Kit installation. (jdk6 or later version) 
# JAVA_OPTIONS       (Optional) Java runtime options used when the java(start) command is executed
# JDBC_CLASSPATH     User jar files or directories to CLASSPATH  (etc. jdbc drivers)

# $Id: startup.sh,v 6.2 2014/02/12
#---------------------------------------------------------------------------

# OS specific support.  $var _must_ be set to either true or false.
darwin=false
case "`uname`" in
Darwin*) darwin=true;;
esac

#------------- Find JRE_HOME or JAVA_HOME -----------------
if [ -z "$JAVA_HOME" -a -z "$JRE_HOME" ]; then
  if $darwin; then
    if [ -x '/usr/libexec/java_home' ] ; then
      export JAVA_HOME=`/usr/libexec/java_home`
    elif [ -d "/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Home" ]; then
      export JAVA_HOME="/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Home"
    fi
  else
    JAVA_PATH=`which java 2>/dev/null`
    if [ "x$JAVA_PATH" != "x" ]; then
      JAVA_PATH=`dirname $JAVA_PATH 2>/dev/null`
      JRE_HOME=`dirname $JAVA_PATH 2>/dev/null`
    fi
    if [ "x$JRE_HOME" = "x" ]; then
      # XXX: Should we try other locations?
      if [ -x /usr/bin/java ]; then
        JRE_HOME=/usr
      fi
    fi
  fi
  if [ -z "$JAVA_HOME" -a -z "$JRE_HOME" ]; then
    echo "Neither the JAVA_HOME nor the JRE_HOME environment variable is defined"
    echo "At least one of these environment variable is needed to run this program"
    exit 1
  fi
fi
if [ -z "$JRE_HOME" ]; then
  JRE_HOME="$JAVA_HOME"
fi

#------------------ Set ERS Environments ------------------
ERS_HOME=`cd "../";pwd`

ERS_LOG="$ERS_HOME"/log
ERS_CONFIG="$ERS_HOME"/conf
ERS_CONTEXT=/ReportingServer
ERS_PORT=8283

ERS_LIB=.
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/ers-daemon.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/ers-common.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/ant-1.6.5.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/core-3.1.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/jetty-6.1.26.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/jetty-util-6.1.26.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/jsp-2.1-glassfish-2.1.v20091210.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/jsp-2.1-jetty-6.1.26.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/jsp-api-2.1-glassfish-2.1.v20091210.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty/servlet-api-2.5-20081211.jar

#Add on jdbc driver jar files to JDBC_CLASSPATH
JDBC_CLASSPATH=../lib

#Add on java options 
MAX_MEMORY=512
MIN_MEMORY=256
JAVA_OPTIONS="-Xms"$MIN_MEMORY"m -Xmx"$MAX_MEMORY"m -Dserver.home="$ERS_HOME" -Dserver.config="$ERS_CONFIG" -Dserver.log="$ERS_LOG" -Dserver.context="$ERS_CONTEXT" -Dserver.port="$ERS_PORT" -Dserver.daemon=true"

pid=`cat $PWD/daemon.pid`

if [ "$pid" != "" ] ; then
kill -9 `cat $PWD/daemon.pid`
echo Shutting down ERS Daemon ...:$pid
echo "" > $PWD/daemon.pid
fi

# -------------------- Start ERS Daemon --------------------
echo "Loading ERS...."
echo "Using ERS_HOME: $ERS_HOME"
echo "Using JRE_HOME: $JRE_HOME"
echo "Using CLASSPATH: $ERS_LIB:$JDBC_CLASSPATH"

"$JRE_HOME"/bin/java $JAVA_OPTIONS -classpath .:"$ERS_LIB":"$JDBC_CLASSPATH" m2soft.ers.daemon.StartUp & 
JAVA_PID=$!
echo $JAVA_PID > $PWD/daemon.pid
