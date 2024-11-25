#!/usr/bin/env bash

set -x
set -e

OUT_DIR="./keys/"
mkdir -p $OUT_DIR

KEY_NAME="$OUT_DIR""self-signed-localhost"
CSR_NAME="$OUT_DIR""self-signed-localhost"
CRT_NAME="$OUT_DIR""self-signed-localhost"

DAYS_VALID=365
SUBJECT="/C=US/ST=New York/L=New York/O=localco/OU=Development/CN=localhost/emailAddress=root@localhost"


# Generate a Private Key:
openssl genpkey -algorithm RSA -out "$KEY_NAME".key

# Generate a Certificate Signing Request (CSR):
openssl req -new -key "$KEY_NAME".key -out "$CSR_NAME".csr -subj "$SUBJECT"

# Generate the Self-Signed Certificate
openssl x509 -req -days $DAYS_VALID -in "$CSR_NAME".csr -signkey "$KEY_NAME".key -out "$CRT_NAME".crt

# Remove Artifacts
rm "$CSR_NAME".csr
