/**
    A manager for all the rooms in the game
    @author seymour
    @class
*/
function RoomManager()
{
    /** An array of game objects 
        @type Array
    */
    this.rooms = new Array();

    /**
        Initialises this object
        @return A reference to the initialised object
    */
    this.startupRoomManager = function()
    {
        // set the global pointer to reference this object
        g_RoomManager = this; alert('HI');

        r_Start.startupRoom();
        
        return this;
    }
    
    /**
        The render loop
    */
   /* this.draw = function ()
    {
        // calculate the time since the last frame
        var thisFrame = new Date().getTime();
        var dt = (thisFrame - this.lastFrame)/1000;
        this.lastFrame = thisFrame;

        if (g_SpriteManager.spritesLoaded)
        {
            // clear the drawing contexts
            g_backBufferContext2D.clearRect(0, 0, g_backBuffer.width, g_backBuffer.height);
            g_context2D.clearRect(0, 0, g_canvas.width, g_canvas.height);
            
            // first run the keyboard event of all the game objects
            for (x in this.gameObjects)
            {
                if (this.gameObjects[x].keyboard)
                {
                    this.gameObjects[x].keyboard(dt);
                }
            }
        
            // first run the step event of all the game objects
            for (x in this.gameObjects)
            {
                if (this.gameObjects[x].step)
                {
                    this.gameObjects[x].step(dt);
                }
            }

            // then draw the game objects
            for (x in this.gameObjects)
            {
                if (this.gameObjects[x].draw)
                {
                    // only execute the draw event if the object is visible
                    if (this.gameObjects[x].visible)
                    {
                        this.gameObjects[x].draw();
                    }
                }
            }
            
            // then update the game objects
            for (x in this.gameObjects)
            {
                if (this.gameObjects[x].update)
                {
                    this.gameObjects[x].update(dt);
                }
            }

            // copy the back buffer to the displayed canvas
            g_context2D.drawImage(g_backBuffer, 0, 0);
        }
        //var text = "";
        //for(var i in this.keyDown){
        // text = text + "<b>keyDown["+i+"] is </b>=>"+this.keyDown[i]+"<br>";
        //}
        //document.getElementById('debug').innerHTML = text;
    };*/
    
    /**
        Adds a new Room to the rooms collection
        @param room The room to add
    */
    this.addRoom = function(room)
    {
        this.rooms.push(room);
        //this.rooms.sort(function(a,b){return a.depth - b.depth;})
    };
    
    /**
        Removes a GameObject from the gameObjects collection
        @param gameObject The object to remove
    */
    /*this.removeGameObject = function(gameObject)
    {
        this.gameObjects.removeObject(gameObject);
    }*/

    /*this.keyDown = function(event)
    {
        if (!this.keyDown[event.keyCode])
        {
            // inside the if to suppress the keydown auto repeat
            for (x in this.gameObjects)
            {
                if (this.gameObjects[x].keyPress)
                {
                    this.gameObjects[x].keyPress(event.keyCode);
                }
            }
            
            this.keyDown[event.keyCode] = true;
        }
        

    }

    this.keyUp = function(event)
    {
        if (this.keyDown[event.keyCode])
        {
            this.keyDown[event.keyCode] = false;
        }
        
        for (x in this.gameObjects)
        {
            if (this.gameObjects[x].keyRelease)
            {
                this.gameObjects[x].keyRelease(event.keyCode);
            }
        }
    }*/
}