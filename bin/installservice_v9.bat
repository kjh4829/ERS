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

rem ERS module
set ERS_LIB=%ERS_BIN%\ers-daemon.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\ers-common.jar

rem jetty basic modules
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-annotations-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-http-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-io-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-jndi-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-plus-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-schemas-3.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-security-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-server-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-servlet-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-util-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-webapp-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jetty-xml-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\servlet-api-3.1.jar

rem jndi module
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jndi\javax.transaction-api-1.2.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jndi\javax.mail.glassfish-1.4.1.v201005082020.jar

rem annotaions module
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\annotations\asm-5.0.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\annotations\asm-commons-5.0.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\annotations\javax.annotation-api-1.2.jar

rem websocket module
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\javax.websocket-api-1.0.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\javax-websocket-client-impl-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\javax-websocket-server-impl-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\websocket-api-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\websocket-client-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\websocket-common-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\websocket-server-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\websocket\websocket-servlet-9.2.29.v20191105.jar

rem jsp module
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\apache-jsp\org.eclipse.jetty.apache-jsp-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\apache-jsp\org.eclipse.jetty.orbit.org.eclipse.jdt.core-3.8.2.v20130121.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\apache-jsp\org.mortbay.jasper.apache-el-8.0.33.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\apache-jsp\org.mortbay.jasper.apache-jsp-8.0.33.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\apache-jstl\org.apache.taglibs.taglibs-standard-impl-1.2.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\apache-jstl\org.apache.taglibs.taglibs-standard-spec-1.2.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\javax.el-3.0.0.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\javax.servlet.jsp.jstl-1.2.2.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\javax.servlet.jsp-2.3.2.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\javax.servlet.jsp-api-2.3.1.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\jetty-jsp-9.2.29.v20191105.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\jetty-jsp-jdt-2.3.3.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\jstl-impl-1.2.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\org.eclipse.jdt.core-3.8.2.v20130121.jar
set ERS_LIB=%ERS_LIB%;%ERS_BIN%\jetty9\jsp\org.eclipse.jetty.orbit.javax.servlet.jsp.jstl-1.2.0.v201105211821.jar

set START="m2soft.ers.daemon.v9.StartUp"
set START_METHOD="main"
set STOP="m2soft.ers.daemon.v9.StartUp"
set STOP_METHOD="stop"

set OUT_LOG="%ERS_LOG%\stdout.log"
set ERR_LOG="%ERS_LOG%\stderr.log"

set MAX_MEMORY=512
set MIN_MEMORY=256

echo "%JVM_PATH%"

"%JAVASERVICE%" -install %NAME% %JVM_PATH% -Djava.class.path="%ERS_LIB%" -Xms%MIN_MEMORY%M -Xmx%MAX_MEMORY%M -Dserver.home="%ERS_HOME%" -Dserver.config="%ERS_CONFIG%" -Dserver.log="%ERS_LOG%" -Dserver.context="%ERS_CONTEXT%" -Dserver.port=%ERS_PORT% -Dserver.daemon=true -start %START% -method %START_METHOD% -stop %STOP% -method %STOP_METHOD% -out %OUT_LOG% -err %ERR_LOG% -auto

net start %NAME%

:eof