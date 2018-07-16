const CELL_WIDTH = 101,
    CELL_HEIGHT = 83,
    NUM_COL = 7,
    NUM_ROW = 8,
    MAX_ENEMIES = 10,
    MAX_ROCKS = 6;
let level = 1;

// Enemies our player must avoid
let Enemy = function (sprite = 'images/enemy-bug.png', x = 0, y = 60, velocityX = 50) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.randomInit();
};

/**
 * Randomly initialize the enemy object's properties
 */
Enemy.prototype.randomInit = function () {
    this.x = Math.random() * (-100 + 500) - 500; // max = -100, min = -500
    let rows = [60, 60 + CELL_HEIGHT, 60 + CELL_HEIGHT * 2, 60 + CELL_HEIGHT * 4, 60 + CELL_HEIGHT * 5];
    this.y = rows[Math.floor(Math.random() * (0 - rows.length) + rows.length)]; // choose a row position in the list
    this.velocityX = Math.random() * (400 - 50) + 50; // max = 400, min = 50
};

/**
 * Update the enemy's position, required method for game
 * @param dt, a time delta between ticks
 */
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.velocityX * dt;

    // If bugs move off screen, reset position
    if (this.x > NUM_COL * CELL_WIDTH) {
        this.randomInit();
    }
};

/**
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Returns the row position the enemy is currently at
 * @returns {number}
 */
Enemy.prototype.rowPosition = function () {
    return (this.y - 60) / CELL_HEIGHT;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player class
let Player = function () {
    this.sprite = this.randomSprite();
    this.x = Math.floor(NUM_COL / 2) * CELL_WIDTH;
    this.y = (NUM_ROW - 1) * CELL_HEIGHT - 11;
};

/**
 * Return a random player's character
 * @returns {string} sprite source
 */
Player.prototype.randomSprite = function () {
    let sprites = ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'];
    return sprites[Math.floor(Math.random() * (0 - sprites.length) + sprites.length)];
};

/**
 * Update the player's position, required method for game
 */
Player.prototype.update = function () {
    if (this.y < 0) {
        level++;
        generateRocks();
        generateEnemies();
        this.reset();
    }
};

/**
 * Randomly initialize the player's character
 */
Player.prototype.reset = function () {
    this.sprite = this.randomSprite();
    this.x = Math.floor(NUM_COL / 2) * CELL_WIDTH;
    this.y = (NUM_ROW - 1) * CELL_HEIGHT - 11;
};

/**
 * Draw the player on the screen, required method for game
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Handle key input from the user
 * @param key
 */
Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            if (this.x > 0 && !player.isCollidedWithAnyIn(allRocks, -CELL_WIDTH, 0)) {
                this.x -= CELL_WIDTH;
            }
            break;
        case 'up':
            if (this.y > 0 && !player.isCollidedWithAnyIn(allRocks, 0, -CELL_HEIGHT))
                this.y -= CELL_HEIGHT;
            break;
        case 'right':
            if (this.x < CELL_WIDTH * (NUM_COL - 1) && !player.isCollidedWithAnyIn(allRocks, CELL_WIDTH, 0))
                this.x += CELL_WIDTH;
            break;
        case 'down':
            if (this.y < CELL_HEIGHT * (NUM_ROW - 1) - 55 && !player.isCollidedWithAnyIn(allRocks, 0, CELL_HEIGHT))
                this.y += CELL_HEIGHT;
            break;
    }
};

/**
 * Check if the player is collided with an object
 * @param object
 * @param x, future x position if moved
 * @param y, future y position if moved
 * @returns {boolean}
 */
Player.prototype.isCollidedWithA = function (object, x = 0, y = 0) {
    if (!object || !(object instanceof Enemy) && !(object instanceof Rock))
        return false;

    if (this.rowPosition(y) !== object.rowPosition())
        return false;

    if (object.x + 101 - 10 < (this.x + x) + 10 || object.x + 10 > (this.x + x) + 101 - 10)
        return false;

    return true;
};

/**
 * Check if the player is collided with any object in a list of objects
 * @param {array} objects
 * @param x, future x position if moved
 * @param y, future y position if moved
 * @returns {boolean}
 */
Player.prototype.isCollidedWithAnyIn = function (objects, x = 0, y = 0) {
    if (!isIterable(objects))
        return this.isCollidedWithA(objects, x, y);

    for (let object of objects) {
        if (this.isCollidedWithA(object, x, y))
            return true;
    }

    return false;
};

/**
 * Returns the row position the player is currently at
 * @param y, future y position if moved
 * @returns {number}
 */
Player.prototype.rowPosition = function (y = 0) {
    return (this.y + y + 11) / CELL_HEIGHT - 1;
};

// Rocks are obstacles that the player has to circumvent
let Rock = function (x = 0, y = 60 + CELL_HEIGHT * 3) {
    this.sprite = 'images/Rock.png';
    this.x = x;
    this.y = y;
};

/**
 * Draw the player on the screen, required method for game
 */
Rock.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Returns the row position the rock
 * @returns {number}
 */
Rock.prototype.rowPosition = function () {
    return (this.y - 60) / CELL_HEIGHT;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
generateEnemies();

// Place the rocks randomly on the grasses, the number of rocks depends on the current level
let allRocks = [];
generateRocks();

// Place the player object in a variable called player
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function generateEnemies(shouldEmpty=false) {
    if (shouldEmpty)
        allEnemies = [];
    let numEnemies = MAX_ENEMIES < level + 3 ? MAX_ENEMIES : level + 3;
    while (allEnemies.length < numEnemies) {
        allEnemies.push(new Enemy());
    }
}

function generateRocks() {
    allRocks = []; // List of Rock objects
    let rockPositions = []; // List of the column positions of rocks
    let numRocks = MAX_ROCKS < Math.floor(level / 2) ? MAX_ROCKS : Math.floor(level / 2);
    while (rockPositions.length !== numRocks) {
        let n = Math.floor(Math.random() * (0 - MAX_ROCKS) + MAX_ROCKS);
        if (rockPositions.length === 0 || !rockPositions.includes(n))
            rockPositions.push(n);
    }
    for (let i = 0; i < numRocks; i++) {
        allRocks.push(new Rock(rockPositions[i] * 101));
    }
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}
