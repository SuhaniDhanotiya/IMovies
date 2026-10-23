#!/bin/bash
cd "$(dirname "$0")"
if [ ! -f "server/.env" ]; then
  cp server/.env.example server/.env
  echo "Created server/.env from server/.env.example"
else
  echo "server/.env already exists; leaving it unchanged"
fi
echo
echo "Next: open Terminal in this folder and follow README.md."
read -r -p "Press Return to close this window..." _
