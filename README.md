# Tracks-Deno

Run via:

```
DENO_DIR=./.cache deno run --allow-net=127.0.0.1:3306,0.0.0.0:8000 --allow-read --allow-env mod.ts
```

Autocannon results (just one example):

```
(base) ➜  tracks-deno git:(main) ✗ make performance 
autocannon http://localhost:8000/tracks/test_key_path
Running 10s test @ http://localhost:8000/tracks/test_key_path
10 connections

┌─────────┬──────┬───────┬───────┬───────┬──────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max   │
├─────────┼──────┼───────┼───────┼───────┼──────────┼─────────┼───────┤
│ Latency │ 7 ms │ 10 ms │ 15 ms │ 17 ms │ 10.39 ms │ 2.25 ms │ 25 ms │
└─────────┴──────┴───────┴───────┴───────┴──────────┴─────────┴───────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 789    │ 789    │ 892    │ 1033   │ 917.8  │ 78.16   │ 789    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 353 kB │ 353 kB │ 399 kB │ 461 kB │ 410 kB │ 34.8 kB │ 353 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

9k requests in 10.02s, 4.1 MB read
```

Curiously these results are toppling my similar `actix-web` API - I must be doing something wrong somewhere 🤔.