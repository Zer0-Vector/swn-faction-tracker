#!/usr/bin/env sh

echo "Hello $1"
time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT

ls -l /github/workspace

java -jar /opt/plantuml.jar -version
