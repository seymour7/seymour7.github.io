/**
    A class to represent the missile object on the screen
    @author seymour
    @class
*/
function Missile()
{
    /**
        Called when the object is created
    */
    this.create = function()
    {
        /** The angle of the missile in radians
            @type Number
         */
        this.angle = player.angle;
        /** The speed of the missile
            @type Number
         */
        this.speed = 10;
        /** The players speed of changing angle of aim in radians per frame
            @type Number
         */
        this.shootPower = player.shootPower/2;
        this.deltaTime = 0;
    }

    /**
        Called only once when a key is pressed
        @param keyCode The code of the key pressed
    */
    this.keyPress = function(/**Number*/ keyCode)
    {
    }

    /**
        Called when a key is released
        @param keyCode The code of the key released
    */
    this.keyRelease = function(/**Number*/ keyCode)
    {
    }

    /**
        Keyboard event for the object
        @param dt The time since the last frame in seconds
    */
    this.keyboard = function (/**Number*/ dt)
    {
    }
    
    /**
        Called when a sprite animation has ended
    */
    this.animationEnd = function ()
    {
    }

    /**
        Step event of the object
        @param dt The time since the last frame in seconds
    */
    this.step = function (/**Number*/ dt)
    {
        this.deltaTime += dt;
        
        this.x += this.shootPower/10 * Math.cos(this.angle);
        this.y -= this.shootPower/10 * Math.sin(this.angle) + (-5) * this.deltaTime;
    }
    
    /**
        Draw event of the object
    */
    this.draw = function()
    {
        this.drawSpriteExt(this.spriteIndex, 0, this.x, this.y, Math.atan2(this.shootPower/10 * Math.sin(this.angle) + (-5) * this.deltaTime, this.shootPower/10 * Math.cos(this.angle)));
    }
}

Missile.prototype = new GameObject;