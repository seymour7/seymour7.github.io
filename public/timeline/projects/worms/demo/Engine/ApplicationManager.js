/**
    The ApplicationManager is used to manage the application itself.
    @author seymour
    @class
*/
function ApplicationManager()
{
    /**
        Initialises this object
        @return A reference to the initialised object

    */
    this.startupApplicationManager = function()
    {
        g_ApplicationManager = this;

        player = new Player().startupGameObject('breath1Left', 300, 400 - 48 - 48, 4);
        return this;
    }
}