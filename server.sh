#!/bin/bash

while [[ $# -gt 0 ]]; do
case "$1" in
--build|-b)
npm install
npx tsc
echo "Project ready"
;;
--start|-s)
http-server -c-1 -p 8000
;;
--help|-h)
echo "Usage: ./server.sh [options]"
echo "--build, -b    Install deps and build TypeScript"
echo "--start, -s    Start http-server"
echo "--help, -h     Show this help"
;;
*)
echo "Unknown option: $1"
;;
esac

shift 1
done