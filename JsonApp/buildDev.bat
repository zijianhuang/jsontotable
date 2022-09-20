::Build for testing with dotnet hosting. File buildTime.js is included in angular.json for be built.
cd %~dp0NGSource

for /f "skip=1" %%x in ('wmic os get localdatetime') do if not defined MyDate set MyDate=%%x

set today=%MyDate:~0,4%%MyDate:~4,2%%MyDate:~6,2%%time:~0,2%%time:~3,2%
set today=%today: =0%

@echo const BUILD_TIME={buildTime: %today%}; > src\conf\buildTime.js

call ng build --configuration=development
pause
