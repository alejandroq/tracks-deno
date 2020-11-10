import { DeferredStack } from "./deferred.ts";
import { Connection } from "./connection.ts";
import { log } from "./logger.ts";
export class PoolConnection extends Connection {
    constructor() {
        super(...arguments);
        this._pool = undefined;
        this._idleTimer = undefined;
        this._idle = false;
    }
    enterIdle() {
        this._idle = true;
        if (this.config.idleTimeout) {
            this._idleTimer = setTimeout(() => {
                log.info("connection idle timeout");
                this._pool.remove(this);
                try {
                    this.close();
                }
                catch (error) {
                    log.warning(`error closing idle connection`, error);
                }
            }, this.config.idleTimeout);
        }
    }
    exitIdle() {
        this._idle = false;
        if (this._idleTimer !== undefined) {
            clearTimeout(this._idleTimer);
        }
    }
    removeFromPool() {
        this._pool.reduceSize();
        this._pool = undefined;
    }
    returnToPool() {
        this._pool?.push(this);
    }
}
export class ConnectionPool {
    constructor(maxSize, creator) {
        this._connections = [];
        this._closed = false;
        this._deferred = new DeferredStack(maxSize, this._connections, async () => {
            const conn = await creator();
            conn._pool = this;
            return conn;
        });
    }
    get info() {
        return {
            size: this._deferred.size,
            maxSize: this._deferred.maxSize,
            available: this._deferred.available,
        };
    }
    push(conn) {
        if (this._closed) {
            conn.close();
            this.reduceSize();
        }
        if (this._deferred.push(conn)) {
            conn.enterIdle();
        }
    }
    async pop() {
        if (this._closed) {
            throw new Error("Connection pool is closed");
        }
        let conn = this._deferred.tryPopAvailable();
        if (conn) {
            conn.exitIdle();
        }
        else {
            conn = await this._deferred.pop();
        }
        return conn;
    }
    remove(conn) {
        return this._deferred.remove(conn);
    }
    close() {
        this._closed = true;
        let conn;
        while (conn = this._deferred.tryPopAvailable()) {
            conn.exitIdle();
            conn.close();
            this.reduceSize();
        }
    }
    reduceSize() {
        this._deferred.reduceSize();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUdsQyxNQUFNLE9BQU8sY0FBZSxTQUFRLFVBQVU7SUFBOUM7O1FBQ0UsVUFBSyxHQUFvQixTQUFTLENBQUM7UUFFM0IsZUFBVSxHQUFZLFNBQVMsQ0FBQztRQUNoQyxVQUFLLEdBQUcsS0FBSyxDQUFDO0lBeUN4QixDQUFDO0lBcENDLFNBQVM7UUFDUCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDaEMsR0FBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsS0FBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekIsSUFBSTtvQkFDRixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2Q7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsR0FBRyxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDckQ7WUFDSCxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFLRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUNqQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQy9C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