@ECHO off
set NAME="ERS Reporting Server"
net stop %NAME%

JavaService.exe -uninstall %NAME%