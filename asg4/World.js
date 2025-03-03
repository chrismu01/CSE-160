// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_Normal;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
        v_Normal = a_Normal;
        v_VertPos = u_ModelMatrix * a_Position;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0; // Corn texture
    uniform sampler2D u_Sampler1; // Dirt texture
    uniform int u_whichTexture;
    uniform vec3 u_lightPos;
    varying vec4 v_VertPos;
    void main() {
        if (u_whichTexture == -3) {
            gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);
        } else if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor; // Solid color
        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0); // UV debug
        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV); // Corn texture
        } else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV); // Dirt texture
        } else {
            gl_FragColor = vec4(1, 0.2, 0.2, 1); // Error color
        }
        
        vec3 lightVector = vec3(v_VertPos)-u_lightPos;
        float r=length(lightVector);
        if (r<1.0) {
            gl_FragColor= vec4(1,0,0,1);
        } else if (r<2.0){
            gl_FragColor = vec4(0,1,0,1);
        }
    }`;

// Global Variables
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
let u_Sampler1;
let u_whichTexture;
let a_Normal;
let u_lightPos;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log("Failed to get the storage location of u_GlobalRotateMatrix");
        return;
    }

    // Get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }

    // Get the storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
    }

    // Get the storage location of u_Sampler0 (corn texture)
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    // Get the storage location of u_Sampler1 (dirt texture)
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }

    // Get the storage location of u_whichTexture
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }
    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_ightPos');
        return;
    }

    // Set initial matrix values
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
}

// UI global variables
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_globalAngle = 0;
let g_normalOn = false;
let g_yellowAnimation = false;
let g_magentaAnimation = false;
let g_magentaAngle = 0;
let g_yellowAngle = 0;
let g_lightPos = [0,0.7,-2];

// Mouse control variables


function addActions() {
    //Buttons
    document.getElementById('normalOn').onclick = function() {g_normalOn = true;};
    document.getElementById('normalOff').onclick = function() {g_normalOn = false;};
    document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true;};
    document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false;};
    document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true;};
    document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false;};

    //Sliders
    document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderScene()}});
    document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderScene()}});
    document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderScene()}});
    document.getElementById('magentaSlide').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_magentaAngle = this.value; renderScene()}});
    document.getElementById('yellowSlide').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_yellowAngle = this.value; renderScene()}});
    
    canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};

    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });
}

function initTextures() {
    // Load corn texture for walls
    var cornImage = new Image();
    cornImage.onload = function () { sendTextureToTEXTURE0(cornImage, 0); };
    cornImage.src = '../lib/corn.jpg';

    // Load dirt texture for the floor
    var dirtImage = new Image();
    dirtImage.onload = function () { sendTextureToTEXTURE0(dirtImage, 1); };
    dirtImage.src = '../lib/dirt.jpg';
}

function sendTextureToTEXTURE0(image, textureUnit) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit to the sampler
    if (textureUnit === 0) {
        gl.uniform1i(u_Sampler0, 0); // Corn texture
    } else if (textureUnit === 1) {
        gl.uniform1i(u_Sampler1, 1); // Dirt texture
    }
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActions();

    // document.onkeydown = keydown;
    initTextures();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // renderScene();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
function tick() {
    g_seconds = performance.now()/1000.0 - g_startTime;
    updateAnimationAngles();
    renderScene();
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_yellowAnimation) {
        g_yellowAngle = (45*Math.sin(g_seconds));
    }
    if (g_magentaAnimation) {
        g_magentaAngle = (45*Math.sin(g_seconds));
    }

    g_lightPos[0]=Math.cos(g_seconds);
}

function keydown(ev) {
    if (ev.keyCode === 39) { // 
        g_camera.turnright();
    } else if (key === 37) { // 
        g_camera.turnleft();
    }

    if (ev.keyCode === 87) { g_camera.forward();};
    if (ev.keyCode === 83) { g_camera.back();};
    if (ev.keyCode === 65) { g_camera.left();};
    if (ev.keyCode === 68) { g_camera.right();};
    if (ev.keyCode === 81) { g_camera.turnleft();};
    if (ev.keyCode === 69) { g_camera.turnright();};

    renderScene();
    console.log(ev.keyCode);
}

function renderScene() {
    var startTime = performance.now();

    // Pass matrices
    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform3f(u_lightPos, g_lightPos[0],g_lightPos[1],g_lightPos[2]);

    //draw the light
    var light=new Cube();
    light.color= [2,2,0,1];
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(.1,.1,.1);
    light.matrix.translate(-.5,-.5,-.5);
    light.render();

    //draw the sphere
    var sp = new Sphere();
    if (g_normalOn) sp.textureNum=-3;
    sp.matrix.translate(0,-1.5,-6);
    sp.render();

    // Draw the floor
    var floor = new Cube();
    floor.color = [1.0,0.0,0.0,1.0];
    floor.textureNum = 1;
    if (g_normalOn) sp.textureNum=-3;
    floor.matrix.translate(0, -2.49, 0.0);
    floor.matrix.scale(10, 0, 10);
    floor.matrix.translate(-0.5, 0, -1.5);
    floor.render();

    // Draw the right cube
    var rightCube = new Cube();
    rightCube.color = [0.8, 0.8, 0.8, 1.0];
    rightCube.textureNum = -2;
    if (g_normalOn) sp.textureNum=-3;
    rightCube.matrix.translate(5, -2.49, 0.0);
    rightCube.matrix.scale(1, 6, 10);
    rightCube.matrix.translate(-0.5, 0, -1.5);
    rightCube.render();

    // Draw the left cube
    var leftCube = new Cube();
    leftCube.color = [0.8, 0.8, 0.8, 1.0];
    leftCube.textureNum = -2;
    if (g_normalOn) sp.textureNum=-3;
    leftCube.matrix.translate(-5, -2.49, 0.0);
    leftCube.matrix.scale(1, 6, 10);
    leftCube.matrix.translate(-0.5, 0, -1.5);
    leftCube.render();

    // Draw the back cube
    var backCube = new Cube();
    backCube.color = [1.0, 1.0, 0.0, 1.0];
    backCube.textureNum = -2;
    backCube.matrix.translate(0, -2.49, -15);
    backCube.matrix.scale(10, 6, 1);
    backCube.matrix.translate(-0.5, 0, -1.5);
    backCube.render();
    
    /*
    // Draw the sky
    var sky = new Cube();
    // sky.textureNum = -2; // No texture, solid color
    sky.color = [0.53, 0.81, 0.98, 1.0];
    if (g_normalOn) sky.textureNum=-3;
    sky.matrix.scale(-100, -100, -100);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.renderfaster();
    */
    // Display performance
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