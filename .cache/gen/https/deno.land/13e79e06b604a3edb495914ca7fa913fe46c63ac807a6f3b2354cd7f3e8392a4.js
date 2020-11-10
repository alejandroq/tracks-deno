import { HmacSha256 } from "./deps.ts";
import { compare } from "./tssCompare.ts";
const replacements = {
    "/": "_",
    "+": "-",
    "=": "",
};
export class KeyStack {
    constructor(keys) {
        this.#sign = (data, key) => {
            return btoa(String.fromCharCode.apply(undefined, new Uint8Array(new HmacSha256(key).update(data).arrayBuffer())))
                .replace(/\/|\+|=/g, (c) => replacements[c]);
        };
        if (!(0 in keys)) {
            throw new TypeError("keys must contain at least one value");
        }
        this.#keys = keys;
    }
    #keys;
    #sign;
    sign(data) {
        return this.#sign(data, this.#keys[0]);
    }
    verify(data, digest) {
        return this.indexOf(data, digest) > -1;
    }
    indexOf(data, digest) {
        for (let i = 0; i < this.#keys.length; i++) {
            if (compare(digest, this.#sign(data, this.#keys[i]))) {
                return i;
            }
        }
        return -1;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5U3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZXlTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUsxQyxNQUFNLFlBQVksR0FBMkI7SUFDM0MsR0FBRyxFQUFFLEdBQUc7SUFDUixHQUFHLEVBQUUsR0FBRztJQUNSLEdBQUcsRUFBRSxFQUFFO0NBQ1IsQ0FBQztBQUVGLE1BQU0sT0FBTyxRQUFRO0lBVW5CLFlBQVksSUFBVztRQU92QixVQUFLLEdBQUcsQ0FBQyxJQUFVLEVBQUUsR0FBUSxFQUFVLEVBQUU7WUFDdkMsT0FBTyxJQUFJLENBQ1QsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQ3ZCLFNBQVMsRUFFVCxJQUFJLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQVEsQ0FDdEUsQ0FDRjtpQkFDRSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7UUFmQSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7WUFDaEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQWRELEtBQUssQ0FBUTtJQWdCYixLQUFLLENBU0g7SUFLRixJQUFJLENBQUMsSUFBVTtRQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFLRCxNQUFNLENBQUMsSUFBVSxFQUFFLE1BQWM7UUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBS0QsT0FBTyxDQUFDLElBQVUsRUFBRSxNQUFjO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BELE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDWixDQUFDO0NBQ0YifQ==