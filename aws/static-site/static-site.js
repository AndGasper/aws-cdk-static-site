#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudfront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/cdk");
/**
 * Static site infrastructure, which uses an S3 bucket for the content.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 *
 * The ACM certificate is expected to be created and validated outside of the CDK,
 * with the certificate ARN stored in an SSM Parameter.
 */
class StaticSite extends cdk.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const siteDomain = props.siteSubDomain + '.' + props.domainName;
        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
            publicReadAccess: true
        });
        new cdk.Output(this, 'Bucket', { value: siteBucket.bucketName });
        // Pre-existing ACM certificate, with the ARN stored in an SSM Parameter
        const certificateArn = new cdk.SSMParameterProvider(this, {
            parameterName: 'CertificateArn-' + siteDomain
        }).parameterValue();
        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificateArn,
                names: [siteDomain],
                sslMethod: cloudfront.SSLMethod.SNI,
                securityPolicy: cloudfront.SecurityPolicyProtocol.TLSv1_1_2016
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                }
            ]
        });
        new cdk.Output(this, 'DistributionId', { value: distribution.distributionId });
        // Route53 alias record for the CloudFront distribution
        const zone = new route53.HostedZoneProvider(this, { domainName: props.domainName }).findAndImport(this, 'Zone');
        new route53.AliasRecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: distribution,
            zone
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzREFBdUQ7QUFDdkQsZ0RBQWlEO0FBQ2pELHNDQUF1QztBQUN2QyxvQ0FBcUM7QUFPckM7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLFVBQVcsU0FBUSxHQUFHLENBQUMsU0FBUztJQUN6QyxZQUFZLE1BQXFCLEVBQUUsSUFBWSxFQUFFLEtBQXNCO1FBQ25FLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVoRSxpQkFBaUI7UUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDakQsVUFBVSxFQUFFLFVBQVU7WUFDdEIsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFakUsd0VBQXdFO1FBQ3hFLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRTtZQUN0RCxhQUFhLEVBQUUsaUJBQWlCLEdBQUcsVUFBVTtTQUNoRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFcEIsOENBQThDO1FBQzlDLE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUNwRixrQkFBa0IsRUFBRTtnQkFDaEIsVUFBVSxFQUFFLGNBQWM7Z0JBQzFCLEtBQUssRUFBRSxDQUFFLFVBQVUsQ0FBRTtnQkFDckIsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRztnQkFDbkMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZO2FBQ2pFO1lBQ0QsYUFBYSxFQUFFO2dCQUNYO29CQUNJLGNBQWMsRUFBRTt3QkFDWixjQUFjLEVBQUUsVUFBVTtxQkFDN0I7b0JBQ0QsU0FBUyxFQUFHLENBQUUsRUFBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUMsQ0FBQztpQkFDM0M7YUFDSjtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFFL0UsdURBQXVEO1FBQ3ZELE1BQU0sSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hILElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDN0MsVUFBVSxFQUFFLFVBQVU7WUFDdEIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsSUFBSTtTQUNQLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQS9DRCxnQ0ErQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgY2xvdWRmcm9udCA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250Jyk7XG5pbXBvcnQgcm91dGU1MyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jZGsnKTtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aWNTaXRlUHJvcHMge1xuICAgIGRvbWFpbk5hbWU6IHN0cmluZztcbiAgICBzaXRlU3ViRG9tYWluOiBzdHJpbmc7XG59XG5cbi8qKlxuICogU3RhdGljIHNpdGUgaW5mcmFzdHJ1Y3R1cmUsIHdoaWNoIHVzZXMgYW4gUzMgYnVja2V0IGZvciB0aGUgY29udGVudC5cbiAqXG4gKiBUaGUgc2l0ZSByZWRpcmVjdHMgZnJvbSBIVFRQIHRvIEhUVFBTLCB1c2luZyBhIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uLFxuICogUm91dGU1MyBhbGlhcyByZWNvcmQsIGFuZCBBQ00gY2VydGlmaWNhdGUuXG4gKlxuICogVGhlIEFDTSBjZXJ0aWZpY2F0ZSBpcyBleHBlY3RlZCB0byBiZSBjcmVhdGVkIGFuZCB2YWxpZGF0ZWQgb3V0c2lkZSBvZiB0aGUgQ0RLLFxuICogd2l0aCB0aGUgY2VydGlmaWNhdGUgQVJOIHN0b3JlZCBpbiBhbiBTU00gUGFyYW1ldGVyLlxuICovXG5leHBvcnQgY2xhc3MgU3RhdGljU2l0ZSBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkNvbnN0cnVjdCwgbmFtZTogc3RyaW5nLCBwcm9wczogU3RhdGljU2l0ZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgbmFtZSk7XG5cbiAgICAgICAgY29uc3Qgc2l0ZURvbWFpbiA9IHByb3BzLnNpdGVTdWJEb21haW4gKyAnLicgKyBwcm9wcy5kb21haW5OYW1lO1xuXG4gICAgICAgIC8vIENvbnRlbnQgYnVja2V0XG4gICAgICAgIGNvbnN0IHNpdGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdTaXRlQnVja2V0Jywge1xuICAgICAgICAgICAgYnVja2V0TmFtZTogc2l0ZURvbWFpbixcbiAgICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogJ2Vycm9yLmh0bWwnLFxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgbmV3IGNkay5PdXRwdXQodGhpcywgJ0J1Y2tldCcsIHsgdmFsdWU6IHNpdGVCdWNrZXQuYnVja2V0TmFtZSB9KTtcblxuICAgICAgICAvLyBQcmUtZXhpc3RpbmcgQUNNIGNlcnRpZmljYXRlLCB3aXRoIHRoZSBBUk4gc3RvcmVkIGluIGFuIFNTTSBQYXJhbWV0ZXJcbiAgICAgICAgY29uc3QgY2VydGlmaWNhdGVBcm4gPSBuZXcgY2RrLlNTTVBhcmFtZXRlclByb3ZpZGVyKHRoaXMsIHtcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6ICdDZXJ0aWZpY2F0ZUFybi0nICsgc2l0ZURvbWFpblxuICAgICAgICB9KS5wYXJhbWV0ZXJWYWx1ZSgpO1xuXG4gICAgICAgIC8vIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIHRoYXQgcHJvdmlkZXMgSFRUUFNcbiAgICAgICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnU2l0ZURpc3RyaWJ1dGlvbicsIHtcbiAgICAgICAgICAgIGFsaWFzQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIGFjbUNlcnRSZWY6IGNlcnRpZmljYXRlQXJuLFxuICAgICAgICAgICAgICAgIG5hbWVzOiBbIHNpdGVEb21haW4gXSxcbiAgICAgICAgICAgICAgICBzc2xNZXRob2Q6IGNsb3VkZnJvbnQuU1NMTWV0aG9kLlNOSSxcbiAgICAgICAgICAgICAgICBzZWN1cml0eVBvbGljeTogY2xvdWRmcm9udC5TZWN1cml0eVBvbGljeVByb3RvY29sLlRMU3YxXzFfMjAxNlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc2l0ZUJ1Y2tldFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcnMgOiBbIHtpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZX1dLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICAgIG5ldyBjZGsuT3V0cHV0KHRoaXMsICdEaXN0cmlidXRpb25JZCcsIHsgdmFsdWU6IGRpc3RyaWJ1dGlvbi5kaXN0cmlidXRpb25JZCB9KTtcblxuICAgICAgICAvLyBSb3V0ZTUzIGFsaWFzIHJlY29yZCBmb3IgdGhlIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uXG4gICAgICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lUHJvdmlkZXIodGhpcywgeyBkb21haW5OYW1lOiBwcm9wcy5kb21haW5OYW1lIH0pLmZpbmRBbmRJbXBvcnQodGhpcywgJ1pvbmUnKTtcbiAgICAgICAgbmV3IHJvdXRlNTMuQWxpYXNSZWNvcmQodGhpcywgJ1NpdGVBbGlhc1JlY29yZCcsIHtcbiAgICAgICAgICAgIHJlY29yZE5hbWU6IHNpdGVEb21haW4sXG4gICAgICAgICAgICB0YXJnZXQ6IGRpc3RyaWJ1dGlvbixcbiAgICAgICAgICAgIHpvbmVcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==