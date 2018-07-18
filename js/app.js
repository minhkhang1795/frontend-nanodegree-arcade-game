/** app.js
 * This file stores class definitions and initializes main objects of the game.
 * All the logic will be handled here while the front-end will be in engine.js
 */
const CELL_WIDTH = 101,
    CELL_HEIGHT = 83,
    NUM_COL = 7,
    NUM_ROW = 8,
    MAX_ENEMIES = 10,
    MAX_ROCKS = 6,
    GemType = Object.freeze({BLUE: "blue", GREEN: "green", ORANGE: "orange"});
let level = 0,
    gemsCollected = {blue: 0, green: 0, orange: 0},
    isPlaying = true;


/************************************************************
 * The Enemy class constructor                              *
 * @param sprite                                            *
 * @param x                                                 *
 * @param y                                                 *
 * @param velocityX                                         *
 * @constructor                                             *
 ************************************************************/
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
    return Math.floor((this.y - 60) / CELL_HEIGHT);
};


/************************************************************
 * The Player class constructor                             *
 * @constructor                                             *
 ************************************************************/
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
 * Also check whether the player reaches the water or they reach level 15
 */
Player.prototype.update = function () {
    // Player reaches the water, continue to next level
    if (this.y < 0 && isPlaying) {
        level++;
        if (level >= 15) {
            // Victory
            isPlaying = false; // Pause the game and show the score board
        } else {
            this.reset();
            generateGems();
            generateRocks();
            generateEnemies();
        }
    }
};

/**
 * Randomly initialize the player's character (sprite)
 * Set the position back to start
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
 * Arrow keys, wasd is to move the character
 * Space bar to restart the game
 * @param key
 */
Player.prototype.handleInput = function (key) {
    switch (key) {
        case 'left':
            if (this.x > 0 && !this.isCollidedWithAnyIn(allRocks, -CELL_WIDTH, 0)) {
                this.x -= CELL_WIDTH;
            }
            break;
        case 'up':
            if (this.y > 0 && !this.isCollidedWithAnyIn(allRocks, 0, -CELL_HEIGHT))
                this.y -= CELL_HEIGHT;
            break;
        case 'right':
            if (this.x < CELL_WIDTH * (NUM_COL - 1) && !this.isCollidedWithAnyIn(allRocks, CELL_WIDTH, 0))
                this.x += CELL_WIDTH;
            break;
        case 'down':
            if (this.y < CELL_HEIGHT * (NUM_ROW - 1) - 55 && !this.isCollidedWithAnyIn(allRocks, 0, CELL_HEIGHT))
                this.y += CELL_HEIGHT;
            break;
        case 'space':
            // Restart the game
            if (!isPlaying) {
                isPlaying = true;
                reset();
            }
            break;
    }

    for (let i = 0; i < allGems.length; i++) {
        let gem = allGems[i];
        if (this.isCollidedWithA(gem)) {
            gemsCollected[gem.type]++;
            allGems.splice(i, 1);
            gem = null;
            break;
        }
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
    if (!object || !(object instanceof Enemy) && !(object instanceof Rock) && !(object instanceof Gem))
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


/************************************************************
 * The rock class constructor                               *
 * Rocks are obstacles that the player has to circumvent    *
 * @param x                                                 *
 * @param y                                                 *
 * @constructor                                             *
 ************************************************************/
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
    return Math.floor((this.y - 60) / CELL_HEIGHT);
};


/************************************************************
 * Define Gem class.                                        *
 * Blue Gem: +30 points                                     *
 * Green Gem: +40 points                                    *
 * Orange Gem: +50 points                                   *
 * @param x                                                 *
 * @param y                                                 *
 * @param {GemType} type                                    *
 * @constructor                                             *
 ************************************************************/
let Gem = function (x = 0, y = 0, type = GemType.BLUE) {
    this.x = x;
    this.y = y;
    this.type = type;
    switch (this.type) {
        case GemType.GREEN:
            this.sprite = 'images/Gem-Green.png';
            break;
        case GemType.ORANGE:
            this.sprite = 'images/Gem-Orange.png';
            break;
        case GemType.BLUE:
            this.sprite = 'images/Gem-Blue.png';
            break;
        default:
            this.sprite = 'images/Gem-Blue.png';
    }
};

/**
 * Draw the gem on the screen, required method for game
 */
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Generate a random position for a gem on a stone block
 */
Gem.prototype.generateRandomPosition = function () {
    let cols = [0, 1, 2, 3, 4, 5, 6],
        rows = [0, 1, 2, 4, 5],
        randomNumber = Math.floor(Math.random() * (0 - 35) + 35);
    this.x = cols[randomNumber % 7] * CELL_WIDTH;
    this.y = rows[randomNumber % 5] * CELL_HEIGHT + 60;
};

/**
 * Check if this gem is at the same spot as another gem
 * @param {Gem} gem
 * @returns {boolean}
 */
Gem.prototype.isAtSamePositionAs = function (gem) {
    if (!gem || !(gem instanceof Gem))
        return false;

    if (this.rowPosition() === gem.rowPosition() && this.colPosition() === gem.colPosition())
        return true;
    return false;
};

/**
 * Returns the row position the gem
 * @returns {number}
 */
Gem.prototype.rowPosition = function () {
    return Math.floor((this.y - 60) / CELL_HEIGHT);
};

/**
 * Returns the col position the gem
 * @returns {number}
 */
Gem.prototype.colPosition = function () {
    return Math.floor(this.x / CELL_WIDTH);
};


/************************************************************
 *                                                          *
 * Begin to initialize objects and set things up            *
 *                                                          *
 * **********************************************************/
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
generateEnemies();

// Place the rocks randomly on the grass lane, the number of rocks depends on the current level
let allRocks = [];
generateRocks();

// Generate gems depending on the level
let allGems = [];
generateGems();

// Place the player object in a variable called player
let player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        65: 'left',
        38: 'up',
        87: 'up',
        39: 'right',
        68: 'right',
        40: 'down',
        83: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


/**
 * This function does nothing but it could have been a good place to
 * handle game reset states - maybe a new game menu or a game over screen
 * those sorts of things. It's only called once by the init() method.
 *
 */
function reset() {
    level = 0;
    gemsCollected = {blue: 0, green: 0, orange: 0};
    player.reset();
    generateGems();
    generateRocks();
    generateEnemies(true);
}

/**
 * Generate random enemies by filling out the allEnemies list
 * @param shouldEmpty: should empty the list before adding new enemies
 */
function generateEnemies(shouldEmpty = false) {
    if (shouldEmpty)
        allEnemies = [];
    let numEnemies = MAX_ENEMIES < level + 3 ? MAX_ENEMIES : level + 3;
    while (allEnemies.length < numEnemies) {
        allEnemies.push(new Enemy());
    }
}

/**
 * Generate random rocks on the middle grass lane
 */
function generateRocks() {
    allRocks = []; // List of Rock objects
    let rockPositions = []; // List of the column positions of rocks
    let numRocks = MAX_ROCKS < Math.floor(level / 2) ? MAX_ROCKS : Math.floor(level / 2);
    // Choose ${numRocks} random rocks out of 7 rock positions
    while (rockPositions.length !== numRocks) {
        let n = Math.floor(Math.random() * (0 - 49) + 49) % 7;
        if (rockPositions.length === 0 || !rockPositions.includes(n))
            rockPositions.push(n);
    }
    for (let i = 0; i < numRocks; i++) {
        allRocks.push(new Rock(rockPositions[i] * 101));
    }
}

/**
 * Generate random gems on the block lane. The number of gems depends on the current level
 */
function generateGems() {
    allGems = [];
    allGems.push(new Gem(0, 0, GemType.BLUE));
    if (level > 5) {
        allGems.push(new Gem(0, 0, GemType.GREEN));
    }
    if (level > 10) {
        allGems.push(new Gem(0, 0, GemType.ORANGE));
    }

    for (let i = 0; i < allGems.length; i++) {
        allGems[i].generateRandomPosition();
        for (let j = 0; j < i; j++) {
            if (allGems[i].isAtSamePositionAs(allGems[j])) {
                i--;
                break;
            }
        }
    }
}

/**
 * Helper function to check whether an object is iterable
 * https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
 * @param obj
 * @returns {boolean}
 */
function isIterable(obj) {
    // checks for null and undefined
    if (!obj) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}
