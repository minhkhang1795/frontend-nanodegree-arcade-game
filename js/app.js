const CELL_WIDTH = 101,
    CELL_HEIGHT = 83,
    NUM_COL = 7,
    NUM_ROW = 8;
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
    this.velocityX = Math.random() * (500 - 50) + 50; // max = 10, min = 150
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

Enemy.prototype.isCollidedWith = function (player) {
    if (!player && player instanceof Player)
        return false;

    if (this.rowPosition() !== player.rowPosition())
        return false;

    if (this.x + 101 - 10 < player.x + 10 || this.x + 10 > player.x + 101 - 10)
        return false;

    return true;
};

/**
 * Returns the row position the enemy is currently at
 */
Enemy.prototype.rowPosition = function () {
    return (this.y - 60) / CELL_HEIGHT;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player class
let Player = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = this.randomSprite();
    this.x = Math.floor(NUM_COL / 2) * CELL_WIDTH;
    this.y = (NUM_ROW - 1) * CELL_HEIGHT - 11;
    this.randomSprite();
};

/**
 * Randomly initialize the player's character
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
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.y < 0)
        this.reset();
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
            if (this.x > 0)
                this.x -= CELL_WIDTH;
            break;
        case 'up':
            if (this.y > 0)
                this.y -= CELL_HEIGHT;
            break;
        case 'right':
            if (this.x < CELL_WIDTH * (NUM_COL - 1))
                this.x += CELL_WIDTH;
            break;
        case 'down':
            if (this.y < CELL_HEIGHT * (NUM_ROW - 1) - 55)
                this.y += CELL_HEIGHT;
            break;
    }
};

/**
 * Returns the row position the player is currently at
 */
Player.prototype.rowPosition = function () {
    return (this.y + 11) / CELL_HEIGHT - 1;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
for (let i = 0; i < 6; i++) {
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

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
