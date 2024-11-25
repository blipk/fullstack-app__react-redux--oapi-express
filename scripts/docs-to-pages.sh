#!/usr/bin/env bash

set -x
set -e

echo "Copying package docs to root project docs/ directory"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
export PROJECT_DIR="$SCRIPT_DIR/../"

rm -rf "$PROJECT_DIR"/docs

mkdir -p "$PROJECT_DIR"/docs/server
mkdir -p "$PROJECT_DIR"/docs/client

cp -r "$PROJECT_DIR"/server/docs/* "$PROJECT_DIR"/docs/server/
cp -r "$PROJECT_DIR"/client/docs/* "$PROJECT_DIR"/docs/client/

echo "Docs copied"