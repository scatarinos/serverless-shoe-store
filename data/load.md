# load initial data
cd data
aws dynamodb batch-write-item --request-items file://shoes.json