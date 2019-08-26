export default class Animator {

    constructor(sheet, animList) {

        this.spritesheet = new Image();
        this.spritesheet.src = sheet;

        this.animationList = animList;
        this.currentAnim = 0;

        this.lastTime = 0;
        this.count = 0;

        this.currentFrame = 0;

    }

    animate(ct, ctx, posX, posY) {

        // Draws the current frame of the current animation using the properties from the animation list, cutting the spritesheet image accordingly
        ctx.drawImage(this.spritesheet,
            this.animationList[this.currentAnim][0] + this.animationList[this.currentAnim][2] * this.currentFrame,
            this.animationList[this.currentAnim][1],

            this.animationList[this.currentAnim][2],
            this.animationList[this.currentAnim][3],

            posX, posY,
            this.animationList[this.currentAnim][2], this.animationList[this.currentAnim][3]);

        this.updateFrame(ct);
    }

    updateFrame(ct) {  						// gets the current time from the game loop

        if (!ct) return;							// if there's none, return

        ct = ct / 1000;							// divides by 1000 to get seconds

        let deltaTime = ct - this.lastTime;		// Calculates time passed
        this.lastTime = ct;

        this.count += deltaTime;				// Sums time counter

        // Checks if enough time has passed
        if (this.count >= this.animationList[this.currentAnim][4]) {

            this.count = 0;		// sets counter back to 0

            this.currentFrame = (this.currentFrame === this.animationList[this.currentAnim][5] - 1) ? 0 : this.currentFrame + 1;		// Adds+1 to current frame, if it is on the last frame, sets back to first
        }
    }

    setAnimation(x) {
        this.currentAnim = x;
    }


}