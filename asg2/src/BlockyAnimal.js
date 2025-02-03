// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`    
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){ //No need to change
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log("Failed to get the storage location of u_GlobalRotateMatrix");
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants


//UI global variables
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_globalAngle = 0;
let g_animation = false;
let g_tailAngle1 = 0;
let g_tailAngle2 = 0;
let g_tailAngleW = 0;
let g_legAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;


function addActions() {
    // Angle slider
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });
    
    document.getElementById('tail1Slide').addEventListener('mousemove', function() {g_tailAngle1 = this.value; renderScene(); });
    document.getElementById('tail2Slide').addEventListener('mousemove', function() {g_tailAngle2 = this.value; renderScene(); });
    
    document.getElementById('legSlide').addEventListener('mousemove', function() {g_legAngle = this.value; renderScene(); });
    document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderScene(); });
    document.getElementById('backButton').onclick = function() {g_globalAngle = 90; renderScene(); };
    document.getElementById('frontButton').onclick = function() {g_globalAngle = 270; renderScene(); };
    document.getElementById('leftButton').onclick = function() {g_globalAngle = 0; renderScene(); };
    document.getElementById('rightButton').onclick = function() {g_globalAngle = 180; renderScene(); };
    document.getElementById('animateOnButton').onclick = function() {g_animation = true};
    document.getElementById('animateOffButton').onclick = function() {g_animation = false};
}

function main() {
    
    // Setup canvas and gl variables
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    addActions();

    // Register function (event handler) to be called on a mouse press
    //canvas.onmousedown = click;
    canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};

    // Specify the color for clearing <canvas>
    //gl.clearColor(0, 0, 0, 1.0);
    gl.clearColor(0.53, 0.81, 0.98, 1.0);

    //renderScene();
    requestAnimationFrame(tick);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick() {
    // print some debug infomration so we know we are running
    g_seconds = performance.now()/1000.0 - g_startTime;
    console.log(performance.now);

    //draw everything
    renderScene();
    updateAngles();
    //tell the browser to update again when it has time
    requestAnimationFrame(tick);
}

function updateAngles() {
    if (g_animation) {
        g_tailAngle1 = (45*Math.sin(g_seconds));
        g_tailAngle2 = (45*Math.sin(g_seconds));
        g_legAngle = (45*Math.sin(g_seconds));
        g_headAngle = (90*Math.sin(g_seconds));

    }
}
var g_shapesList = [];

/*
function click(ev) {
    // Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordEventGL(ev);

    let point;
    if (g_selectedType==POINT) {
        point = new Point();
    } else if (g_selectedType==TRIANGLE) {
        point = new Triangle();
    } else{
        point = new Circle();
    }

    point.position=[x,y];
    point.color=g_selectedColor.slice();
    point.size=g_selectSize;
    g_shapesList.push(point);

    // Draw every shape that is supossed to be in the canvas
    renderScene();
}
*/
function convertCoordEventGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);

}

// Draw every shape that is supossed to be in the canvas
function renderScene() {
    var startTime = performance.now();
    console.log(g_globalAngle);
    
    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawGirrafe();

    // Check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}


// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

