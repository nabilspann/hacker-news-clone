import awsLambdaFastify from "@fastify/aws-lambda";
import { Config, Context, Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { initServer } from "server";

const proxy = awsLambdaFastify(initServer());
// export default async (req: Request, context: Context) => {
// //   const proxy = awsLambdaFastify(initServer());
//   return new Response(JSON.stringify("Test deez"));
//     // return proxy
// }
// exports.handler = proxy;
const handler = proxy;

// const handler: Handler = async (
//   event: HandlerEvent,
//   context: HandlerContext
// ) => {
//   // your server-side functionality

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: "Hello World" }),
//   };
// };

export { handler }
// export const handler = async (event:any, context:any) => proxy(event, context);

// export const config: Config = {
//   path: "/test",
// };
