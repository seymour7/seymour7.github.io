/**
    A class to represent the missile object on the screen
    @author seymour
    @class
*/
function r_Start()
{
    /**
        Called when the object is created
    */
    this.create = function()
    {
        // create all new instances
        player = new Player().startupGameObject('breath1Left', 300, 400 - 48 - 48, 4);
    }
}

r_Start.prototype = new Room;