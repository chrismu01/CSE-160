// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform int u_whichTexture;
    void main() {
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;

        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV,1.0,1.0);

        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);

        } else {
            gl_FragColor = vec4(1,.2,.2,1); 
        }
    }`

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;

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


    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
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

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }


    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
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

}

function initTextures() {
    // Create the image object
    var image = new Image();
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }
    // Register the event handler to be called when image loading is completed
    image.onload = function(){ sendTextureToTEXTURE0(image); };
    // Tell the browser to load an Image
    image.src = '../lib/sky.jpg';
  
    return true;
}

function sendTextureToTEXTURE0(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
    // Activate texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler0, 0);
    
  
    // Draw the rectangle
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    console.log('finished sendTextureToGLSL')
}

function main() {
    
    // Setup canvas and gl variables
    setupWebGL();
    // Setup GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    addActions();

    document.onkeydown = keydown;

    initTextures();
    

    // Specify the color for clearing <canvas>
    // gl.clearColor(0, 0, 0, 1.0);
    gl.clearColor(0.53, 0.81, 0.98, 1.0);


    //renderScene();
    requestAnimationFrame(tick);
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
function tick() {
    // print some debug infomration so we know we are running
    g_seconds = performance.now()/1000.0 - g_startTime;
    // console.log(performance.now);

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

const movement_speed = 0.1;
const rotation_speed = 0.02
var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];

function keydown(ev) {
    const key = ev.keyCode;

    // Calculate the forward and right vectors
    const forward = [g_at[0] - g_eye[0], g_at[1] - g_eye[1], g_at[2] - g_eye[2]];
    const right = [forward[2], 0, -forward[0]]; // Cross product of forward and up vectors

    // Normalize the vectors
    const forwardLength = Math.sqrt(forward[0] * forward[0] + forward[1] * forward[1] + forward[2] * forward[2]);
    const rightLength = Math.sqrt(right[0] * right[0] + right[2] * right[2]);
    const forwardNormalized = [forward[0] / forwardLength, forward[1] / forwardLength, forward[2] / forwardLength];
    const rightNormalized = [right[0] / rightLength, 0, right[2] / rightLength];

    // Handle key presses
    if (key == 87) { // W - Move forward
        g_eye[0] += forwardNormalized[0] * movement_speed;
        g_eye[1] += forwardNormalized[1] * movement_speed;
        g_eye[2] += forwardNormalized[2] * movement_speed;
        g_at[0] += forwardNormalized[0] * movement_speed;
        g_at[1] += forwardNormalized[1] * movement_speed;
        g_at[2] += forwardNormalized[2] * movement_speed;
    } else if (key == 83) { // S - Move backward
        g_eye[0] -= forwardNormalized[0] * movement_speed;
        g_eye[1] -= forwardNormalized[1] * movement_speed;
        g_eye[2] -= forwardNormalized[2] * movement_speed;
        g_at[0] -= forwardNormalized[0] * movement_speed;
        g_at[1] -= forwardNormalized[1] * movement_speed;
        g_at[2] -= forwardNormalized[2] * movement_speed;
    } else if (key == 65) { // A - Move left
        g_eye[0] += rightNormalized[0] * movement_speed;
        g_eye[2] += rightNormalized[2] * movement_speed;
        g_at[0] += rightNormalized[0] * movement_speed;
        g_at[2] += rightNormalized[2] * movement_speed;
    } else if (key == 68) { // D - Move right
        g_eye[0] -= rightNormalized[0] * movement_speed;
        g_eye[2] -= rightNormalized[2] * movement_speed;
        g_at[0] -= rightNormalized[0] * movement_speed;
        g_at[2] -= rightNormalized[2] * movement_speed;
    } else if (key == 81) { // Q - Turn left 
        const angle = rotation_speed;
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);

        // Rotate the forward vector around the Y-axis
        const newForwardX = forward[0] * cosTheta + forward[2] * sinTheta;
        const newForwardZ = -forward[0] * sinTheta + forward[2] * cosTheta;

        // Update the look-at point
        g_at[0] = g_eye[0] + newForwardX;
        g_at[2] = g_eye[2] + newForwardZ;
    } else if (key == 69) { // E - Turn right 
        const angle = -rotation_speed; 
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);

        // Rotate the forward vector around the Y-axis
        const newForwardX = forward[0] * cosTheta + forward[2] * sinTheta;
        const newForwardZ = -forward[0] * sinTheta + forward[2] * cosTheta;

        // Update the look-at point
        g_at[0] = g_eye[0] + newForwardX;
        g_at[2] = g_eye[2] + newForwardZ;
    }

    // Redraw the scene
    renderScene();
}


var g_map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
]

function drawMap() {
    var map = new Cube();
    for (x=0;x<32;x++) {
        for (y=0;y<32;y++) {
            if(x<1 || x==31 || y==0 || y==31) {
            //if (g_map[x][y]==1) {
                // var map = new Cube();
                map.color = [1.0,1.0,1.0,1.0];
                map.matrix.translate(x-4, -.75, y-4);
                map.matrix.scale(.4,.4,.4);
                map.matrix.translate(x-16, 0, y-16);
                map.renderfaster();
            }
        }
    }
}

// Draw every shape that is supossed to be in the canvas
function renderScene() {
    var startTime = performance.now();
    // console.log(g_globalAngle);

    // Pass the projection matrix
    var projMat=new Matrix4();
    projMat.setPerspective(60, canvas.width/canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // Pass the view matrix
    var viewMat=new Matrix4();
    viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
    
    // Pass the matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawMap();
    //draw the floor
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.textureNum=0;
    body.matrix.translate(0, -0.75, 0.0);
    body.matrix.scale(10,0,10);
    body.matrix.translate(-.5,0,-0.5);
    body.render();

    var sky = new Cube();
    sky.color = [1.0,0.0,0.0,1.0];
    sky.textureNum=1;
    sky.matrix.scale(50,50,50);
    sky.matrix.translate(-.5, -.5, -0.5);
    sky.render();


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

