/**
    The base class for all elements that appear in the game.
    @author seymour
    @class
*/
function GameObject()
{
    /** Display depth order. A smaller zOrder means the element is rendered first, and therefore
        in the background.
        @type Number
    */
    this.depth = 0;
    /**
        The position on the X axis
        @type Number
    */
    this.x = 0;
    /**
        The position on the Y axis
        @type Number
    */
    this.y = 0;
    /**
        The index of the current sprite for the instance
        @type Image
    */
    this.spriteIndex = null;
    /**
        The visibility of this object
        @type Bool
    */
    this.visible = true;
    /**
        Defines the current submimage that is to be rendered
        @type Number
     */
    this.imageIndex = 0;
    /**
        The speed with which we cycle through the subimages
        @type Number
     */
    this.imageSpeed = 1;
    /**
        An array for all the keyboard events
        @type Array
     */
    this.keyboard = new Array();

    /**
        Initialises the object, and adds it to the list of objects held by the GameObjectManager.
        @param x        The position on the X axis
        @param y        The position on the Y axis
        @param z        The z order of the element (elements in the background have a lower z value)
    */
    this.startupGameObject = function(/**Sprite*/ spriteIndex, /**Number*/ x, /**Number*/ y, /**Number*/ depth)
    {
        g_GameObjectManager.addGameObject(this);
        this.spriteIndex = spriteIndex;
        this.x = x;
        this.y = y;
        this.depth = depth;
        
        this.create();

        return this;
    }
    
    /**
        Cleans up the object, and removes it from the list of objects held by the GameObjectManager.
    */
    this.shutdownGameObject = function()
    {
        g_GameObjectManager.removeGameObject(this);
        this.image = null;
    }
    
    /**
        Updates this object
        @param dt Time in seconds since the last frame
    */
    this.update = function(/**Number*/ dt)
    {
        this.imageIndex += this.imageSpeed * (dt/SECONDS_BETWEEN_FRAMES);

        //check if an animation ended function exists in the obj and execute it
        if ((this.imageIndex >= g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber']) && (g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber'] > 0) && (this.imageSpeed != 0))
        {
            if (this.animationEnd)
            {
                this.animationEnd();
            }
        }

        // this should go after the animation ended check
        this.imageIndex %= g_SpriteManager.gameSprites[this.spriteIndex]['imageNumber'];
    }
    
    /**
        Draws this element to the back buffer
        @param dt Time in seconds since the last frame
    */
    this.draw = function()
    {
        this.drawSprite(this.spriteIndex, this.imageIndex, this.x, this.y);
    }
    
    /**
        Draws a sprite
        @param sprite The sprite to be drawn
        @param subImg The subimage of the sprite
        @param x The x position of the sprite
        @param y The y position of the sprite
    */
    this.drawSprite = function(/**Sprite*/ sprite, /**Number*/ subImg, /**Number*/ x, /**Number*/ y)
    {
        var sourceX = g_SpriteManager.gameSprites[sprite]['imageWidth'] * Math.floor(subImg);
        g_context2D.drawImage(g_SpriteManager.gameSprites[sprite]['sprite'], sourceX, 0, g_SpriteManager.gameSprites[sprite]['imageWidth'], g_SpriteManager.gameSprites[sprite]['sprite'].height, x - g_SpriteManager.gameSprites[sprite]['origin']['x']/* - xScroll*/, y -  + g_SpriteManager.gameSprites[sprite]['origin']['y']/*- yScroll*/, g_SpriteManager.gameSprites[sprite]['imageWidth'], g_SpriteManager.gameSprites[sprite]['sprite'].height);
    }
    
    /**
        Draws a sprite with extended parameters!
        @param sprite The sprite to be drawn
        @param subImg The subimage of the sprite
        @param x The x position of the sprite
        @param y The y position of the sprite
        @param rot The anti-clockwise angle of rotation in radians
    */
    this.drawSpriteExt = function(/**Sprite*/ sprite, /**Number*/ subImg, /**Number*/ x, /**Number*/ y, /**Number*/ rot)
    {
        var sourceX = g_SpriteManager.gameSprites[sprite]['imageWidth'] * Math.floor(subImg);
        g_context2D.save();
        g_context2D.translate(x, y);
        g_context2D.rotate(-rot);
        g_context2D.drawImage(g_SpriteManager.gameSprites[sprite]['sprite'], sourceX, 0, g_SpriteManager.gameSprites[sprite]['imageWidth'], g_SpriteManager.gameSprites[sprite]['sprite'].height, 0-g_SpriteManager.gameSprites[sprite]['origin']['x']/* - xScroll*/, 0-g_SpriteManager.gameSprites[sprite]['origin']['y']/* - yScroll*/, g_SpriteManager.gameSprites[sprite]['imageWidth'], g_SpriteManager.gameSprites[sprite]['sprite'].height);
        g_context2D.restore();
    }

    this.collisionArea = function()
    {
        return new Rectangle().startupRectangle(this.x, this.y, this.frameWidth, this.image.height);
    }
    
    /**
        Returns whether the key with the particular keycode is currently down
        @param key The keycode of the key to check
    */
    this.keyboardCheck = function(/**Number*/ key)
    {
        if (g_GameObjectManager.keyDown[key] == true)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}