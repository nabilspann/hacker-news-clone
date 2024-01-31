import awsLambdaFastify from "@fastify/aws-lambda";
import { Config, Context, Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { initServer } from "server";

const proxy = awsLambdaFastify(initServer());
const handler = proxy;

export { handler }
