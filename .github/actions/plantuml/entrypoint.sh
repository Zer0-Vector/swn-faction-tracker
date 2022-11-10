#!/usr/bin/env sh

time=$(date)
echo "time=$time" >> $GITHUB_OUTPUT

echo "args: $@"

ls -l "/github/workspace/$1"

java -jar /opt/plantuml.jar -v -o "/github/workspace/$2" "/github/workspace/$1"

ls -l "/github/workspace/$2"
