.PHONY: run
run:
	DENO_DIR=./.cache deno run --allow-net=127.0.0.1:3306,0.0.0.0:8000 --allow-read --allow-env mod.ts

.PHONY: performance
performance:
	autocannon http://localhost:8000/tracks/test_key_path

.PHONY: cache
cache: 
	DENO_DIR=./.cache deno cache --lock=lock.json --lock-write src/deps.ts