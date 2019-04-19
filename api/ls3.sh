#!/bin/bash

export AWS_ACCESS_KEY_ID=foo
export AWS_SECRET_ACCESS_KEY=foo

aws --endpoint-url=http://localhost:4572 --region=us-east-1 s3 $@