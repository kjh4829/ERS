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
rem  Start Script for the ERS Daemon 6.2
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

rem  $Id: startup.bat,v 6.2 2014/02/12
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

set ERS_LOG=%ERS_HOME%\log
set ERS_CONFIG=%ERS_HOME%\conf
set ERS_CONTEXT=/ReportingServer
set ERS_PORT=8283

set ERS_LIB=.
set ERS_LIB=%ERS_LIB%;ers-daemon.jar
set ERS_LIB=%ERS_LIB%;ers-common.jar
set ERS_LIB=%ERS_LIB%;jetty\ant-1.6.5.jar
set ERS_LIB=%ERS_LIB%;jetty\core-3.1.1.jar
set ERS_LIB=%ERS_LIB%;jetty\jetty-6.1.26.jar
set ERS_LIB=%ERS_LIB%;jetty\jetty-util-6.1.26.jar
set ERS_LIB=%ERS_LIB%;jetty\jsp-2.1-glassfish-2.1.v20091210.jar
set ERS_LIB=%ERS_LIB%;jetty\jsp-2.1-jetty-6.1.26.jar
set ERS_LIB=%ERS_LIB%;jetty\jsp-api-2.1-glassfish-2.1.v20091210.jar
set ERS_LIB=%ERS_LIB%;jetty\servlet-api-2.5-20081211.jar

set JDBC_CLASSPATH=

set MIN_MEMORY=128
set MAX_MEMORY=256
set JAVA_OPTIONS=-Xms%MIN_MEMORY%m -Xmx%MAX_MEMORY%m -Dserver.home="%ERS_HOME%" -Dserver.config="%ERS_CONFIG%" -Dserver.log="%ERS_LOG%" -Dserver.context="%ERS_CONTEXT%" -Dserver.port="%ERS_PORT%" -Dserver.daemon=true

echo Loading ERS...
echo %ERS_LIB%%JDBC_CLASSPATH%
%JAVA_EXE% %JAVA_OPTIONS% -cp %ERS_LIB%;%JDBC_CLASSPATH% m2soft.ers.daemon.StartUp

:eof
pause
exit
