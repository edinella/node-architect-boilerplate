test:;    @echo "Testing...";     @./node_modules/.bin/mocha;
run:;     @echo "Running...";     npm start;
install:; @echo "Installing...";  npm install;
stop:;    @echo "For stop all processes, run kill -9 for these pids"; ps aux | grep server | grep -v grep | cut -c10-15;
.PHONY: test run install stop