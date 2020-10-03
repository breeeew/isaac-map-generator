import {getRandomInt} from './utils';

const START_POSITION = 45;
const LEFT = -1;
const DOWN = -10;
const RIGHT = 1;
const UP = 10;
const DIRECTIONS = [LEFT, DOWN, RIGHT, UP];

class MapGenerator {
    private readonly rooms: number[];
    private readonly level: number;

    private static getNeighbors(x: number, y: number) {
        const neighbors: number[] = [];
        const currentPos = Number(`${y}${x}`);

        for (const direction of DIRECTIONS) {
            const pos = currentPos + direction;

            let str = String(pos);
            if (str.length === 1) {
                str = `0${str}`;
            }

            // const y = Number(str[0]);
            const x = Number(str[1]);

            if (x === 0) {
                continue;
            }

            neighbors.push(pos);
        }

        return neighbors;
    }

    private static isMyNeighbor(positionA: number, positionB: number) {
        return DIRECTIONS.includes(positionA - positionB);
    }

    constructor(options: MapOptions) {
        this.rooms = [START_POSITION];
        this.level = options.level;
        this.generate();
    }

    private getRoomsAtNeighborhood(position: number) {
        return DIRECTIONS.filter(direction => this.rooms.includes(position + direction));
    }

    private generate() {
        // const impasses: number[] = [];
        const maxRooms = Math.floor(getRandomInt(2) + 5 + this.level * 2.6);

        for (let y = 1; y < 10; y++) {
            for (let x = 1; x < 10; x++) {
                const neighbors: number[] = MapGenerator.getNeighbors(x, y);

                for (const neighbor of neighbors) {
                    if (this.rooms.includes(neighbor)) {
                        continue;
                    }

                    const roomsAtNeighborhood = this.getRoomsAtNeighborhood(neighbor);
                    // .filter(pos => pos !== Number(`${y}${x}`));

                    if (roomsAtNeighborhood.length > 1) {
                        continue;
                    }

                    if (this.rooms.length === maxRooms) {
                        break;
                    }

                    if (getRandomInt(2) === 0) {
                        continue;
                    }

                    if (this.rooms.some(current => MapGenerator.isMyNeighbor(current, neighbor))) {
                        this.rooms.push(neighbor);
                    } else {
                        // impasses.push(neighbor);
                    }
                }

                if (x === 9 && y === 9 && this.rooms.length < maxRooms) {
                    x = 1;
                    y = 1;
                    continue;
                }

                if (this.rooms.length === maxRooms) {
                    break;
                }
            }
        }
    }

    public getMap() {
        return this.rooms.map((room) => {
            let pos = String(room);

            if (pos.length === 1) {
                pos = `0${pos}`;
            }

            const y = Number(pos[0]);
            const x = Number(pos[1]);

            return [x, y];
        });
    }
}

export default MapGenerator;

export interface MapOptions {
    level: number;
}
