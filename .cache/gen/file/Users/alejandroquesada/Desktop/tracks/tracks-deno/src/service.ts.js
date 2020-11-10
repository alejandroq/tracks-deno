import { db } from "./db.ts";
export const register = async (serviceName, nodeID) => {
    try {
        await db.execute(`
      INSERT INTO 
          registrations 
      VALUES 
          (?, ?)
      `, [serviceName, nodeID]);
        return {
            type: "value",
            value: null,
        };
    }
    catch (err) {
        return {
            type: "error",
            error: err,
        };
    }
};
export const readValue = async (keyPath, serviceName, nodeID, clientID, requestID) => {
    try {
        const results = await db.execute(`
        SELECT
            output_value
        FROM
            tracks
        WHERE
            key_path = ?
            AND service_id = ?
        LIMIT 1
        `, [keyPath, serviceName]);
        let value = (results.rows?.length !== null && results.rows.length > 0)
            ? results.rows[0].output_value
            : null;
        await db.execute(`
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
        `, [serviceName, clientID, nodeID, requestID, keyPath, value]);
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
    }
    catch (err) {
        return {
            type: "error",
            error: err,
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUU3QixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsS0FBSyxFQUMzQixXQUFtQixFQUNuQixNQUFjLEVBQ2dCLEVBQUU7SUFDaEMsSUFBSTtRQUNGLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FDZDs7Ozs7T0FLQyxFQUNELENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUN0QixDQUFDO1FBRUYsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDO0tBQ0g7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxHQUFHO1NBQ1gsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEtBQUssRUFDNUIsT0FBZSxFQUNmLFdBQW1CLEVBQ25CLE1BQWMsRUFDZCxRQUFpQixFQUNqQixTQUFrQixFQUNjLEVBQUU7SUFDbEMsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FDOUI7Ozs7Ozs7OztTQVNHLEVBQ0gsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQ3ZCLENBQUM7UUFFRixJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDckUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWTtZQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDO1FBRVQsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUNkOzs7Ozs7Ozs7Ozs7O1NBYUcsRUFDSCxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQzNELENBQUM7UUFFRixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsT0FBTztnQkFDTCxJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQzlCLENBQUM7U0FDSDtRQUVELE9BQU87WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQztLQUNIO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixLQUFLLEVBQUUsR0FBRztTQUNYLENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQyJ9