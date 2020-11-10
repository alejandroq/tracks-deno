import { deferred } from "../deps.ts";
export class DeferredStack {
    constructor(_maxSize, _array = [], creator) {
        this._maxSize = _maxSize;
        this._array = _array;
        this.creator = creator;
        this._queue = [];
        this._size = 0;
        this._size = _array.length;
    }
    get size() {
        return this._size;
    }
    get maxSize() {
        return this._maxSize;
    }
    get available() {
        return this._array.length;
    }
    async pop() {
        if (this._array.length) {
            return this._array.pop();
        }
        else if (this._size < this._maxSize) {
            this._size++;
            let item;
            try {
                item = await this.creator();
            }
            catch (err) {
                this._size--;
                throw err;
            }
            return item;
        }
        const defer = deferred();
        this._queue.push(defer);
        return await defer;
    }
    push(item) {
        if (this._queue.length) {
            this._queue.shift().resolve(item);
            return false;
        }
        else {
            this._array.push(item);
            return true;
        }
    }
    tryPopAvailable() {
        return this._array.pop();
    }
    remove(item) {
        const index = this._array.indexOf(item);
        if (index < 0)
            return false;
        this._array.splice(index, 1);
        this._size--;
        return true;
    }
    reduceSize() {
        this._size--;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXJyZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZWZlcnJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVksUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBR2hELE1BQU0sT0FBTyxhQUFhO0lBSXhCLFlBQ1csUUFBZ0IsRUFDakIsU0FBYyxFQUFFLEVBQ1AsT0FBeUI7UUFGakMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNqQixXQUFNLEdBQU4sTUFBTSxDQUFVO1FBQ1AsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFOcEMsV0FBTSxHQUFrQixFQUFFLENBQUM7UUFDM0IsVUFBSyxHQUFHLENBQUMsQ0FBQztRQU9oQixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRztRQUNQLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxJQUFPLENBQUM7WUFDWixJQUFJO2dCQUNGLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM3QjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYixNQUFNLEdBQUcsQ0FBQzthQUNYO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sTUFBTSxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUdELElBQUksQ0FBQyxJQUFPO1FBQ1YsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFPO1FBQ1osTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxLQUFLLEdBQUcsQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztDQUNGIn0=