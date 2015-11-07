/**
    A database for the external sprites used by the game
    @author seymour
    @class
*/
function SpriteManager()
{
	/** An associative array of the names of the sprites supplied to the startupSpriteManager
		function. This collection allows a developer to access the game sprites and their
		imageNumber.
		@type Array
	*/
    this.gameSprites = new Array();
	/**
		The number of sprites in the application which is only necessary because
		its otherwise too difficult to get the length of an associative array
		@type Number
	 */
	this.spriteNumber = 0;
	/** True if the sprites supplied to the SpritesManager are all loaded, false otherwise
		@type Boolean
	*/
	this.spritesLoaded = false;
	/** The ID for the interval which displays the laoding screen so we can clear it afterwards
		@type ID
	*/
	this.loadScrIntervalId = null;

	/**
        Initialises this object
		@param sprites	An array of objects with the name, src and frame properties
        @return 		A reference to the initialised object
    */
    this.startupSpriteManager = function(/**Array*/ sprites)
    {
        // set the global variable
		g_SpriteManager = this;
		
		// quickly set the sprite number
		this.spriteNumber = sprites.length;

        // for each sprite, call preload()
        for ( var i = 0; i < sprites.length; i++ )
		{
			// create new Image object and add to array
			this.gameSprites[sprites[i].name] = new Array();
			this.gameSprites[sprites[i].name]["sprite"] = new Image;
			this.gameSprites[sprites[i].name]["imageNumber"] = sprites[i].imageNumber;
			
			// add the origin values for the sprite
			this.gameSprites[sprites[i].name]["origin"] = new Array();
			if (sprites[i].origin)
			{
				this.gameSprites[sprites[i].name]["origin"]['x'] = sprites[i].origin.x;
				this.gameSprites[sprites[i].name]["origin"]['y'] = sprites[i].origin.y;
			}
			else
			{
				this.gameSprites[sprites[i].name]["origin"]['x'] = 0;
				this.gameSprites[sprites[i].name]["origin"]['y'] = 0;
			}

			// assign the .src property of the Image object so they start loading
			this.gameSprites[sprites[i].name]["sprite"].src = sprites[i].src;
		}
		
		// display show the loading screen while the sprites load
		this.loadScrIntervalId = setInterval(function(){g_SpriteManager.displayLoadingScreen();}, SECONDS_BETWEEN_FRAMES);
		
        return this;
    }
	
	this.displayLoadingScreen = function()
	{
		if (!this.spritesLoaded)
		{
			var numLoaded = 0;
			for ( var i in this.gameSprites )
			{
				if (this.gameSprites[i]["sprite"].complete)
					numLoaded++;
			}

			if ( numLoaded == this.spriteNumber )
			{
				this.spritesLoaded = true;
				
				// add some extra variables to the gameSprites array
				for ( var i in this.gameSprites )
				{
					this.gameSprites[i]['imageWidth'] = this.gameSprites[i]['sprite'].width / this.gameSprites[i]['imageNumber'];
				}
				
				// create a new ApplicationManager as all sprites have loaded
				new ApplicationManager().startupApplicationManager();
			}
			else
			{
				g_context2D.fillRect(g_canvas.width/2, g_canvas.height/2, numLoaded*10, 10);
			}
		}
		else
		{
			// stop trying to draw the loading screen
			clearInterval(this.loadScrIntervalId);
		}
	}
}
