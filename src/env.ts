import { v4 } from './deps.ts';

export const nodeID = v4.generate();
export const serviceName = ((): string => {
    const value = Deno.env.get("TRACKS_SERVICE_NAME");
    if (value === undefined) {
        throw new Error("TRACKS_SERVICE_NAME not found in the .env file")
    }
    return value;
})()