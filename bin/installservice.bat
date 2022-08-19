@echo off
set JVM_PATH="%JRE_HOME%\bin\client\jvm.dll"

set NAME="ERS Reporting Server V7"
set ERS_HOME=

set JAVASERVICE=%ERS_HOME%\bin\JavaService.exe

echo "%JAVASERVICE%"

:check_jre_home
if not "%JRE_HOME%"== "" goto check_ers_home
echo [ERROR] Unable to determine the value of JRE_HOME.
pause
goto eof

:check_ers_home
if not "%ERS_HOME%"== "" goto start
echo [ERROR] Unable to determine the value of ERS_HOME.
pause
goto eof

:start

set ERS_LOG=%ERS_HOME%\WEB-INF\log
set ERS_CONFIG=%ERS_HOME%\WEB-INF\conf
set ERS_CONTEXT=/ReportingServer
set ERS_PORT=8283

set ERS_BIN=%ERS_HOME%\bin
set ERS_LIB=%ERS_BIN%\ers-daemon.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\ers-common.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\ant-1.6.5.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\core-3.1.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\jetty-6.1.26.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\jetty-util-6.1.26.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\jsp-2.1-glassfish-2.1.v20091210.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\jsp-2.1-jetty-6.1.26.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\jsp-api-2.1-glassfish-2.1.v20091210.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty\servlet-api-2.5-20081211.jar

set START="m2soft.ers.daemon.StartUp"
set START_METHOD="main"
set STOP="m2soft.ers.daemon.StartUp"
set STOP_METHOD="stop"

set OUT_LOG="%ERS_LOG%\stdout.log"
set ERR_LOG="%ERS_LOG%\stderr.log"

set MAX_MEMORY=512
set MIN_MEMORY=256

echo "%JVM_PATH%"

"%JAVASERVICE%" -install %NAME% %JVM_PATH% -Djava.class.path="%ERS_LIB%" -Xms%MIN_MEMORY%M -Xmx%MAX_MEMORY%M -Dserver.home="%ERS_HOME%" -Dserver.config="%ERS_CONFIG%" -Dserver.log="%ERS_LOG%" -Dserver.context="%ERS_CONTEXT%" -Dserver.port=%ERS_PORT% -Dserver.daemon=true -start %START% -method %START_METHOD% -stop %STOP% -method %STOP_METHOD% -out %OUT_LOG% -err %ERR_LOG% -auto

net start %NAME%

:eof