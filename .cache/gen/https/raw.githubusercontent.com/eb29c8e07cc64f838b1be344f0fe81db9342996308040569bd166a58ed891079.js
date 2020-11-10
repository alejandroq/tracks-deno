import { ConnnectionError, ProtocolError, ReadError, ResponseTimeoutError, } from "./constant/errors.ts";
import { log } from "./logger.ts";
import { buildAuth } from "./packets/builders/auth.ts";
import { buildQuery } from "./packets/builders/query.ts";
import { ReceivePacket, SendPacket } from "./packets/packet.ts";
import { parseError } from "./packets/parsers/err.ts";
import { parseHandshake } from "./packets/parsers/handshake.ts";
import { parseField, parseRow } from "./packets/parsers/result.ts";
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["CONNECTING"] = 0] = "CONNECTING";
    ConnectionState[ConnectionState["CONNECTED"] = 1] = "CONNECTED";
    ConnectionState[ConnectionState["CLOSING"] = 2] = "CLOSING";
    ConnectionState[ConnectionState["CLOSED"] = 3] = "CLOSED";
})(ConnectionState || (ConnectionState = {}));
export class Connection {
    constructor(config) {
        this.config = config;
        this.state = ConnectionState.CONNECTING;
        this.capabilities = 0;
        this.serverVersion = "";
        this.conn = undefined;
        this._timedOut = false;
        this._timeoutCallback = () => {
            log.info("connection read timed out");
            this._timedOut = true;
            this.close();
        };
    }
    get remoteAddr() {
        return this.config.socketPath
            ? `unix:${this.config.socketPath}`
            : `${this.config.hostname}:${this.config.port}`;
    }
    async _connect() {
        const { hostname, port = 3306, socketPath } = this.config;
        log.info(`connecting ${this.remoteAddr}`);
        this.conn = !socketPath
            ? await Deno.connect({
                transport: "tcp",
                hostname,
                port,
            })
            : await Deno.connect({
                transport: "unix",
                path: socketPath,
            });
        try {
            let receive = await this.nextPacket();
            const handshakePacket = parseHandshake(receive.body);
            const data = buildAuth(handshakePacket, {
                username: this.config.username ?? "",
                password: this.config.password,
                db: this.config.db,
            });
            await new SendPacket(data, 0x1).send(this.conn);
            this.state = ConnectionState.CONNECTING;
            this.serverVersion = handshakePacket.serverVersion;
            this.capabilities = handshakePacket.serverCapabilities;
            receive = await this.nextPacket();
            const header = receive.body.readUint8();
            if (header === 0xff) {
                const error = parseError(receive.body, this);
                log.error(`connect error(${error.code}): ${error.message}`);
                this.close();
                throw new Error(error.message);
            }
            else {
                log.info(`connected to ${this.remoteAddr}`);
                this.state = ConnectionState.CONNECTED;
            }
            if (this.config.charset) {
                await this.execute(`SET NAMES ${this.config.charset}`);
            }
        }
        catch (error) {
            this.close();
            throw error;
        }
    }
    async connect() {
        await this._connect();
    }
    async nextPacket() {
        if (!this.conn) {
            throw new ConnnectionError("Not connected");
        }
        const timeoutTimer = this.config.timeout
            ? setTimeout(this._timeoutCallback, this.config.timeout)
            : null;
        let packet;
        try {
            packet = await new ReceivePacket().parse(this.conn);
        }
        catch (error) {
            if (this._timedOut) {
                throw new ResponseTimeoutError("Connection read timed out");
            }
            timeoutTimer && clearTimeout(timeoutTimer);
            this.close();
            throw error;
        }
        timeoutTimer && clearTimeout(timeoutTimer);
        if (!packet) {
            this.close();
            throw new ReadError("Connection closed unexpectedly");
        }
        if (packet.type === "ERR") {
            packet.body.skip(1);
            const error = parseError(packet.body, this);
            throw new Error(error.message);
        }
        return packet;
    }
    lessThan57() {
        const version = this.serverVersion;
        if (!version.includes("MariaDB"))
            return version < "5.7.0";
        const segments = version.split("-");
        if (segments[1] === "MariaDB")
            return segments[0] < "5.7.0";
        return false;
    }
    close() {
        if (this.state != ConnectionState.CLOSED) {
            log.info("close connection");
            this.conn?.close();
            this.state = ConnectionState.CLOSED;
        }
    }
    async query(sql, params) {
        const result = await this.execute(sql, params);
        if (result && result.rows) {
            return result.rows;
        }
        else {
            return result;
        }
    }
    async execute(sql, params) {
        if (this.state != ConnectionState.CONNECTED) {
            if (this.state == ConnectionState.CLOSED) {
                throw new ConnnectionError("Connection is closed");
            }
            else {
                throw new ConnnectionError("Must be connected first");
            }
        }
        const data = buildQuery(sql, params);
        try {
            await new SendPacket(data, 0).send(this.conn);
            let receive = await this.nextPacket();
            if (receive.type === "OK") {
                receive.body.skip(1);
                return {
                    affectedRows: receive.body.readEncodedLen(),
                    lastInsertId: receive.body.readEncodedLen(),
                };
            }
            else if (receive.type !== "RESULT") {
                throw new ProtocolError();
            }
            let fieldCount = receive.body.readEncodedLen();
            const fields = [];
            while (fieldCount--) {
                const packet = await this.nextPacket();
                if (packet) {
                    const field = parseField(packet.body);
                    fields.push(field);
                }
            }
            const rows = [];
            if (this.lessThan57()) {
                receive = await this.nextPacket();
                if (receive.type !== "EOF") {
                    throw new ProtocolError();
                }
            }
            while (true) {
                receive = await this.nextPacket();
                if (receive.type === "EOF") {
                    break;
                }
                else {
                    const row = parseRow(receive.body, fields);
                    rows.push(row);
                }
            }
            return { rows, fields };
        }
        catch (error) {
            this.close();
            throw error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixhQUFhLEVBQ2IsU0FBUyxFQUNULG9CQUFvQixHQUNyQixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDaEUsT0FBTyxFQUFhLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUs5RSxNQUFNLENBQU4sSUFBWSxlQUtYO0FBTEQsV0FBWSxlQUFlO0lBQ3pCLGlFQUFVLENBQUE7SUFDViwrREFBUyxDQUFBO0lBQ1QsMkRBQU8sQ0FBQTtJQUNQLHlEQUFNLENBQUE7QUFDUixDQUFDLEVBTFcsZUFBZSxLQUFmLGVBQWUsUUFLMUI7QUFhRCxNQUFNLE9BQU8sVUFBVTtJQWNyQixZQUFxQixNQUFvQjtRQUFwQixXQUFNLEdBQU4sTUFBTSxDQUFjO1FBYnpDLFVBQUssR0FBb0IsZUFBZSxDQUFDLFVBQVUsQ0FBQztRQUNwRCxpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUVuQixTQUFJLEdBQWUsU0FBUyxDQUFDO1FBQzdCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUF3R2xCLHFCQUFnQixHQUFHLEdBQUcsRUFBRTtZQUM5QixHQUFHLENBQUMsSUFBSSxD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