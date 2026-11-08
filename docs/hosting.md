# Hosting

## Upload

The deployable bundle is the entire `src/` tree, including `brightness.js`, the Earth scripts, both local JPEGs and `assets/earth/ATTRIBUTION.md`. Uploading only the original three clock files would omit the backdrop and brightness controls. Keep imagery credits alongside the deployed assets. The HTML references a shared CSS/JS revision (`?v=brightness-1`); bump that revision whenever those shipped resources change. When deploying, serve the HTML with revalidation (for example, `Cache-Control: no-cache`) so clients discover the current resource URLs. See the [cached-resource correction](earth-integration.md#cached-resource-upgrade-correction--2026-11-04) and [standalone brightness controls](brightness.md).

The `earth-view` implementation is a branch candidate. Review it and complete the iPad acceptance checks in [Earth integration](earth-integration.md) before the separately authorized mainline merge/deployment.

Or use the AWS CLI:

```bash
aws s3 sync src/ s3://nightstand-clock.witspirit.be/ --delete --profile witspirit
```

## Serving

It is served from there using S3 static website hosting.

The endpoint is:
[http://nightstand-clock.witspirit.be.s3-website-eu-west-1.amazonaws.com/](http://nightstand-clock.witspirit.be.s3-website-eu-west-1.amazonaws.com/) 


DNS Alias is available, so the hosted website is now also available at:
[http://nightstand-clock.witspirit.be/](http://nightstand-clock.witspirit.be/) 

