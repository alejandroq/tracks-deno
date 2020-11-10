import { Result } from "https://github.com/alejandroq/typescriptx/raw/main/result.ts";
import { db } from "./db.ts";

export const register = async (
  serviceName: string,
  nodeID: string,
): Promise<Result<null, Error>> => {
  try {
    await db.execute(
      `
      INSERT INTO 
          registrations 
      VALUES 
          (?, ?)
      `,
      [serviceName, nodeID],
    );

    return {
      type: "value",
      value: null,
    };
  } catch (err) {
    return {
      type: "error",
      error: err,
    };
  }
};

export const readValue = async (
  keyPath: string,
  serviceName: string,
  nodeID: string,
  clientID?: string,
  requestID?: string
): Promise<Result<string, Error>> => {
  try {
    const results = await db.execute(
      `
        SELECT
            output_value
        FROM
            tracks
        WHERE
            key_path = ?
            AND service_id = ?
        LIMIT 1
        `,
      [keyPath, serviceName],
    );

    let value = (results.rows?.length !== null && results.rows!.length > 0)
      ? results.rows![0].output_value
      : null;

    await db.execute(
      `
        INSERT INTO
        traces
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            NOW()
        );
        `,
      [serviceName, clientID, nodeID, requestID, keyPath, value],
    );

    if (value === null) {
      return {
        type: "error",
        error: new Error("not found"),
      };
    }

    return {
      type: "value",
      value: value,
    };
  } catch (err) {
    return {
      type: "error",
      error: err,
    };
  }
};
