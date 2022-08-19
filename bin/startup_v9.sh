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
# Start Script for the ERS Daemon 7.0
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

# $Id: startup.sh,v 7.0 2017/01/01
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

ERS_LOG="$ERS_HOME"/WEB-INF/log
ERS_CONFIG="$ERS_HOME"/WEB-INF/conf
ERS_CONTEXT=/ReportingServer
ERS_PORT=8283

ERS_LIB=.

# ERS module
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/ers-daemon.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/ers-common.jar

# jetty basic module
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-annotations-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-http-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-io-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-jndi-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-plus-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-schemas-3.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-security-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-server-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-servlet-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-util-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-webapp-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jetty-xml-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/servlet-api-3.1.jar

# jndi module
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jndi/javax.transaction-api-1.2.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jndi/javax.mail.glassfish-1.4.1.v201005082020.jar

# annotaions module
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/annotations/asm-5.0.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/annotations/asm-commons-5.0.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/annotations/javax.annotation-api-1.2.jar

# websocket module
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/javax.websocket-api-1.0.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/javax-websocket-client-impl-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/javax-websocket-server-impl-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/websocket-api-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/websocket-client-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/websocket-common-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/websocket-server-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/websocket/websocket-servlet-9.2.29.v20191105.jar

# jsp module
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/apache-jsp/org.eclipse.jetty.apache-jsp-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/apache-jsp/org.eclipse.jetty.orbit.org.eclipse.jdt.core-3.8.2.v20130121.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/apache-jsp/org.mortbay.jasper.apache-el-8.0.33.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/apache-jsp/org.mortbay.jasper.apache-jsp-8.0.33.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/apache-jstl/org.apache.taglibs.taglibs-standard-impl-1.2.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/apache-jstl/org.apache.taglibs.taglibs-standard-spec-1.2.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/javax.el-3.0.0.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/javax.servlet.jsp.jstl-1.2.2.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/javax.servlet.jsp-2.3.2.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/javax.servlet.jsp-api-2.3.1.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/jetty-jsp-9.2.29.v20191105.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/jetty-jsp-jdt-2.3.3.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/jstl-impl-1.2.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/org.eclipse.jdt.core-3.8.2.v20130121.jar
ERS_LIB="$ERS_LIB":"$ERS_HOME"/bin/jetty9/jsp/org.eclipse.jetty.orbit.javax.servlet.jsp.jstl-1.2.0.v201105211821.jar

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

"$JRE_HOME"/bin/java $JAVA_OPTIONS -classpath .:"$ERS_LIB":"$JDBC_CLASSPATH" m2soft.ers.daemon.v9.StartUp & 
JAVA_PID=$!
echo $JAVA_PID > $PWD/daemon.pid
