// Vertex shader program
var VSHADER_SOURCE = `
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
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0; // Corn texture
    uniform sampler2D u_Sampler1; // Dirt texture
    uniform int u_whichTexture;
    void main() {
        if (u_whichTexture == -2) {
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

    // Set initial matrix values
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
}

// UI global variables
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_globalAngle = 0;
let g_animation = false;
let g_tailAngle1 = 0;
let g_tailAngle2 = 0;
let g_tailAngleW = 0;
let g_legAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;

// Mouse control variables
let g_mouseDown = false;
let g_yaw = 0; // Horizontal rotation
let g_pitch = 0; // Vertical rotation

function addActions() {

    // Mouse handlers
    canvas.addEventListener('mousedown', function (ev) {
        g_mouseDown = true;
    });

    canvas.addEventListener('mouseup', function (ev) {
        g_mouseDown = false;
    });

    canvas.addEventListener('mousemove', function (ev) {
        if (g_mouseDown) {
            const sensitivity = 0.002;
            g_yaw -= ev.movementX * sensitivity;
            g_pitch += ev.movementY * sensitivity;


            g_pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, g_pitch));

            // Update the look-at point
            updateCamera();
        }
    });
}

function updateCamera() {
    const cosPitch = Math.cos(g_pitch);
    const sinPitch = Math.sin(g_pitch);
    const cosYaw = Math.cos(g_yaw);
    const sinYaw = Math.sin(g_yaw);

    // Calculate the new forward vector
    const forward = [
        cosYaw * cosPitch,
        sinPitch,
        sinYaw * cosPitch
    ];

    // Update the look-at point
    g_at[0] = g_eye[0] + forward[0];
    g_at[1] = g_eye[1] + forward[1];
    g_at[2] = g_eye[2] + forward[2];
}

function initializePlayerPosition() {
    for (let x = 0; x < g_map.length; x++) {
        for (let y = 0; y < g_map[x].length; y++) {
            if (g_map[x][y] === 0) {
                // Set the player's starting position
                g_eye = [x - (g_map.length / 2), 1, y - (g_map[x].length / 2)];

                // Calculate the initial forward direction (negative Z-axis)
                let forward = [0, 0, -1];

                // Rotate the forward direction by 45 degrees around the Y-axis
                const angle = 90 * (Math.PI / 180); // Convert degrees to radians
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);

                // Apply the rotation to the forward vector
                let rotatedForward = [
                    forward[0] * cosA - forward[2] * sinA, // X component
                    forward[1],                           // Y component (unchanged)
                    forward[0] * sinA + forward[2] * cosA  // Z component
                ];

                // Set the look-at point based on the rotated forward direction
                g_at = [
                    g_eye[0] + rotatedForward[0],
                    g_eye[1] + rotatedForward[1],
                    g_eye[2] + rotatedForward[2]
                ];

                return;
            }
        }
    }
}

function isPositionValid(x, y) {
    const mapX = Math.floor(x + (g_map.length / 2));
    const mapY = Math.floor(y + (g_map[0].length / 2));

    if (mapX < 0 || mapX >= g_map.length || mapY < 0 || mapY >= g_map[0].length) {
        return false; // Out of bounds
    }

    return g_map[mapX][mapY] === 0; // Only allow movement into empty spaces
}

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

    // Calculate the next position
    let nextX = g_eye[0];
    let nextZ = g_eye[2];

    if (key == 87) { // W - Move forward
        nextX += forwardNormalized[0] * movement_speed;
        nextZ += forwardNormalized[2] * movement_speed;
    } else if (key == 83) { // S - Move backward
        nextX -= forwardNormalized[0] * movement_speed;
        nextZ -= forwardNormalized[2] * movement_speed;
    } else if (key == 65) { // A - Move left
        nextX += rightNormalized[0] * movement_speed;
        nextZ += rightNormalized[2] * movement_speed;
    } else if (key == 68) { // D - Move right
        nextX -= rightNormalized[0] * movement_speed;
        nextZ -= rightNormalized[2] * movement_speed;
    } else if (key == 81) { // Q - Turn left
        g_yaw -= rotation_speed; // Fix: Rotate left
        updateCamera();
    } else if (key == 69) { // E - Turn right
        g_yaw += rotation_speed; // Fix: Rotate right
        updateCamera();
    }

    // Check if the next position is valid
    if (isPositionValid(nextX, nextZ)) {
        g_eye[0] = nextX;
        g_eye[2] = nextZ;
        g_at[0] = g_eye[0] + forwardNormalized[0];
        g_at[2] = g_eye[2] + forwardNormalized[2];
    }

    // Redraw the scene
    renderScene();
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
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0 + textureUnit); // Activate the appropriate texture unit
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
    document.onkeydown = keydown;
    initTextures();
    initializePlayerPosition();
    gl.clearColor(0.53, 0.81, 0.98, 1.0);
    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    renderScene();
    updateAngles();
    requestAnimationFrame(tick);
}

function updateAngles() {
    if (g_animation) {
        g_tailAngle1 = (45 * Math.sin(g_seconds));
        g_tailAngle2 = (45 * Math.sin(g_seconds));
        g_legAngle = (45 * Math.sin(g_seconds));
        g_headAngle = (90 * Math.sin(g_seconds));
    }
}

const movement_speed = 0.1;
const rotation_speed = 0.05;
var g_eye = [16, 1, 16]; // Starting position of the player
var g_at = [16, 1, 15]; // Look-at point (slightly in front of the player)
var g_up = [0, 1, 0]; // Up vector

var g_map = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 0, 1, 0, 2, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 0, 3],
    [3, 0, 2, 2, 0, 2, 2, 0, 1, 0, 3, 2, 0, 1, 3, 0, 1, 2, 3, 0, 2, 1, 0, 3, 2, 0, 2, 2, 0, 2, 0, 3],
    [3, 0, 2, 0, 0, 0, 3, 0, 1, 0, 2, 0, 0, 1, 2, 0, 1, 0, 3, 0, 2, 1, 0, 2, 3, 0, 0, 0, 0, 2, 0, 3],
    [3, 0, 0, 0, 3, 0, 3, 0, 1, 0, 0, 0, 3, 1, 2, 0, 1, 0, 0, 0, 0, 1, 0, 2, 2, 0, 3, 0, 3, 0, 0, 3],
    [3, 0, 2, 3, 2, 0, 2, 2, 1, 2, 3, 0, 2, 1, 3, 0, 1, 0, 2, 2, 0, 1, 0, 3, 3, 0, 2, 2, 2, 0, 2, 3],
    [3, 0, 2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1, 2, 0, 1, 0, 2, 0, 0, 1, 0, 2, 3, 0, 2, 0, 0, 0, 2, 3],
    [3, 0, 3, 0, 3, 3, 3, 0, 1, 0, 3, 3, 3, 1, 3, 0, 1, 0, 3, 3, 3, 1, 0, 3, 3, 0, 3, 3, 3, 0, 3, 3],
    [3, 0, 3, 0, 0, 0, 3, 0, 1, 0, 0, 0, 3, 1, 0, 0, 1, 0, 0, 0, 3, 1, 0, 0, 3, 0, 0, 0, 3, 0, 3, 3],
    [3, 0, 3, 3, 3, 0, 3, 0, 1, 3, 3, 0, 3, 1, 3, 0, 1, 3, 3, 0, 3, 1, 3, 0, 3, 0, 3, 3, 3, 0, 3, 3],
    [3, 0, 2, 2, 3, 0, 3, 0, 1, 3, 2, 0, 3, 1, 3, 0, 1, 3, 2, 0, 3, 1, 3, 0, 3, 0, 3, 2, 2, 0, 3, 3],
    [3, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 1, 0, 0, 1, 0, 0, 0, 3, 1, 0, 0, 3, 0, 0, 0, 3, 0, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
];

function drawMap() {
    for (let x = 0; x < g_map.length; x++) {
        for (let y = 0; y < g_map[x].length; y++) {
            let height = g_map[x][y];
            if (height > 0) {
                for (let h = 0; h < height; h++) {
                    let cube = new Cube();
                    cube.textureNum = 0; // Corn texture
                    cube.matrix.translate(x - (g_map.length / 2), h - 0.75, y - (g_map[x].length / 2));
                    cube.renderfaster();
                }
            }
        }
    }
}

function renderScene() {
    var startTime = performance.now();

    // Pass matrices
    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the map
    drawMap();

    // Draw the floor
    var floor = new Cube();
    floor.textureNum = 1; // Dirt texture
    floor.matrix.translate(0, -0.75, 0.0);
    floor.matrix.scale(32, 0, 32);
    floor.matrix.translate(-0.5, 0, -0.5);
    floor.renderfaster();

    // Draw the sky
    var sky = new Cube();
    sky.textureNum = -2; // No texture, solid color
    sky.color = [0.53, 0.81, 0.98, 1.0];
    sky.matrix.scale(100, 100, 100);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.renderfaster();

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