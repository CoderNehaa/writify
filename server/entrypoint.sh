#!/bin/sh
set -e

if [ -n "$SSM_PARAMETER_NAME" ]; then
  aws ssm get-parameter \
    --name "$SSM_PARAMETER_NAME" \
    --with-decryption \
    --region "${AWS_REGION:-ap-south-1}" \
    --query Parameter.Value --output text > /tmp/app.env

  set -a
  . /tmp/app.env
  set +a
  rm -f /tmp/app.env
fi

exec "$@"
