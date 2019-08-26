export default class Collider {

    constructor(c, mapOffs) {

        this.char = c;

        this.tile_size;
        this.coin_Map;

        this.mapOffset = {x: 0, y: 0};

        this.mapOffset.x = mapOffs.x;
        this.mapOffset.y = mapOffs.y;

    }

    // Function for getting the 4 collision points (corners) of the character /////////////
    getCollisionPoints(colMap, coinMap, tile_size, coin_size) {

        this.tile_size = tile_size;
        this.coin_Map = coinMap;

        let bottom, left, right, top, value, coinValue, centerCol, centerRow;

        centerCol = Math.floor(this.char.getCenterPos().x / this.tile_size);				// Gets the character center, bottom and top points, using
        bottom = Math.floor(this.char.getBottom() / this.tile_size);						// the top center for getting the coinValue in coinMap and
        top = Math.floor(this.char.getTop() / this.tile_size);							// the bottom center for getting the ground type the character is standing in.
        coinValue = coinMap [top][centerCol];												// The ground type is important for keeping the coin collider lower (in platforms) or higher (in blocks)

        this.checkCoinCollider(coinValue, centerCol * this.tile_size, top * this.tile_size, this.tile_size, coin_size, colMap[bottom][centerCol]);


        top = Math.floor(this.char.getTop() / this.tile_size);				// Gets the top left corner position
        left = Math.floor(this.char.getLeft() / this.tile_size);				// of the character inside the map array
        value = colMap[top][left];												// and uses it to know the value in that index
        coinValue = coinMap [top][left];

        this.checkTileCollider(value, left * this.tile_size, top * this.tile_size, this.tile_size);


        top = Math.floor(this.char.getTop() / this.tile_size);				// Gets top right
        right = Math.floor(this.char.getRight() / this.tile_size);
        value = colMap[top][right];
        coinValue = coinMap [top][right];

        this.checkTileCollider(value, right * this.tile_size, top * this.tile_size, this.tile_size);


        bottom = Math.floor(this.char.getBottom() / this.tile_size);				// Gets bottom left
        left = Math.floor(this.char.getLeft() / this.tile_size);
        value = colMap[bottom][left];
        coinValue = coinMap [bottom][left];

        this.checkTileCollider(value, left * this.tile_size, bottom * this.tile_size, this.tile_size);


        bottom = Math.floor(this.char.getBottom() / this.tile_size);				// Gets bottom right
        right = Math.floor(this.char.getRight() / this.tile_size);
        value = colMap[bottom][right];
        coinValue = coinMap [bottom][right];

        this.checkTileCollider(value, right * this.tile_size, bottom * this.tile_size, this.tile_size);

    }

    // Checks the type of wall collider
    checkTileCollider(value, tileX, tileY) {

        switch (value) {
            case 0:
                break;

            case 1: 																	// Case 1 collider:
                if (this.char.collidePlatformTop(tileY)) return;								// Full sized tile (block)
                if (this.char.collidePlatformLeft(tileX, tileY)) return;
                if (this.char.collidePlatformRight(tileX + this.tile_size, tileY)) return;
                this.char.collidePlatformBottom(tileY + this.tile_size);
                break;

            case 2: 																	// Case 2 collider:
                tileY += this.tile_size / 2;													// A half height tile (platform)

                if (this.char.collidePlatformTop(tileY)) return;
                if (this.char.collidePlatformLeft(tileX, tileY)) return;
                if (this.char.collidePlatformRight(tileX + this.tile_size, tileY)) return;
                this.char.collidePlatformBottom(tileY + this.tile_size / 2);
                break;

            case 3: 																	// Case 3 collider:
                if (this.char.collideLiquid(tileY, 1)) return;								// A platform with lava on top
                tileY += this.tile_size / 2;
                if (this.char.collidePlatformTop(tileY)) return;
                this.char.collidePlatformBottom(tileY + this.tile_size / 2);
                break;

            case 4: 																	// Case 4 collider:
                if (this.char.collideLiquid(tileY, 2)) return;								// A platform with water on top
                tileY += this.tile_size / 2;
                if (this.char.collidePlatformTop(tileY)) return;
                this.char.collidePlatformBottom(tileY + this.tile_size / 2);
                break;
        }

    }

    // Checks the type of coin collider
    checkCoinCollider(coinValue, coinX, coinY, coin_size, groundValue) {

        if (coinValue > 0) {												// Checks if there is a coin (0 = no coins, 1 is fire coins, 2 is water)

            let coinRow = Math.floor(coinY / this.tile_size);
            let coinCol = Math.floor(coinX / this.tile_size);

            coinX += (this.tile_size / 2) - (coin_size / 2);					// Positioning the coin at the middle of the tile
            coinY += (this.tile_size / 2) - (coin_size / 2);

            if (groundValue > 1) {											// Checks the groundValue, which determines whether the coin is above a full sized tile
                coinY += this.tile_size / 2; 									// (block) or a platform. If it is on a platform, the coinY collider is set a little lower
            }

            if (this.char.collideCoin(coinValue, coinY, coinY + coin_size, coinX, coinX + coin_size)) 	// Passes the information of the coin colliders to the character
            {																						// and checks if there was a collision
                this.coin_Map[coinRow][coinCol] = 0;
            }
        }
    }

    updateCoinMap() {
        return this.coin_Map;
    }

}