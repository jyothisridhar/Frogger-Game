var rightEdge = 505;
var bottomEdge = 404;
var tileWidth = 101;
var tileHeight = 83;

var hasReachedWater = false;

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    //X and Y co-ordinates of the enemy and the speed of each enemy entity
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * 250 + 1);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < rightEdge) {
        this.x += dt * this.speed;
    }
    else {
        this.x = 0;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    //X, Y co-rdinates of the player
    this.x = 202;
    this.y = 404;
    //score of a player
    this.score = 0;
    //number of lives a player has
    this.lives = 3;
    this.sprite = 'images/char-cat-girl.png';
};

//Re position the player once he reaches the water.
var resetPlayer = function() {
    player.x = 202;
    player.y = 404;
};

//Draw the player on the canvas.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Update player movements, track score and collisions
Player.prototype.update = function() {
    this.drawText();
    this.increaseScore();
    this.enemyCollision();

    if(player.score > 20 && player.y === 0) {
        $('#game-won').show();
        $('.won').click(function() {
            $('#game-won').hide();
            document.location.reload();
        });
    }
};

//Draw the score and the number of 
//lives of a player on the canvas
Player.prototype.drawText = function() {
    ctx.clearRect(0, 0, 120, 20);
    ctx.clearRect(400, 0, 100, 20);
    ctx.font = "20px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + this.score, 8, 20);
    ctx.fillText("Lives: " + this.lives, 400, 20);
};

//Calculate score of the player
Player.prototype.increaseScore = function() {
    if(hasReachedWater) {
        this.score++;
        setTimeout(resetPlayer, 500);
        hasReachedWater = false;
    }
};

//Player and enemy collision detection.
Player.prototype.enemyCollision = function() {
    var bug = checkCollisions(allEnemies);
    //if collision detected, reduce a player life.
    //Game over if all lives lost.
    if(bug) {
        if(this.lives !== 0) {
            this.lives--;
            resetPlayer();
        }
        else {
            $('#game-over').show();
            $('.lost').click(function() {
                $('#game-over').hide();
                document.location.reload();
            });
        }
    }
};

//Method for Collision detection between entities
//Used the axis-aligned collision detection logic
var checkCollisions = function(targetArray) {
    for(var i = 0; i < targetArray.length; i++) {
        if(player.x < targetArray[i].x + 50 &&
            player.x + 50 > targetArray[i].x &&
            player.y < targetArray[i].y + 40 &&
            player.y + 40 > targetArray[i].y) {
                return targetArray[i];
        }
    }
};

//Update player movements based on keyboard inputs
//Player can move up, down, left and right and
//limit movement within the canvas
Player.prototype.handleInput = function(key){
    switch(key) {
        case 'left':
        if(this.x - tileWidth < 0){
            this.x = 0;
        }
        else {
            this.x -= tileWidth;
        }
        break;

        case 'right':
        if(this.x + tileWidth >= rightEdge){
            this.x = 404;
        }
        else {
            this.x += tileWidth;
        }
        break;

        case 'up':
        if(this.y - tileHeight < 0){
            this.y = 0;
            hasReachedWater = true;
        }
        else {
            this.y -= tileHeight;
        }
        break;

        case 'down':
        if(this.y + tileHeight >= bottomEdge){
            this.y = 404;
        }
        else {
            this.y += tileHeight;
        }
        break;
    }
};

//Star - objects that player should collect to win.
var Star = function(){ 
    this.sprite = 'images/Star.png';
    this.x = (Math.floor(Math.random() * (5 - 1)) + 1) * 101;
    this.y = (Math.floor(Math.random() * (4 - 1)) + 1) * 83;
};

//Draw the star sprite on the screen
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Update stars when collected by player
Star.prototype.update = function() {
    this.starCollision();
};

//Check for Collision between star and player.
Star.prototype.starCollision = function() {
    var target = checkCollisions(allStars);
    var index = allStars.indexOf(target);

    if(index > -1) {
        allStars.splice(index, 1);
        player.score += 5;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [ new Enemy(0, 60), new Enemy(101, 150), new Enemy(202, 235), new Enemy(0, 321)];
for(var i = 0; i < 3; i++){
    var enemyX = (Math.floor(Math.random() * (6 - 1)) + 1) * 101;
    var enemyY = (Math.floor(Math.random() * (5 - 1)) + 1) * 83;
    var enemy = new Enemy(enemyX, enemyY);
    allEnemies.push(enemy);
}

// Place the player object in a variable called player
var player = new Player();

//Instantiate Star objects and stored in an array.
var allStars = [];
for(var i = 0; i < 4; i++){
    var star = new Star();
    allStars.push(star);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
