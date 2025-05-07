import {
  Application,
  Context,
  Next,
  Router,
  RouterContext,
  send,
} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { Eta } from "https://deno.land/x/eta@v3.0.3/src/index.ts";

async function logger(ctx: Context, next: Next) {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
}

async function staticServer(ctx: Context, next: Next) {
  if (ctx.request.url.pathname.includes("static")) {
    await send(ctx, ctx.request.url.pathname, { root: "." });
  } else {
    await next();
  }
}

function indexRoute(ctx: RouterContext<"/">) {
  ctx.response.body = eta.render("index", { title: "Super megastore" });
}

const app = new Application();
const router = new Router();
const eta = new Eta({ views: ".", cache: true });

router.get("/", indexRoute);

app.use(logger);
app.use(staticServer);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 3000 });
