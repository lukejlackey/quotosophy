<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://github.com/lukejlackey/quotosophy-doc/blob/master/src/img/qLogo.png?raw=true" alt="Project logo"></a>
</p>

<h3 align="center">QUOTOSOPHY API</h3>

---

<p align="center"> The QUOTOSOPHY API provides lightning-fast access to a plethora of philosophical quotes, texts, and authors from throughout history. The following documentation details how the API was built. 
    <br>
Please visit <a href="http://docs.quotosophy.com">docs.quotosophy.com</a> for information on how to get started using the API.
    <br> 
</p>

---

## 📝 Table of Contents

- [About](#about)
- [Stack](#built_using)

## 🧐 About <a name = "about"></a>

The goal of this API is to supply a curated selection of philosophical content. In its current state, the following entries are available: 40 quotes, 40 source texts, 40 authors. The quantity and complexity of these entries will be increased in future iterations. Possible use cases for this API include motivational landing pages and educational applications.

## ⛏️ Stack <a name = "built_using"></a>

- Configured serverless edge deployment with [Serverless](https://www.serverless.com/) framework for greater scalability and quicker response times
- Built a RESTful API with [Express.js](https://expressjs.com/) for fast, fluid communication between users and database, decreasing [AWS Lambda](https://aws.amazon.com/lambda/) billed durations
- Constructed a multi-model, low-latency [Redis Enterprise Cloud](https://redis.com/redis-enterprise-cloud/overview/?utm_source=google&utm_medium=cpc&utm_term=&utm_campaign=why_re-land_caching-perfmax-us-19325065386&gclid=Cj0KCQiAw8OeBhCeARIsAGxWtUxlB-S9DmE-sanuCUAKBZSB9D8P46NlLaagl0fy2BgahLTrIbHbH_kaAqlOEALw_wcB) database, using [Redis-OM](https://github.com/redis/redis-om-node) to handle API key creation/management and [RedisGraph](https://redis.io/docs/stack/graph/) for interconnected philosophy data
- Incorporated [Stripe API](https://stripe.com/) for streamlined billing and customer subscription management, leveraging [AWS SQS](https://aws.amazon.com/sqs/) to offload usage metering for improved response times
- Utilized [Courier](https://www.courier.com/) and [AWS SES](https://aws.amazon.com/ses/) to send customers stylized emails for new API key requests, subscription creations/cancellations, and support inquiries
