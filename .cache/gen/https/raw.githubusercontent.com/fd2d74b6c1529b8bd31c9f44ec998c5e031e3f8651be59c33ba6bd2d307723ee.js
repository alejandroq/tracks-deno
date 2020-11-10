import { BufferWriter } from "../../buffer.ts";
import ServerCapabilities from "../../constant/capabilities.ts";
export function parseHandshake(reader) {
    const protocolVersion = reader.readUint8();
    const serverVersion = reader.readNullTerminatedString();
    const threadId = reader.readUint32();
    const seedWriter = new BufferWriter(new Uint8Array(20));
    seedWriter.writeBuffer(reader.readBuffer(8));
    reader.skip(1);
    let serverCapabilities = reader.readUint16();
    let characterSet = 0, statusFlags = 0, authPluginDataLength = 0, authPluginName = "";
    if (!reader.finished) {
        characterSet = reader.readUint8();
        statusFlags = reader.readUint16();
        serverCapabilities |= reader.readUint16() << 16;
        if ((serverCapabilities & ServerCapabilities.CLIENT_PLUGIN_AUTH) != 0) {
            authPluginDataLength = reader.readUint8();
        }
        else {
            reader.skip(1);
        }
        reader.skip(10);
        if ((serverCapabilities & ServerCapabilities.CLIENT_SECURE_CONNECTION) !=
            0) {
            seedWriter.writeBuffer(reader.readBuffer(Math.max(13, authPluginDataLength - 8)));
        }
        if ((serverCapabilities & ServerCapabilities.CLIENT_PLUGIN_AUTH) != 0) {
            authPluginName = reader.readNullTerminatedString();
        }
    }
    return {
        protocolVersion,
        serverVersion,
        threadId,
        seed: seedWriter.buffer,
        serverCapabilities,
        characterSet,
        statusFlags,
        authPluginName,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZHNoYWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGFuZHNoYWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDN0QsT0FBTyxrQkFBa0IsTUFBTSxnQ0FBZ0MsQ0FBQztBQWVoRSxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQW9CO0lBQ2pELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMzQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUN4RCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDckMsTUFBTSxVQUFVLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4RCxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFN0MsSUFBSSxZQUFZLEdBQVcsQ0FBQyxFQUMxQixXQUFXLEdBQVcsQ0FBQyxFQUN2QixvQkFBb0IsR0FBVyxDQUFDLEVBQ2hDLGNBQWMsR0FBVyxFQUFFLENBQUM7SUFFOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDcEIsWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLGtCQUFrQixJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFaEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JFLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUMzQzthQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFaEIsSUFDRSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLHdCQUF3QixDQUFDO1lBQ2hFLENBQUMsRUFDSDtZQUNBLFVBQVUsQ0FBQyxXQUFXLENBQ3BCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDMUQsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JFLGNBQWMsR0FBRyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNwRDtLQUNGO0lBRUQsT0FBTztRQUNMLGVBQWU7UUFDZixhQUFhO1FBQ2IsUUFBUTtRQUNSLElBQUksRUFBRSxVQUFVLENBQUMsTUFBTTtRQUN2QixrQkFBa0I7UUFDbEIsWUFBWTtRQUNaLFdBQVc7UUFDWCxjQUFjO0tBQ2YsQ0FBQztBQUNKLENBQUMifQ==