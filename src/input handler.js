export default class InputHandler {

    constructor(lavaboy, aquagirl) {

        document.addEventListener("keydown", event => {

            switch (event.keyCode) {

                case 87:
                    lavaboy.jump();
                    break;

                case 65:
                    lavaboy.moveLeft();
                    break;
                case 68:
                    lavaboy.moveRight();
                    break;

                case 38:
                    aquagirl.jump();
                    break;

                case 37:
                    aquagirl.moveLeft();
                    break;
                case 39:
                    aquagirl.moveRight();
                    break;

            }


        });


        document.addEventListener("keyup", event => {

            switch (event.keyCode) {

                case 65:
                    if (lavaboy.acc.x < 0) lavaboy.stop();
                    break;
                case 68:
                    if (lavaboy.acc.x > 0) lavaboy.stop();
                    break;

                case 37:
                    if (aquagirl.acc.x < 0) aquagirl.stop();
                    break;
                case 39:
                    if (aquagirl.acc.x > 0) aquagirl.stop();
                    break;

            }


        });

    }

}