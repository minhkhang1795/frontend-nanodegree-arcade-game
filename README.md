The Frogger Game
===============================

Apply OOP in Javascript to create a classic arcade game: the Frogger. This is one of the projects for Udacity Front-End Web Developer Nanodegree Program. 

## How The Game Works
In this game, you have a Player and Enemies (Bugs). The goal of the player is to reach the water, without colliding into any one of the enemies. The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene. Once the player collides with an enemy, the game is reset and the player moves back to the start square. Once the player reaches the water, the game moves to the next level. The player can collect gems to increase their final score. The player wins when the level 15 is reached.

The player can:

* Move up, down, left, right using the arrow keys or the WASD.
* Reach the water to get to the next level.
* Collect different types of gem.
* Win the game by reaching level 15.
* Or lose the game by hitting a bug, a suicidal act!

Live Demo on [Github Page](https://minhkhang1795.github.io/frontend-nanodegree-arcade-game/)

## Implemented functionalities
* [x] Handle key inputs from the player: arrow keys and WASD to move; spacebar to restart the game.
* [x] Check collisions with other objects:
    * [x] Bugs/Enemies: the player will lose the game.
    * [x] Rock: the player is blocked by rock and has to circumvent it.
    * [x] Gem: the player will collect it and earn more points.
* [x] Add more lanes to the map.
* [x] Bugs/Enemies are randomly spawned on different stone lanes and with different speeds.
* [x] Rocks are randomly placed on the middle grass lane.
* [x] Gem are randomly generated on the stone lanes.
    * [x] Blue gem: appears in all level and is worth 30 points.
    * [x] Green gem: appears from level 6 and is worth 40 points.
    * [x] Orange gem: appear from level 11 and is worth 50 points.
* [x] There are 15 levels, each of which is worth 60 points.
* [x] The player's character is randomly chosen every time the game is reset.
* [x] Pretty user interface to show the stats.
* [x] Pretty scoreboard when the game ends (either the player wins or loses) to show how the player performs.
* [x] Custom fonts, image assets and titles to make the game more interactive and interesting.
* [x] Add sound effects for bumping into an obstacle, collecting gems, reaching the next level, and winning.

## To run the game
Clone the repository:
`git clone https://github.com/minhkhang1795/frontend-nanodegree-arcade-game.git`

Open `index.html` to play!

## Credits
* Project template:
    * https://github.com/udacity/frontend-nanodegree-arcade-game
* Frogger text title:
    * https://flamingtext.com/logo/Design-3D-Text
* Wood block image asset:
    * http://sentry71.github.io/arcade/
* Mario sound track:
    * https://www.sounds-resource.com/nes/smb3/sound/768/

    

## MIT License

    Copyright 2018 Minh-Khang Vu

    Permission is hereby granted, free of charge, to any person obtaining a copy 
    of this software and associated documentation files (the "Software"), to deal 
    in the Software without restriction, including without limitation the rights 
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
    of the Software, and to permit persons to whom the Software is furnished to do 
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all 
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS 
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
