#!/bin/sh

export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

create_sns_topic() {
  echo "Creating SNS Topic - '$1'"
  /home/aws/aws/env/bin/aws --endpoint-url=http://localstack:4566 sns create-topic --name "$1"
}

create_sqs_queue() {
  echo "Creating SQS queue '$1'"
  /home/aws/aws/env/bin/aws --endpoint-url=http://localstack:4566 sqs create-queue --queue-name "$1"
}

create_s3_bucket() {
    echo "Create S3 bucket '$1'"
    /home/aws/aws/env/bin/aws --endpoint-url=http://localstack:4566 s3api create-bucket --bucket "$1"
}

subscribe_queue_to_topic() {
  echo "Subscribing queue '$1' to topic '$2' with routing-key prefix '$3'"
  subHandlerSubArn=$(/home/aws/aws/env/bin/aws --endpoint-url=http://localstack:4566 sns subscribe --topic-arn "arn:aws:sns:us-east-1:000000000000:$2" --protocol sqs --notification-endpoint "arn:aws:sqs:elasticmq:000000000000:$1")
  echo "$subHandlerSubArn"
  if [ -n "${3}" ]; then
    subHandlerSubArn=$(echo "$subHandlerSubArn" | awk '{ print $2 }' | tr -d '\n' | sed 's/\"//g')
    echo "filter policy '$3' set against sub-arn '${subHandlerSubArn}'"
    /home/aws/aws/env/bin/aws --endpoint-url=http://localstack:4566 sns set-subscription-attributes --subscription-arn "$subHandlerSubArn" --attribute-name FilterPolicy --attribute-value "{\"x-dwp-routing-key\":{\"prefix\": \"$3\"}}"
  fi
}

create_kms_key() {
  keyId=$(/home/aws/aws/env/bin/aws kms create-key --endpoint-url http://localstack:4566 --output=text | sed -E 's/.*('"[0-9a-z]{8}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{12}"').*/\1/')
  echo "created KMS key '$keyId' for alias '$1'"
  /home/aws/aws/env/bin/aws kms create-alias --endpoint-url http://localstack:4566 --alias-name "$1" --target-key-id "$keyId"
}

# S3 buckets
create_s3_bucket "broker-bucket"

# SNS Topics
create_sns_topic "ds1500-topic"

# SQS Queue
create_sqs_queue "ds1500-queue"

# create subscriptions
subscribe_queue_to_topic "ds1500-queue" "ds1500-topic" "sns.ds1500.new"

# KMS
create_kms_key "alias/test_event_request_id"