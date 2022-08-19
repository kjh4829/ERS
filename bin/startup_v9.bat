@echo off

rem Licensed to the Apache Software Foundation (ASF) under one or more
rem contributor license agreements.  See the NOTICE file distributed with
rem this work for additional information regarding copyright ownership.
rem The ASF licenses this file to You under the Apache License, Version 2.0
rem (the "License"); you may not use this file except in compliance with
rem the License.  You may obtain a copy of the License at
rem
rem     http://www.apache.org/licenses/LICENSE-2.0
rem
rem Unless required by applicable law or agreed to in writing, software
rem distributed under the License is distributed on an "AS IS" BASIS,
rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
rem See the License for the specific language governing permissions and
rem limitations under the License.

rem --------------------------------------------------------------------------
rem  Start Script for the ERS Daemon 7.0
rem --------------------------------------------------------------------------
rem
rem  Environment Variable Prequisites
rem
rem  ERS_HOME         May point at your ERS "installation" directory.
rem  JRE_HOME         Must point at your Java Runtime Environment installation. (jre6 or later version)
rem  JAVA_HOME        Must point at your Java Development Kit installation. (jdk1.6 or later version)
rem  JAVA_EXE         Excution path of your Java Runtime Environment.
rem  JAVA_OPTION      (Optional) Java runtime options used when the "start"
rem  MIN_MEMORY       Minimum memory used by ERS (MB)
rem  MAX_MEMORY       Maximum memory used by ERS (MB)
rem  JDBC_CLASSPATH   User jar files or directories to CLASSPATH  (etc. jdbc drivers)
rem  ERS_LIB          ERS jar files
rem  ERS_PORT         ERS options used when ERS starting the listening port. The default is 8283

rem  $Id: startup.bat,v 7.0 2017/01/01
rem ---------------------------------------------------------------------------

if not "%JAVA_HOME%" == "" goto gotJdkHome
if not "%JRE_HOME%" == "" goto gotJreHome
echo Neither the JAVA_HOME nor the JRE_HOME environment variable is defined
echo At least one of these environment variable is needed to run this program
goto eof

:gotJreHome
if not exist "%JRE_HOME%\bin\java.exe" goto noJavaHome
if not exist "%JRE_HOME%\bin\javaw.exe" goto noJavaHome
goto okJavaHome

:gotJdkHome
if not exist "%JAVA_HOME%\bin\java.exe" goto noJavaHome
if not exist "%JAVA_HOME%\bin\javaw.exe" goto noJavaHome
if not exist "%JAVA_HOME%\bin\jdb.exe" goto noJavaHome
if not exist "%JAVA_HOME%\bin\javac.exe" goto noJavaHome
if not "%JRE_HOME%" == "" goto okJavaHome
set "JRE_HOME=%JAVA_HOME%"
goto okJavaHome

:noJavaHome
echo The JAVA_HOME environment variable is not defined correctly
echo This environment variable is needed to run this program
echo NB: JAVA_HOME should point to a JDK not a JRE
goto eof

:okJavaHome
set ERS_HOME=..
set JAVA_EXE="%JRE_HOME%\bin\java.exe"

:check_ers_home
if not "%ERS_HOME%"== "" goto start
echo [ERROR] Unable to determine the value of ERS_HOME.
goto eof

:start

cls

set ERS_LOG=%ERS_HOME%\WEB-INF\log
set ERS_CONFIG=%ERS_HOME%\WEB-INF\conf
set ERS_CONTEXT=/ReportingServer
set ERS_PORT=8283


set ERS_LIB=.

rem ERS module
set ERS_LIB=%ERS_LIB%;ers-daemon.jar
set ERS_LIB=%ERS_LIB%;ers-common.jar

rem jetty basic modules
set ERS_LIB=%ERS_LIB%;jetty9\jetty-annotations-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-http-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-io-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-jndi-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-plus-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-schemas-3.1.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-security-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-server-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-servlet-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-util-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-webapp-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jetty-xml-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\servlet-api-3.1.jar

rem jndi module
set ERS_LIB=%ERS_LIB%;jetty9\jndi\javax.transaction-api-1.2.jar
set ERS_LIB=%ERS_LIB%;jetty9\jndi\javax.mail.glassfish-1.4.1.v201005082020.jar

rem annotaions module
set ERS_LIB=%ERS_LIB%;jetty9\annotations\asm-5.0.1.jar
set ERS_LIB=%ERS_LIB%;jetty9\annotations\asm-commons-5.0.1.jar
set ERS_LIB=%ERS_LIB%;jetty9\annotations\javax.annotation-api-1.2.jar

rem websocket module
set ERS_LIB=%ERS_LIB%;jetty9\websocket\javax.websocket-api-1.0.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\javax-websocket-client-impl-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\javax-websocket-server-impl-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\websocket-api-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\websocket-client-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\websocket-common-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\websocket-server-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\websocket\websocket-servlet-9.2.29.v20191105.jar

rem jsp module
set ERS_LIB=%ERS_LIB%;jetty9\apache-jsp\org.eclipse.jetty.apache-jsp-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\apache-jsp\org.eclipse.jetty.orbit.org.eclipse.jdt.core-3.8.2.v20130121.jar
set ERS_LIB=%ERS_LIB%;jetty9\apache-jsp\org.mortbay.jasper.apache-el-8.0.33.jar
set ERS_LIB=%ERS_LIB%;jetty9\apache-jsp\org.mortbay.jasper.apache-jsp-8.0.33.jar
set ERS_LIB=%ERS_LIB%;jetty9\apache-jstl\org.apache.taglibs.taglibs-standard-impl-1.2.1.jar
set ERS_LIB=%ERS_LIB%;jetty9\apache-jstl\org.apache.taglibs.taglibs-standard-spec-1.2.1.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\javax.el-3.0.0.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\javax.servlet.jsp.jstl-1.2.2.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\javax.servlet.jsp-2.3.2.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\javax.servlet.jsp-api-2.3.1.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\jetty-jsp-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\jetty-jsp-jdt-2.3.3.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\jstl-impl-1.2.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\org.eclipse.jdt.core-3.8.2.v20130121.jar
set ERS_LIB=%ERS_LIB%;jetty9\jsp\org.eclipse.jetty.orbit.javax.servlet.jsp.jstl-1.2.0.v201105211821.jar

set JDBC_CLASSPATH=

set MIN_MEMORY=256
set MAX_MEMORY=512
set JAVA_OPTIONS=-Xms%MIN_MEMORY%m -Xmx%MAX_MEMORY%m -Dserver.home="%ERS_HOME%" -Dserver.config="%ERS_CONFIG%" -Dserver.log="%ERS_LOG%" -Dserver.context="%ERS_CONTEXT%" -Dserver.port="%ERS_PORT%" -Dserver.daemon=true

echo Loading ERS...
echo %ERS_LIB%%JDBC_CLASSPATH%
%JAVA_EXE% %JAVA_OPTIONS% -cp %ERS_LIB%;%JDBC_CLASSPATH% m2soft.ers.daemon.v9.StartUp

:eof
pause
exit
