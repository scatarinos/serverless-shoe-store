# setup
export AWS_PROFILE=<your-aws-profile>
cdk init app --language typescript
cdk bootstrap
cdk synth
cdk deploy
cdk doctor

