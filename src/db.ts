import { Client } from "./deps.ts";

export const db = await new Client().connect({
  hostname: Deno.env.get("DB_HOST") as string,
  username: Deno.env.get("DB_USER") as string,
  db: Deno.env.get("DB_NAME") as string,
  poolSize: 20, 
  password: Deno.env.get("DB_PASS") as string,
});