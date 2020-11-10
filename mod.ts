// DENO_DIR=./.cache deno run --allow-net=127.0.0.1:3306,0.0.0.0:8000 --allow-read --allow-env mod.ts
import { Application, Router, Snelm } from "./src/deps.ts";
import { nodeID, readValue, register, serviceName, logger } from "./src/mod.ts";

const router = new Router();

const registered = await register(serviceName!, nodeID);
switch (registered.type) {
  case "error": {
    throw registered.error;
  }
}

router
  .get("/health", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = {
      message: "healthy",
    };
  })
  .get("/tracks/:keyPath", async (ctx) => {
    const keyPath = ctx.params.keyPath as string;

    try {
      const result = await readValue(keyPath, serviceName, nodeID);
      switch (result.type) {
        case "value": {
          ctx.response.status = 200;
          ctx.response.body = {
            key_path: keyPath,
            value: result.value,
          };
          return;
        }
        case "error": {
          ctx.response.status = 404;
          ctx.response.body = {
            message: result.error.message,
          };
          return;
        }
      }
    } catch (err) {
      ctx.response.status = 500;
      ctx.response.body = {
        message: err,
      };
    }
  });

const app = new Application();
const snelm = new Snelm("oak");
app
  .use(async (ctx, next) => {
    ctx.response = snelm.snelm(ctx.request, ctx.response);
    await next();
  })
  .use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    logger.debug(
      `${ctx.request.method} ${ctx.response.status} ${ctx.request.url} - ${rt}`,
    );
  })
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .use((ctx) => {
    ctx.response.status = 404;
    ctx.response.body = {
      message: "not found",
    };
  });

console.log(`🌳 oak server running at http://localhost:8000/ 🌳`);

await app.listen({ port: 8000 });
