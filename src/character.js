import Collider from '/src/collider.js';
import Animator from '/src/animator.js';

var Gravity = 0.5;
var Friction = -0.15;

const idle_r = 0;
const idle_l = 1;
const run_r = 2;
const run_l = 3;

export default class Character {

    constructor(posX, posY, el, mapOffset) {

        this.width = 24;
        this.height = 34;

        this.mapOffset = mapOffset;

        this.pos = {        		// Character position
            x: posX,
            y: posY
        };

        this.centerPos = {                // Character center point position
            x: posX + this.width / 2,
            y: posY + this.height / 2
        };

        this.previousPos = {        // Character previous position, used for checking
            x: posX,				// from which side the character collided
            y: posY					// with the walls
        };

        this.acc = {                // Character acceleration
            x: 0,
            y: 0
        };
        this.vel = {                // Character velocity
            x: 0,
            y: 0
        };

        // On the animation list, each index is an array containing the animation properties and spritesheet coordinates:
        // [ sprite_X, sprite_Y, sprite_width, sprite_height, animation_delay (in seconds), number of frames ]

        /*                                               // Animation list /////////////*/
        this.animationList = [[0, 0, 24, 34, 0.2, 4],       // 0 - idle right
            [0, 34, 24, 34, 0.2, 4],      // 1 - idle left
            [0, 68, 24, 34, 0.15, 4],     // 2 - Run right
            [0, 102, 24, 34, 0.15, 4]];   // 3 - Run left


        this.element = el;          // Character element, 1 for fire, 2 for water
        switch (this.element) {
            case 1:
                this.color = "#e6350e";
                this.animator = new Animator("/img/Lavaboy sheet.png", this.animationList);
                break;
            case 2:
                this.color = "#22bce3";
                this.animator = new Animator("/img/Aquagirl sheet.png", this.animationList);
                break;
        }

        this.collider = new Collider(this, mapOffset); // Creates the collision handler


        this.jumping = false;
        this.movingLeft = false;
        this.movingRight = false;

        this.score = 0;

    }

    // function for updating character's data
    update(dt) {

        if (!dt) return;

        // Sets previous positions
        this.previousPos.x = this.pos.x;
        this.previousPos.y = this.pos.y;

        // Checks if booleans of movement are active, and move character accordingly
        if (this.movingRight) this.acc.x = 0.8;
        if (this.movingLeft) this.acc.x = -0.8;
        if (!this.movingRight && !this.movingLeft) this.acc.x = 0;

        // Applies external forces to character movement
        this.acc.y = Gravity;
        this.acc.x += this.vel.x * Friction;

        // Makes the acceleration and velocity calculations
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        // Updates position
        this.pos.x += this.vel.x / dt * 10;
        this.pos.y += this.vel.y / dt * 10;

        // Updates center position
        this.centerPos.x = this.pos.x + this.width / 2;
        this.centerPos.y = this.pos.y + this.height / 2;


    }


    // Function for drawing the character on screen, calls animation function passing the current time //////
    draw(ctx, ct) {

        this.animator.animate(ct, ctx, this.pos.x, this.pos.y);

    }


    // Function for jumping //////////////////////////
    jump() {

        if (!this.jumping) {
            this.jumping = true;
            this.vel.y = -12;
        }
    }

    collectCoin() {
        this.score++;
        console.log("Score: " + this.score);
    }


    // Movement functions //////////////////////
    moveRight() {

        this.animator.setAnimation(run_r);

        this.movingRight = true;
        this.movingLeft = false;
    }

    moveLeft() {

        this.animator.setAnimation(run_l);

        this.movingLeft = true;
        this.movingRight = false;
    }

    stop() {

        this.animator.setAnimation((this.movingRight) ? idle_r : idle_l);

        this.movingLeft = false;
        this.movingRight = false;
    }

    getCollider() {
        return this.collider;
    }


    // Get side positions ///////////////
    getTop() {
        return this.pos.y - this.mapOffset.y;
    }

    getBottom() {
        return this.pos.y + this.height - this.mapOffset.y;
    }

    getLeft() {
        return this.pos.x - this.mapOffset.x;
    }

    getRight() {
        return this.pos.x + this.width - this.mapOffset.x;
    }

    getCenterPos() {
        let cp = {
            x: this.centerPos.x - this.mapOffset.x,
            y: this.centerPos.y - this.mapOffset.y
        };
        return cp;
    }


    // Get previous side positions //////////////////
    getPreviousTop() {
        return this.previousPos.y - this.mapOffset.y;
    }

    getPreviousBottom() {
        return this.previousPos.y + this.height - this.mapOffset.y;
    }

    getPreviousLeft() {
        return this.previousPos.x - this.mapOffset.x;
    }

    getPreviousRight() {
        return this.previousPos.x + this.width - this.mapOffset.x;
    }


    // Set positions through sides /////////////////
    setTop(newY) {
        this.pos.y = newY + this.mapOffset.y;
    }

    setBottom(newY) {
        this.pos.y = newY - this.height + this.mapOffset.y;
    }

    setLeft(newX) {
        this.pos.x = newX + this.mapOffset.x;
    }

    setRight(newX) {
        this.pos.x = newX - this.width + this.mapOffset.x;
    }


    // Functions for making the character move accordingly with the collision ///////////////////////////
    collidePlatformBottom(tile_bottom) {

        // Checks if character is intersecting with the bottom side of the wall
        if (this.getTop() < tile_bottom && this.getPreviousTop() >= tile_bottom) {

            this.setTop(tile_bottom);	// Move the top of the character to the bottom of the wall.
            this.vel.y = 0;     		// Stop moving in that direction.
            this.acc.y = 0;
            return true;               	// Return true because there was a collision.

        }
        return false;              	// Return false if there was no collision.

    }

    collidePlatformLeft(tile_left, tile_top) {

        // Checks if character is intersecting with the left side of the wall
        if (this.getRight() > tile_left && this.getPreviousRight() <= tile_left) {

            if (this.getBottom() > tile_top) {

                this.setRight(tile_left - 0.01);	// -0.01 is to fix a small problem
                this.vel.x = 0;
                this.acc.x = 0;
                return true;
            }

        }
        return false;

    }

    collidePlatformRight(tile_right, tile_top) {

        // Checks if character is intersecting with the right side of the wall
        if (this.getLeft() < tile_right && this.getPreviousLeft() >= tile_right) {

            if (this.getBottom() > tile_top) {

                this.setLeft(tile_right);
                this.vel.x = 0;
                this.acc.x = 0;
                return true;
            }
        }
        return false;

    }

    collidePlatformTop(tile_top) {

        // Checks if character is intersecting with the upper side of the wall
        if (this.getBottom() > tile_top && this.getPreviousBottom() <= tile_top) {

            this.setBottom(tile_top - 0.01);
            this.vel.y = 0;
            this.acc.y = 0;
            this.jumping = false;
            return true;

        }
        return false;

    }

    // Function for making the character interact accordingly with the liquid type /////
    collideLiquid(tile_top, liquidType) {                                                       // Liquide types: 1. Lava || 2. Water

        // Checks if character is intersecting with the liquid (from above)
        if (this.getBottom() > tile_top + 5 && this.getPreviousBottom() <= tile_top + 5) {

            if (liquidType != this.element) {
                window.location.reload(true);
            }
            return true;

        }
        return false;

    }

    // Function for checking the collision with the coins, using the center point ////////////////
    collideCoin(element, coin_top, coin_bottom, coin_left, coin_right) {

        if (element == this.element) {

            if (this.getCenterPos().y < coin_bottom && this.getCenterPos().y > coin_top) {

                if (this.getCenterPos().x < coin_right && this.getCenterPos().x > coin_left) {

                    this.collectCoin();
                    return true;

                }
                return false;


            }
            return false;

        }
    }

}
