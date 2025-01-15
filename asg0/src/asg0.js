// asg0.js
// Christian Mu
// cmu15@ucsc.edu

function main() {
    // Retrieve the <canvas> element
    var canvas = document.getElementById('example'); 
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element.');
        return false; 
    }

    // Get the rendering context for 2D graphics
    var ctx = canvas.getContext('2d');
    
    clearCanvas(ctx);

    // Listening if user clicks draw button 1
    var drawButton1 = document.getElementById('draw1');
    drawButton1.addEventListener('click', function() {
        handleDrawEvent(ctx);
    });

    // Listening if user clicks draw button 2
    var drawButton2 = document.getElementById('draw2');
    drawButton2.addEventListener('click', function() {
        handleDrawOperationEvent(ctx);
    });
}

// Clears the canvas and sets the background to black
function clearCanvas(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,1.0)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Draws a vector on the canvas
function drawVector(ctx, v, color) {
    // Set the color for the vector
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    // Start drawing
    ctx.beginPath();

    // Move to the center of the canvas (origin of the vector)
    var centerX = ctx.canvas.width / 2;
    var centerY = ctx.canvas.height / 2;
    ctx.moveTo(centerX, centerY);

    // Draw a line to the scaled vector endpoint
    ctx.lineTo(centerX + v.elements[0] * 20, centerY - v.elements[1] * 20);

    // Stroke the line
    ctx.stroke();
}

// When user clicks the first draw button
function handleDrawEvent(ctx) {
    // Clear the canvas
    clearCanvas(ctx);

    // Read the user input for the vector's coordinates
    var x = parseFloat(document.getElementById('x-cord').value);
    var y = parseFloat(document.getElementById('y-cord').value);

    var x1 = parseFloat(document.getElementById('x-cord1').value);
    var y1 = parseFloat(document.getElementById('y-cord1').value);

    // Create the new vector
    var v1 = new Vector3([x, y, 0]);
    var v2 = new Vector3([x1, y1, 0]);

    // Draw the vector
    drawVector(ctx, v1, "red");
    drawVector(ctx, v2, "blue");
}

//When user clicks the second draw button
function handleDrawOperationEvent(ctx) {
    clearCanvas(ctx);

    // Read the user input for the vector's coordinates
    var x = parseFloat(document.getElementById('x-cord').value);
    var y = parseFloat(document.getElementById('y-cord').value);

    console.log(document.getElementById("x-cord"));
    console.log(document.getElementById("y-cord"));

    var x1 = parseFloat(document.getElementById('x-cord1').value);
    var y1 = parseFloat(document.getElementById('y-cord1').value);
    
    console.log(document.getElementById("x-cord1"));
    console.log(document.getElementById("y-cord1"));
    
    // Create the new vector
    var v1 = new Vector3([x, y, 0]);
    var v2 = new Vector3([x1, y1, 0]);

    var scalar1 = parseFloat(document.getElementById("scalar").value);

    console.log(document.getElementById("scalar"));

    // Draw v1 and v2
    drawVector(ctx, v1, "red");
    drawVector(ctx, v2, "blue");

    // Read the operation from the selector
    const operation = document.getElementById("operation").value;

    if (operation === "add") { //Add
        const v3 = new Vector3(v1.elements).add(v2);
        console.log('ADD');
        drawVector(ctx, v3, "green");
    } 
    
    else if (operation === "sub") { //Subtract
        const v3 = new Vector3(v1.elements).sub(v2);
        drawVector(ctx, v3, "green");
    } 
    
    else if (operation === "mul") { //Multiply
        const v3 = new Vector3(v1.elements).mul(scalar1);
        const v4 = new Vector3(v2.elements).mul(scalar1);
        drawVector(ctx, v3, "green");
        drawVector(ctx, v4, "green");
    } 
    
    else if (operation === "div") { //Divide
        
            const v3 = new Vector3(v1.elements).div(scalar1);
            const v4 = new Vector3(v2.elements).div(scalar1);
            drawVector(ctx, v3, "green");
            drawVector(ctx, v4, "green"); 
    }
    else if (operation === "mag") { //Magnitude
        const v3 = new Vector3(v1.elements).normalize();
        const v4 = new Vector3(v2.elements).normalize();
        drawVector(ctx, v3, "green");
        drawVector(ctx, v4, "green");
        console.log("Magnitude v1:", v1.magnitude());
        console.log("Magnitude v2:", v1.magnitude());
    }
    else if (operation === "nor") { //Normalize
        const v3 = new Vector3(v1.elements).normalize();
        const v4 = new Vector3(v2.elements).normalize();
        drawVector(ctx, v3, "green");
        drawVector(ctx, v4, "green");
    }
    else if (operation === "ang") { //Angle Between
        const angle = angleBetween(v1, v2);

        console.log(`Angle: ${angle}`);
    }
    else if (operation === "are") { //Area
        const area = areaTriangle(v1, v2);
        console.log(`Area of the triangle: ${area}`);
    }
}

function angleBetween(v1, v2) {
    const dotProduct = Vector3.dot(v1, v2);

    const magV1 = v1.magnitude();
    const magV2 = v2.magnitude();

    
    const cosTheta = dotProduct / (magV1 * magV2);

    return Math.acos(cosTheta) * (180 / Math.PI);
}

function areaTriangle(v1, v2) {
    const crossProduct = Vector3.cross(v1, v2);

    const magnitude = crossProduct.magnitude();

    return magnitude / 2;
}