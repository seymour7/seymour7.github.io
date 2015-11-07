/**
    A class to represent the player object on the screen
    @author seymour
    @class
*/
function Player()
{
    /**
        Called when the object is created
    */
    this.create = function()
    {
        /** The players walking speed
            @type Number
         */
        this.speed = 40;
        /** The players angle of aim in radians
            @type Number
         */
        this.angle = 0;
        /** The players speed of changing angle of aim in radians per frame
            @type Number
         */
        this.aimSpeed = Math.PI;
        /** The distance of the crosshair from the player
            @type Number
         */
        this.crosshairDist = 70;
        /** The shoot power the player has
            @type Number
         */
        this.shootPower = 0;
    }

    /**
        Called only once when a key is pressed
        @param keyCode The code of the key pressed
    */
    this.keyPress = function(/**Number*/ keyCode)
    {
        // left
        if (keyCode == 37)
        {
            this.spriteIndex = 'walkLeft';
            if (this.imageSpeed != 1)
                this.imageSpeed = 1;
            this.imageIndex = 0;
        }
        // right
        if (keyCode == 39)
        {
            this.spriteIndex = 'walkRight';
            if (this.imageSpeed != 1)
                this.imageSpeed = 1;
            this.imageIndex = 0;
        }
    }

    /**
        Called when a key is released
        @param keyCode The code of the key released
    */
    this.keyRelease = function(/**Number*/ keyCode)
    {
        // left
        if (keyCode == 37)
        {
            // if right key isn't down
            if (!this.keyboardCheck(39))
            {
                this.spriteIndex = 'bazInLeft';
            }
            else
            {
                this.spriteIndex = 'walkRight';
            }
            this.imageIndex = 0;

            if (this.angle <= Math.PI/2) {  // 1st quad
                this.angle = Math.PI - this.angle;
            }
            if (this.angle >= (3/2)*Math.PI) {  // 4th quad
                this.angle = Math.PI + 2*Math.PI - this.angle;
            }
        }
        // right
        if (keyCode == 39)
        {
            // if left key isn't down
            if (!this.keyboardCheck(37))
            {
                this.spriteIndex = 'bazInRight';
            }
            else
            {
                this.spriteIndex = 'walkLeft';
            }
            this.imageIndex = 0;

            if ((this.angle >= Math.PI/2) && (this.angle <= Math.PI)) {  // 2nd quad
                this.angle = Math.PI - this.angle;
            }
            if ((this.angle >= Math.PI) && (this.angle <= (3/2)*Math.PI)) {  // 3rd quad
                this.angle = Math.PI + 2*Math.PI - this.angle;
            }
        }
        // space bar
        if (keyCode == 32)
        {
            if ((this.shootPower > 0) && (this.spriteIndex == 'baz'))
            {
                new Missile().startupGameObject('missile', this.x, this.y, 3);
                this.shootPower = 0;
            }
            else
            {
                this.shootPower = 0;
            }
        }
    }

    /**
        Keyboard event for the object
        @param dt The time since the last frame in seconds
    */
    this.keyboard = function (/**Number*/ dt)
    {
        // left
        if (this.keyboardCheck(37))
        {
            this.x -= this.speed * dt;
        }
        // right
        if (this.keyboardCheck(39))
        {
            this.x += this.speed * dt;
        }
        // up
        if (this.keyboardCheck(38))
        {
            if (this.spriteIndex == 'baz')
            {
                this.angle += this.aimSpeed * dt;
                this.angle %= 2*Math.PI;
                this.imageIndex = Math.floor((this.angle/(2*Math.PI))*g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber']);
                this.imageIndex %= 63;
            }
        }
        document.getElementById('debug').innerHTML = this.angle + "   " + Math.floor((this.angle/(2*Math.PI))*g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber']);
        //console.clear();
        //console.log(this.angle);
        // down
        if (this.keyboardCheck(40))
        {
            if (this.spriteIndex == 'baz')
            {
                this.angle -= this.aimSpeed * dt;
                if (this.angle < 0) {
                    this.angle = 2*Math.PI - this.aimSpeed * dt;
                }
                this.imageIndex = Math.floor((this.angle/(2*Math.PI))*g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber']);
                this.imageIndex %= 63;
            }
        }
        // space bar
        if (this.keyboardCheck(32))
        {
            if (this.shootPower < 100)
                this.shootPower += 0.5;
        }
    }
    
    /**
        Called when a sprite animation has ended
    */
    this.animationEnd = function ()
    {
        if ((this.spriteIndex == 'bazInLeft') || (this.spriteIndex == 'bazInRight'))
        {
            this.spriteIndex = 'baz';
            this.imageSpeed = 0;
            this.imageIndex = Math.round((this.angle/(2*Math.PI))*g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber']);
        }
    }

    /**
        Step event of the object
        @param dt The time since the last frame in seconds
    */
    this.step = function (/**Number*/ dt)
    {

    }
    
    /**
        Draw event of the object
    */
    this.draw = function()
    {
        if ((this.shootPower > 0) && (this.spriteIndex == 'baz'))
        {
            // draw the shoot power bar
            this.drawSpriteExt('shootPower', this.shootPower/100*20, this.x, this.y, this.angle);
        } 
        
        //draw the player
        this.drawSprite(this.spriteIndex, this.imageIndex, this.x, this.y);

        if (this.spriteIndex == 'baz')
        {
            // draw the crosshair
            this.drawSpriteExt('crosshair', 0, this.x + this.crosshairDist*Math.cos(-1*this.angle), this.y + this.crosshairDist*Math.sin(-1*this.angle), this.angle);
        }
    }
}

Player.prototype = new GameObject;