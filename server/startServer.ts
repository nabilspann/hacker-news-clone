import { initServer } from ".";

initServer().listen({ port: 8080, host: '0.0.0.0' }, function (err: any) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("server listening on 8080");
});
