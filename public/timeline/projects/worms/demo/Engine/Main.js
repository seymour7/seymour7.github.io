/** target frames per second  
    @type Number
*/
var FPS = 30;
/** time between frames 
    @type Number
*/
var SECONDS_BETWEEN_FRAMES = 1 / FPS;
/** A global reference to the GameObjectManager instance  
    @type GameObjectManager
*/
var g_GameObjectManager = null;
/** A global reference to the RoomManager instance  
    @type GameObjectManager
*/
var g_RoomManager = null;
/** A global reference to the ApplicationManager instance  
    @type ApplicationManager
*/
var g_ApplicationManager = null;
/** A global reference to the SpriteManager instance
    @type SpriteManager
*/
var g_SpriteManager = null;
/** A global reference to the canvas element  
    @type HTMLCanvasElement
*/
var g_canvas = null;
/** A global reference to the 2D context of the canvas element
    @type CanvasRenderingContext2D
*/
var g_context2D = null;
/** A global reference to the in-memory canvas used as a back buffer 
    @type HTMLCanvasElement
*/
var g_backBuffer = null;
/** A global reference to the backbuffer 2D context 
    @type CanvasRenderingContext2D
*/
var g_backBufferContext2D = null;
/** True if the canvas element is supported, false otherwise
    @type Boolean
*/
var g_canvasSupported = false;

// The entry point of the application is set to the init function
window.onload = init;

/**
    Application entry point
*/
function init()
{    
    // get references to the canvas elements and their 2D contexts
    g_canvas = document.getElementById('canvas');

    // if the this.canvas.getContext function does not exist it is a safe bet that
    // the current browser does not support the canvas element.
    // in this case we don't go any further, which will save some debuggers (like
    // the IE8 debugger) from throwing up a lot of errors.
    if (g_canvas.getContext)
    {
        g_canvasSupported = true;
        g_context2D = g_canvas.getContext('2d');
        g_backBuffer = document.createElement('canvas');
        g_backBuffer.width = g_canvas.width;
        g_backBuffer.height = g_canvas.height;
        g_backBufferContext2D = g_backBuffer.getContext('2d');
        
        // create a new GameObjectManager
        new GameObjectManager().startupGameObjectManager();
        
        // create a new SpriteManager
        new SpriteManager().startupSpriteManager(
           [{name: 'walkLeft',     src: 'Sprites/wwalk_l.png',   imageNumber: 15, origin: {x: 30, y: 30}},
            {name: 'walkRight',    src: 'Sprites/wwalk_r.png',   imageNumber: 15, origin: {x: 30, y: 30}},
            {name: 'breath1Left',  src: 'Sprites/wbrth1_l.png',  imageNumber: 39, origin: {x: 30, y: 30}},
            {name: 'breath1Right', src: 'Sprites/wbrth1_r.png',  imageNumber: 39, origin: {x: 30, y: 30}},
            {name: 'bazInLeft',    src: 'Sprites/wbazlnk_l.png', imageNumber: 7,  origin: {x: 30, y: 30}},
            {name: 'bazInRight',   src: 'Sprites/wbazlnk_r.png', imageNumber: 7,  origin: {x: 30, y: 30}},
            {name: 'baz',          src: 'Sprites/wbaz.png',      imageNumber: 64, origin: {x: 30, y: 30}},
            {name: 'crosshair',    src: 'Sprites/crshairb.png',  imageNumber: 1,  origin: {x: 30, y: 30}},
            {name: 'shootPower',   src: 'Sprites/shtpwr.png',    imageNumber: 21, origin: {x: 10, y: 9}},
            {name: 'missile',      src: 'Sprites/missile.png',   imageNumber: 1,  origin: {x: 30, y: 30}}
           ]
        );
    }
}