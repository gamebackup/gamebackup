// ant-colony-worker.js

// maps
const grid = {}; // true = dug out | false = full
const objects = {}; // holds all classes

// variables
let queenCount = 0;
let antCount = 0;
let tickCount = 0;
let foodCount = 0;
let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;
let idIncrement = 0;
let ticking = false; // in case of lag, this will avoid double ticking on the same tick.

// Static variables (passed from main thread, or defined here if fixed)
const foodChance = 0.03;
const queenChance = 0.02;
const birthTime = 30;
const ObjectType = { // enum for object types
    WALL: 0,
    ANT: 1,
    FOOD: 2
};

/**
 * Default Class for all Objects in the world
 */
class WorldObject {
    // override these
    letter;
    objectType;

    // set in constructor
    x;
    y;
    id;

    constructor(x, y) {
        idIncrement++;
        this.id = idIncrement;
        this.x = x;
        this.y = y;
        const newCoord = coord(x, y);

        // Ensure the object's coordinate entry exists before spreading
        objects[newCoord] = { ...(objects[newCoord] || {}), [this.id]: this };
        grid[newCoord] = true;
    }

    die() {
        if (objects[coord(this.x, this.y)]) { // Check if the coordinate still exists
            delete objects[coord(this.x, this.y)][this.id];
            if (Object.keys(objects[coord(this.x, this.y)]).length < 1) {
                delete objects[coord(this.x, this.y)];
            }
        }
    }
}

class Food extends WorldObject {
    objectType = ObjectType.FOOD;
    foodLeft = 3;
    letter = this.foodLeft.toString();

    constructor(x, y) {
        super(x, y);
        foodCount += this.foodLeft;
    }

    eat() {
        foodCount--;
        this.foodLeft--;
        if (this.foodLeft <= 0) {
            this.die();
        }
        this.letter = this.foodLeft.toString(10);
    }
}

/**
 * The Bug Class that has the ability to take basic actions
 * extend upon this class for all other objects
 */
class Bug extends WorldObject {
    // override these
    hungerMax;
    hungerRate;
    delay;

    // set in constructor
    wait;
    hunger;
    lastDirection = "bottom";

    constructor(x, y) {
        super(x, y);
        this.wait = this.delay;
    }

    die() {
        super.die();
        new Food(this.x, this.y);
    }

    takeTurn(action = () => {}) {
        // check hunger
        this.hunger -= this.hungerRate;
        if (this.hunger <= 0) {
            this.die();
            return;
        }

        if (this.wait > 0) {
            this.wait--;
            return;
        }

        this.wait = this.delay;
        action();
    }

    move(direction) {
        const lastCoord = coord(this.x, this.y);
        if (objects[lastCoord]) { // Ensure the coordinate exists before deleting
            delete objects[lastCoord][this.id];
            if (Object.keys(objects[lastCoord]).length < 1) {
                delete objects[lastCoord];
            }
        }

        switch (direction) {
            case ("left"):
                this.x = this.x - 1;
                if (this.x < minX) {
                    minX = this.x;
                }
                break;
            case ("top"):
                this.y = this.y - 1;
                if (this.y < minY) {
                    minY = this.y;
                }
                break;
            case ("bottom"):
                this.y = this.y + 1;
                if (this.y > maxY) {
                    maxY = this.y;
                }
                break;
            case ("right"):
                this.x = this.x + 1;
                if (this.x > maxX) {
                    maxX = this.x;
                }
                break;
        }
        const newCoord = coord(this.x, this.y);
        if (!grid[newCoord] && Math.random() < foodChance) {
            new Food(this.x, this.y);
        }
        grid[newCoord] = true;
        objects[newCoord] = {
            ...(objects[newCoord] || {}), // Ensure it exists before spreading
            [this.id]: this
        };
        this.lastDirection = direction; // Update lastDirection after move
    }
}

/**
 * this is the ant capable of making new tunnels and looking for food
 */
class Ant extends Bug {
    letter = "A";
    delay = 1;
    hungerMax = 100;
    hungerRate = 1;
    objectType = ObjectType.ANT;

    constructor(x, y) {
        super(x, y);
        antCount++;
        this.hunger = this.hungerMax;
    }

    die() {
        super.die();
        antCount--;
    }

    takeTurn(action = () => {}) {
        super.takeTurn(() => {
            const [priorities, distanceNegative] = this.getPriorities();
            const direction = priorityDirection(
                sight(this.x, this.y),
                priorities,
                this.lastDirection,
                distanceNegative
            );
            this.move(direction);

            // eat if necessary
            if (this.hunger < (this.hungerMax - (this.hungerRate * 10))) {
                const checkCoord = coord(this.x, this.y);
                let _objects = objects[checkCoord];
                if (_objects) { // Check if objects exist at this coord
                    let foodObjects = Object.values(_objects).filter(o => o.objectType === ObjectType.FOOD);
                    if (foodObjects.length > 0) {
                        foodObjects[0].eat();
                        this.hunger = this.hungerMax;
                    }
                }
            }
            action();
        });
    }

    getPriorities() {
        const priorities = [ObjectType.WALL];
        if ((this.hunger / this.hungerMax) < 0.5) {
            priorities.unshift(ObjectType.FOOD);
        }
        return [priorities, this.hunger / this.hungerMax];
    }
}

class Queen extends Ant {
    letter = "Q";
    delay = 3;
    hungerMax = 500;
    hungerRate = 1;
    birthTime = birthTime;
    birthCount = 0;

    constructor(x, y) {
        super(x, y);
        queenCount++;
        this.hunger = this.hungerMax;
    }

    die() {
        super.die();
        queenCount--;
    }

    takeTurn(action = () => {}) {
        super.takeTurn(() => {
            this.birthCount++;
            if (this.birthCount >= this.birthTime) {
                this.birthCount = 0;
                if (Math.random() < queenChance) {
                    new Queen(this.x + 1, this.y);
                } else {
                    new Ant(this.x + 1, this.y);
                }
            }
            action();
        });
    }
}

/**
 * Iterates over all bugs and makes them take their turn
 */
function tick() {
    if (!ticking) {
        ticking = true;
        Object.values(objects).forEach(bugs => {
            Object.values(bugs).forEach(bug => {
                if (bug.takeTurn) {
                    bug.takeTurn();
                }
            });
        });
        tickCount++;
        ticking = false;

        // Send the updated state back to the main thread
        self.postMessage({
            type: 'update',
            grid: grid, // Send the entire grid
            objects: serializeObjects(objects), // Send a serializable version of objects
            queenCount: queenCount,
            antCount: antCount,
            foodCount: foodCount,
            tickCount: tickCount,
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
            foodChance: foodChance,
            queenChance: queenChance,
            birthTime: birthTime
        });
    }
}

// Utility to serialize objects for message passing
// Web Workers can't send complex objects with circular references or class instances directly.
// We need to send simple data structures.
function serializeObjects(objMap) {
    const serialized = {};
    for (const coordKey in objMap) {
        serialized[coordKey] = {};
        for (const id in objMap[coordKey]) {
            const obj = objMap[coordKey][id];
            // Only send necessary properties for rendering
            serialized[coordKey][id] = {
                x: obj.x,
                y: obj.y,
                id: obj.id,
                letter: obj.letter,
                objectType: obj.objectType,
                // Add any other properties needed for rendering, e.g., foodLeft for Food objects
                ...(obj.objectType === ObjectType.FOOD && { foodLeft: obj.foodLeft })
            };
        }
    }
    return serialized;
}


/**
 * Utility for getting surroundings at a coord
 */
function adjacent(x, y) {
    const left = grid[coord(x - 1, y)];
    const top = grid[coord(x, y - 1)];
    const bottom = grid[coord(x, y + 1)];
    const right = grid[coord(x + 1, y)];
    return [left, top, bottom, right];
}

/**
 * Utility for getting sight in straight lines. Gives the array and distance
 * [[Array<ObjectType>, number], x4]
 */
function sight(x, y) {
    let _x;
    let _y;
    let left;
    let top;
    let bottom;
    let right;

    // left
    _x = x - 1;
    while (!left) {
        left = scan(_x, y);
        if (left) {
            left = [left, Math.abs(x - _x)];
        }
        _x--;
    }

    // top
    _y = y - 1;
    while (!top) {
        top = scan(x, _y);
        if (top) {
            top = [top, Math.abs(y - _y)];
        }
        _y--;
    }

    // bottom
    _y = y + 1;
    while (!bottom) {
        bottom = scan(x, _y);
        if (bottom) {
            bottom = [bottom, Math.abs(y - _y)];
        }
        _y++;
    }

    // right
    _x = x + 1;
    while (!right) {
        right = scan(_x, y);
        if (right) {
            right = [right, Math.abs(x - _x)];
        }
        _x++;
    }

    return [left, top, bottom, right];
}

/**
 * Check a single spot and return the array of Objects
 */
function scan(x, y) {
    const _coord = coord(x, y);
    const _objects = objects[_coord];
    if (_objects) {
        return Object.values(_objects).map(o => (o.objectType));
    }
    if (!grid[_coord]) {
        return [ObjectType.WALL];
    }
    return []; // Return empty array if neither objects nor wall
}

/**
 * Utility for making the coord key;
 */
function coord(x, y) {
    return `${x},${y}`;
}

/**
 * Utility for determining priority direction based on sight.
 * DistanceNegative will make things less priority if farther away
 */
function priorityDirection(sightArr, priorities, lastDirection, distanceNegative = 0) {
    const [
        [leftTypes, leftDistance],
        [topTypes, topDistance],
        [bottomTypes, bottomDistance],
        [rightTypes, rightDistance]
    ] = sightArr;

    const filter = t => (priorities.includes(t));
    const sort = (a, b) => (priorities.indexOf(a) - priorities.indexOf(b));

    let bestLeft = priorities.indexOf(
        leftTypes
        .filter(filter)
        .sort(sort)[0]
    );
    bestLeft < 0 ?
        bestLeft = Number.MAX_SAFE_INTEGER :
        bestLeft += leftDistance * distanceNegative;

    let bestTop = priorities.indexOf(
        topTypes
        .filter(filter)
        .sort(sort)[0]
    );
    bestTop < 0 ?
        bestTop = Number.MAX_SAFE_INTEGER :
        bestTop += topDistance * distanceNegative;

    let bestBottom = priorities.indexOf(
        bottomTypes
        .filter(filter)
        .sort(sort)[0]
    );
    bestBottom < 0 ?
        bestBottom = Number.MAX_SAFE_INTEGER :
        bestBottom += bottomDistance * distanceNegative;

    let bestRight = priorities.indexOf(
        rightTypes
        .filter(filter)
        .sort(sort)[0]
    );
    bestRight < 0 ?
        bestRight = Number.MAX_SAFE_INTEGER :
        bestRight += rightDistance * distanceNegative;

    let list = [
        [bestLeft, "left"],
        [bestTop, "top"],
        [bestBottom, "bottom"],
        [bestRight, "right"]
    ];

    list = list.sort((a, b) => (a[0] - b[0]));
    let lowest = list[0][0];
    list = list.filter(p => p[0] <= lowest);

    // If all options are MAX_SAFE_INTEGER (no priority match), choose a random direction.
    if (lowest === Number.MAX_SAFE_INTEGER) {
        const randomDirections = ["left", "top", "bottom", "right"];
        return randomDirections[Math.floor(Math.random() * randomDirections.length)];
    }

    return list[Math.floor(Math.random() * list.length)][1];
}


// Listen for messages from the main thread
self.onmessage = function(event) {
    const message = event.data;
    if (message.type === 'start') {
        // Initialize the simulation with a queen
        new Queen(0, 0);
        // Start the tick interval
        setInterval(tick, message.tickTime);
    }
};
