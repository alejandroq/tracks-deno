import { byteFormat } from "../../deps.ts";
import { BufferReader, BufferWriter } from "../buffer.ts";
import { WriteError } from "../constant/errors.ts";
import { debug, log } from "../logger.ts";
export class SendPacket {
    constructor(body, no) {
        this.body = body;
        this.header = { size: body.length, no };
    }
    async send(conn) {
        const body = this.body;
        const data = new BufferWriter(new Uint8Array(4 + body.length));
        data.writeUints(3, this.header.size);
        data.write(this.header.no);
        data.writeBuffer(body);
        log.debug(`send: ${data.length}B \n${byteFormat(data.buffer)}\n`);
        try {
            let wrote = 0;
            do {
                wrote += await conn.write(data.buffer.subarray(wrote));
            } while (wrote < data.length);
        }
        catch (error) {
            throw new WriteError(error.message);
        }
    }
}
export class ReceivePacket {
    async parse(reader) {
        const header = new BufferReader(new Uint8Array(4));
        let readCount = 0;
        let nread = await this.read(reader, header.buffer);
        if (nread === null)
            return null;
        readCount = nread;
        const bodySize = header.readUints(3);
        this.header = {
            size: bodySize,
            no: header.readUint8(),
        };
        this.body = new BufferReader(new Uint8Array(bodySize));
        nread = await this.read(reader, this.body.buffer);
        if (nread === null)
            return null;
        readCount += nread;
        switch (this.body.buffer[0]) {
            case 0x00:
                this.type = "OK";
                break;
            case 0xff:
                this.type = "ERR";
                break;
            case 0xfe:
                this.type = "EOF";
                break;
            default:
                this.type = "RESULT";
                break;
        }
        debug(() => {
            const data = new Uint8Array(readCount);
            data.set(header.buffer);
            data.set(this.body.buffer, 4);
            log.debug(`receive: ${readCount}B, size = ${this.header.size}, no = ${this.header.no} \n${byteFormat(data)}\n`);
        });
        return this;
    }
    async read(reader, buffer) {
        const size = buffer.length;
        let haveRead = 0;
        while (haveRead < size) {
            const nread = await reader.read(buffer.subarray(haveRead));
            if (nread === null)
                return null;
            haveRead += nread;
        }
        return haveRead;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBUzFDLE1BQU0sT0FBTyxVQUFVO0lBR3JCLFlBQXFCLElBQWdCLEVBQUUsRUFBVTtRQUE1QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFlO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFrQixDQUFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLElBQUk7WUFDRixJQUFJLEtBQUss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