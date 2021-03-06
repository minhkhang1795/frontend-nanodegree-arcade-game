/** Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */
let Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    let doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    canvas.height = 840;
    doc.body.appendChild(canvas);

    /**
     * This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        let now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        drawUI();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /**
     * This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /**
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /**
     * This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
    }

    /**
     * This function checks collisions between our player and the enemies
     */
    function checkCollisions() {
        if (player.isCollidedWithAnyIn(allEnemies)) {
            // Lost
            if (isPlaying) {
                Sound.bump.play();
            }
            isPlaying = false;
        }
    }

    /**
     * This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        let rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 5 of stone
                'images/stone-block.png',   // Row 2 of 5of stone
                'images/stone-block.png',   // Row 3 of 5 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/stone-block.png',   // Row 4 of 5 of stone
                'images/stone-block.png',   // Row 5 of 5 of stone
                'images/grass-block.png',   // Row 2 of 2 of grass
                'images/wood-block.png'     // Last row is wood
            ],
            numRows = 9,
            numCols = 7,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        if (isPlaying) {
            renderEntities();
        } else {
            showScoreBoard();
        }
    }

    /**
     * This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allGems.forEach(function (gem) {
            gem.render();
        });
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
        allRocks.forEach(function (rock) {
            rock.render();
        });
    }

    /**
     * Draw the user interface of the game including title, score and gem collected counts
     */
    function drawUI() {
        ctx.drawImage(Resources.get('images/frogger-logo.png'), 59, 30);
        let starResource = Resources.get('images/Star.png'),
            gemBlueResource = Resources.get('images/Gem-Blue.png'),
            gemGreenResource = Resources.get('images/Gem-Green.png'),
            gemOrangeResource = Resources.get('images/Gem-Orange.png');
        ctx.drawImage(starResource, 10, 670, starResource.width / 1.2, starResource.height / 1.2);
        ctx.drawImage(gemBlueResource, 219, 682, gemBlueResource.width / 1.5, gemBlueResource.height / 1.5);
        ctx.drawImage(gemGreenResource, 421, 682, gemGreenResource.width / 1.5, gemGreenResource.height / 1.5);
        ctx.drawImage(gemOrangeResource, 623, 682, gemOrangeResource.width / 1.5, gemOrangeResource.height / 1.5);
        ctx.font = "50px Gaegu";
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeText(level.toString(), 34, 825);
        ctx.fillText(level.toString(), 34, 825);
        ctx.strokeText(GemsCollected["blue"].toString(), 34 + 202, 825);
        ctx.fillText(GemsCollected["blue"].toString(), 34 + 202, 825);
        ctx.strokeText(GemsCollected["green"].toString(), 34 + 404, 825);
        ctx.fillText(GemsCollected["green"].toString(), 34 + 404, 825);
        ctx.strokeText(GemsCollected["orange"].toString(), 34 + 606, 825);
        ctx.fillText(GemsCollected["orange"].toString(), 34 + 606, 825);
    }

    /**
     * This function draws the scoreboard when the player wins or loses the game.
     * The player wins the game when they pass level 14
     * The player loses it when they hit a bug
     */
    function showScoreBoard() {
        let title = level >= 15 ? 'Congrats, you won!' : 'Ah, you lost!',
            titleX = level >= 15 ? 152 : 220,
            titleY = 280,
            totalScore = level * 60 + GemsCollected.blue * 30 + GemsCollected.green * 40 + GemsCollected.orange * 50,
            scoreBoard = Resources.get('images/score-board.jpg'),
            starResource = Resources.get('images/Star.png'),
            gemBlueResource = Resources.get('images/Gem-Blue.png'),
            gemGreenResource = Resources.get('images/Gem-Green.png'),
            gemOrangeResource = Resources.get('images/Gem-Orange.png'),
            offset = 70;
        // Draw image assets
        ctx.drawImage(scoreBoard, (canvas.width - scoreBoard.width) / 2, (canvas.height - scoreBoard.height - offset) / 2);
        ctx.drawImage(starResource, 175, 260 - offset, starResource.width / 1.5, starResource.height / 1.5);
        ctx.drawImage(gemBlueResource, 180, 345 - offset, gemBlueResource.width / 1.8, gemBlueResource.height / 1.8);
        ctx.drawImage(gemGreenResource, 180, 425 - offset, gemGreenResource.width / 1.8, gemGreenResource.height / 1.8);
        ctx.drawImage(gemOrangeResource, 180, 505 - offset, gemOrangeResource.width / 1.8, gemOrangeResource.height / 1.8);
        // Draw text
        ctx.font = "50px Gaegu";
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeText(title, titleX, titleY - offset);
        ctx.fillText(title, titleX, titleY - offset);
        ctx.font = "45px Gaegu";
        ctx.strokeText(level + ' x 60 = ' + level * 60, 270, 340 - offset);
        ctx.fillText(level + ' x 60 = ' + level * 60, 270, 340 - offset);
        ctx.strokeText(GemsCollected.blue + ' x 30 = ' + GemsCollected.blue * 30, 270, 420 - offset);
        ctx.fillText(GemsCollected.blue + ' x 30 = ' + GemsCollected.blue * 30, 270, 420 - offset);
        ctx.strokeText(GemsCollected.green + ' x 40 = ' + GemsCollected.green * 40, 270, 500 - offset);
        ctx.fillText(GemsCollected.green + ' x 40 = ' + GemsCollected.green * 40, 270, 500 - offset);
        ctx.strokeText(GemsCollected.orange + ' x 50 = ' + GemsCollected.orange * 50, 270, 580 - offset);
        ctx.fillText(GemsCollected.orange + ' x 50 = ' + GemsCollected.orange * 50, 270, 580 - offset);
        ctx.strokeText('_______', 270, 640 - offset);
        ctx.fillText('_______', 270, 640 - offset);
        ctx.strokeText('Total: ' + totalScore.toString(), 270, 640 - offset);
        ctx.fillText('Total: ' + totalScore.toString(), 270, 640 - offset);
        ctx.strokeText('Spacebar to restart', 170, 680);
        ctx.fillText('Spacebar to restart', 170, 680);
    }

    /**
     * Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/wood-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Rock.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/frogger-logo.png',
        'images/Star.png',
        'images/score-board.jpg'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
