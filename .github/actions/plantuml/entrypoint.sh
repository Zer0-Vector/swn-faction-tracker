#!/usr/bin/env sh

time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT

echo "args: $@"

ls -l /github/workspace

java -jar /opt/plantuml.jar "$@"
