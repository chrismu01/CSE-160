// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`    
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
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

function setupWebGL(){ //No need to change
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true})
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
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

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//UI global variables
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectSize=5;
let g_selectedType = POINT;
let isEraserMode = false;

function addActions() {
    // Color slider
    document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });

    // Size slider
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectSize = this.value; });

    //Segment slider
    document.getElementById('segSlide').addEventListener('mouseup', function() { g_selectSize = this.value; });
    // Clear Button
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes(); };
    document.getElementById('drawpicButton').onclick = drawmyPicture;

    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};

    
}

function main() {
    
    // Setup canvas and gl variables
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    addActions();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}



var g_shapesList = [];

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
    renderAllShapes();
}

function convertCoordEventGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);

}

// Draw every shape that is supossed to be in the canvas
function renderAllShapes() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    var startTime = performance.now();

    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
    // Check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + "ms: " + Math.floor(duration) + "fps: " + Math.floor(10000/duration)/10, "numdot");
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

function drawmyPicture() {
    //top half for sky
    gl.uniform4f(u_FragColor, 0.53, 0.81, 0.92, 1.0); // Sky blue color
    drawTriangle([-1.0, 1.0, -1.0, 0.0, 1.0, 0.0]);
    drawTriangle([-1.0, 1.0, 1.0, 0.0, 1.0, 1.0]);

    //bottom half for grass
    gl.uniform4f(u_FragColor, 0.6, 0.8, 0.2, 1.0); // Light green color
    drawTriangle([-1.0, 0.0, -1.0, -1.0, 1.0, -1.0]);
    drawTriangle([-1.0, 0.0, 1.0, -1.0, 1.0, 0.0]);
    
    
    //mountains
    gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 1.0); // Gray color
    drawTriangle([-0.4,0, -1.0,0, -0.75,0.4]);
    drawTriangle([0.2,0, -0.8,0, -0.4,0.7]);
    drawTriangle([0.5,0, -0.4,0, 0.1,0.6]);
    drawTriangle([1,0, 0.1,0, 0.6,0.5]);

    //snow caps for mountain
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // White color
    drawTriangle([-0.75, 0.4, -0.81, 0.3, -0.67, 0.3]); // Snow cap for Mountain 1
    drawTriangle([-0.4, 0.7, -0.46, 0.6, -0.31, 0.6]); // Snow cap for Mountain 2
    drawTriangle([0.1, 0.6, 0.02, 0.5, 0.17, 0.5]);   // Snow cap for Mountain 3
    drawTriangle([0.6, 0.5, 0.5, 0.4, 0.68, 0.4]);

    //river
    gl.uniform4f(u_FragColor, 0.0, 0.5, 1.0, 1.0); // Blue color
    drawTriangle([0.0, 0.0, -0.1, -0.2, 0.1, -0.2]); // Top segment
    drawTriangle([-0.1, -0.2, -0.3, -0.4, 0.1, -0.2]); // Left curve
    drawTriangle([-0.3, -0.4, 0.1, -0.2, 0.3, -0.4]); // Middle widening
    drawTriangle([-0.3, -0.4, -0.2, -0.6, 0.3, -0.4]); // Right curve
    drawTriangle([-0.2, -0.6, 0.3, -0.4, 0.2, -0.6]); // Bottom left curve
    drawTriangle([-0.2, -0.6, -0.1, -0.8, 0.2, -0.6]); // Narrowing bottom curve
    drawTriangle([0.2, -0.8, -0.1, -0.8, 0.2, -0.6]);
    drawTriangle([-0.1, -0.8, 0.0, -1.0, 0.2, -0.8]); // Final taper to the bottom
    
    //tree tops
    gl.uniform4f(u_FragColor, 0.0, 0.5, 0.0, 1.0); // Green color 
    drawTriangle([-0.8, -0.4, -0.9, -0.6, -0.7, -0.6]);
    drawTriangle([-0.6, -0.15, -0.675, -0.3, -0.525, -0.3]);
    drawTriangle([-0.4, -0.7, -0.45, -0.8, -0.35, -0.8]);
    drawTriangle([0.3, -0.3, 0.25, -0.5, 0.35, -0.5]);
    drawTriangle([0.5, -0.55, 0.475, -0.7, 0.525, -0.7]);
    drawTriangle([0.8, -0.35, 0.75, -0.6, 0.85, -0.6]);

    //tree trunks
    gl.uniform4f(u_FragColor, 0.54, 0.27, 0.07, 1.0); // Brown color
    drawTriangle([-0.83, -0.6, -0.77, -0.6, -0.77, -0.8]);
    drawTriangle([-0.83, -0.6, -0.83, -0.8, -0.77, -0.8]); 
    drawTriangle([-0.63, -0.3, -0.585, -0.3, -0.585, -0.4]);
    drawTriangle([-0.63, -0.3, -0.63, -0.4, -0.585, -0.4]); 
    drawTriangle([-0.43, -0.8, -0.37, -0.8, -0.37, -0.9]);
    drawTriangle([-0.43, -0.8, -0.43, -0.9, -0.37, -0.9]); 
    drawTriangle([0.28, -0.5, 0.32, -0.5, 0.32, -0.6]);
    drawTriangle([0.28, -0.5, 0.28, -0.6, 0.32, -0.6]); 
    drawTriangle([0.48, -0.7, 0.52, -0.7, 0.52, -0.8]);
    drawTriangle([0.48, -0.7, 0.48, -0.8, 0.52, -0.8]); 
    drawTriangle([0.78, -0.6, 0.82, -0.6, 0.82, -0.8]);
    drawTriangle([0.78, -0.6, 0.78, -0.8, 0.82, -0.8]); 


}