import Character from '/src/character.js';
import InputHandler from '/src/input handler.js';

// MAIN CODE ////////////////////

// Getting canvas and context from html file
let canvas = document.getElementById("Screen");
let ctx = canvas.getContext("2d");


let collision_map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],        // COLLISION MAP /////////
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],        // 0 - nothing
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],        // 1 - full size tile (block)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1],        // 2 - half height tile (platform)
    [1, 1, 0, 0, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1],        // 3 - platform with lava
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],        // 4 - platform with water
    [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 4, 4, 4, 1, 0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

let graphical_map = [[99, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 99],        // COLLISION MAP ////////////////////////////////////////
    [92, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 93],        // 90 - nothing                   10,11,12 - platforms
    [92, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 12, 99],        // 91 - block facing down
    [92, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 12, 12, 99, 99],        // 92 - block facing right
    [99, 96, 90, 90, 12, 12, 12, 12, 12, 94, 94, 12, 12, 12, 12, 12, 91, 91, 91, 99],        // 93 - block facing left
    [99, 99, 96, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 93],        // 94 - block facing up
    [99, 91, 91, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 90, 90, 93],        // 95 - block facing upLeft
    [92, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 93],        // 96 - block facing upRight
    [92, 90, 90, 99, 10, 10, 10, 99, 90, 90, 90, 90, 99, 11, 11, 11, 99, 90, 95, 99],        // 97 - block facing downRight
    [92, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 93, 99],        // 98 - block facing downLeft
    [99, 94, 94, 94, 11, 11, 11, 94, 94, 94, 94, 94, 94, 10, 10, 10, 94, 94, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99]];       // 99 - inner block

let coin_map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],        // COIN MAP /////////
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],        // 0 - nothing
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],        // 1 - Fire coin
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],        // 2 - Water coin
    [0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

var tile_size = 40;     // Each index on the map represents a square with a side of tile_size px
var coin_size = 16;


canvas.width = collision_map[0].length * tile_size;
canvas.height = collision_map.length * tile_size;

// Canvas dimensions
const GAME_W = canvas.width;
const GAME_H = canvas.height;


// Game maps offset
const mapOffset = {
    x: (GAME_W / 2) - ((collision_map[0].length * tile_size) / 2),    // This offset is used to make the map always centered on canvas
    y: (GAME_H / 2) - ((collision_map.length * tile_size) / 2)
};


// Instantiates the 2 characters
let lavaBoy = new Character(1 * tile_size + mapOffset.x, 9 * tile_size + mapOffset.y, 1, mapOffset);
let aquaGirl = new Character(2 * tile_size + mapOffset.x, 9 * tile_size + mapOffset.y, 2, mapOffset);

// Creates the controller
let IH = new InputHandler(lavaBoy, aquaGirl);

var tileSheet = new Image();
tileSheet.src = "/img/tiles 2.png";


// Sets Game loop /////////////////////////
let lastTime = 0;

function loop(currentTime) {               // Function called passing the current time
    let deltaTime = currentTime - lastTime;  // deltaTime (time passed) is calculated
    lastTime = currentTime;                // lastTime is updated

    // Clears screen, before updating it
    ctx.clearRect(0, 0, GAME_W, GAME_H);
    ctx.fillStyle = "#36302c";
    ctx.fillRect(0 + mapOffset.x, 0 + mapOffset.y, collision_map[0].length * tile_size, collision_map.length * tile_size);

    // Updates all characters
    lavaBoy.update(deltaTime);
    aquaGirl.update(deltaTime);

    // Gets collision points of all the colliders and checks for collisions, then updates the coin map
    lavaBoy.getCollider().getCollisionPoints(collision_map, coin_map, tile_size, coin_size);
    coin_map = lavaBoy.getCollider().updateCoinMap();
    aquaGirl.getCollider().getCollisionPoints(collision_map, coin_map, tile_size, coin_size);
    coin_map = aquaGirl.getCollider().updateCoinMap();

    // Draws the map
    drawMap(collision_map);
    drawGMap(graphical_map);

    // Draws the characters
    lavaBoy.draw(ctx, currentTime);
    aquaGirl.draw(ctx, currentTime);

    // Draws the coins
    drawCoins(coin_map);

    // JS function that calls a function, passing the currentTime
    requestAnimationFrame(loop);
}

// Function for drawing the coins
function drawCoins(map) {

    for (var i = 0; i < coin_map.length; i++) {
        for (var j = 0; j < coin_map[i].length; j++) {

            let yOffset = 0;

            if (coin_map[i][j] != 0 && collision_map[i + 1][j] > 1) {      // A y offset is added if the coin is on top of a half sized tile (platform)
                yOffset = tile_size / 2;
            }

            switch (coin_map[i][j]) {

                case 1:
                    ctx.fillStyle = "#e6350e";
                    ctx.fillRect((j * tile_size + tile_size / 2 - coin_size / 2) + mapOffset.x, (i * tile_size + tile_size / 2 - coin_size / 2) + yOffset + mapOffset.y, coin_size, coin_size);
                    break;

                case 2:
                    ctx.fillStyle = "#22bce3";
                    ctx.fillRect((j * tile_size + tile_size / 2 - coin_size / 2) + mapOffset.x, (i * tile_size + tile_size / 2 - coin_size / 2) + yOffset + mapOffset.y, coin_size, coin_size);
                    break;

            }

        }

    }

}

// Function for drawing collisions (and liquids), using the collision map ////////////////////////
function drawMap(map) {

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            switch (map[i][j]) {

                /*case 1: 
                ctx.fillStyle = "#000000" ;                                 
                ctx.fillRect(j*tile_size+mapOffset.x, i*tile_size+mapOffset.y, tile_size,tile_size);
                break;

                case 2: 
                ctx.fillStyle = "#000000" ;                                
                ctx.fillRect(j*tile_size+mapOffset.x, i*tile_size+(tile_size/2)+mapOffset.y, tile_size,tile_size/2);
                break;*/

                case 3:
                    ctx.fillStyle = "#e6350e";
                    ctx.fillRect(j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size / 2 + 10);
                    ctx.fillStyle = "#000000";
                    //ctx.fillRect(j*tile_size+mapOffset.x, i*tile_size+(tile_size/2)+mapOffset.y, tile_size,tile_size/2);
                    break;

                case 4:
                    ctx.fillStyle = "#22bce3";
                    ctx.fillRect(j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size / 2 + 10);
                    ctx.fillStyle = "#000000";
                    //ctx.fillRect(j*tile_size+mapOffset.x, i*tile_size+(tile_size/2)+mapOffset.y, tile_size,tile_size/2);
                    break;
            }
        }
    }


    // SHOWS GRIDLINES ///////////////////////////
    /*
    for (var i = 0; i<map.length; i++){             

        ctx.fillStyle = "#ababab" ;                
        ctx.fillRect(0+mapOffset.x, i*tile_size+mapOffset.y, 1280, 1);  
    }

    for (var j = 0; j<map[0].length; j++){
             
        ctx.fillRect(j*tile_size+mapOffset.x,0+mapOffset.y,1,720);
            
    }*/

}


// Function for drawing the tiles, using the graphical map
function drawGMap(map) {

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            switch (map[i][j]) {

                case 91:
                    ctx.drawImage(tileSheet, 40, 80, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 92:
                    ctx.drawImage(tileSheet, 80, 40, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 93:
                    ctx.drawImage(tileSheet, 0, 40, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 94:
                    ctx.drawImage(tileSheet, 40, 0, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 95:
                    ctx.drawImage(tileSheet, 0, 0, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 96:
                    ctx.drawImage(tileSheet, 80, 0, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 97:
                    ctx.drawImage(tileSheet, 80, 80, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 98:
                    ctx.drawImage(tileSheet, 0, 80, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 99:
                    ctx.drawImage(tileSheet, 40, 40, 40, 40, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y, tile_size, tile_size);
                    break;

                case 10:
                    ctx.drawImage(tileSheet, 40, 0, 40, 20, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y + tile_size / 2, tile_size, tile_size / 2);
                    break;
                case 11:
                    ctx.drawImage(tileSheet, 40, 0, 40, 20, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y + tile_size / 2, tile_size, tile_size / 2);
                    break;
                case 12:
                    ctx.drawImage(tileSheet, 40, 0, 40, 20, j * tile_size + mapOffset.x, i * tile_size + mapOffset.y + tile_size / 2, tile_size, tile_size / 2);
                    break;
            }
        }
    }
}

function getCanvasWidth() {

    return collision_map[0].length * tile_size;

}

// Calls game loop
loop();
