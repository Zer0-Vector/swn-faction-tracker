#!/usr/bin/env sh

echo "args: $@"

java -jar /opt/plantuml.jar -v "-t$3" -o "/github/workspace/$2" "/github/workspace/$1"
