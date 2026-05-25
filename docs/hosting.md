# Hosting

## Upload

Manually uploaded the 3 files to an AWS S3 bucket.

Or use the AWS CLI:

```bash
aws s3 sync src/ s3://nightstand-clock.witspirit.be/ --delete --profile witspirit
```

## Serving

It is served from there using S3 static website hosting.

The endpoint is:
[http://nightstand-clock-witspirit.s3-website-eu-west-1.amazonaws.com/](http://nightstand-clock-witspirit.s3-website-eu-west-1.amazonaws.com/) 


DNS Alias is available, so the hosted website is now also available at:
[http://nightstand-clock.witspirit.com/](http://nightstand-clock.witspirit.com/) 

