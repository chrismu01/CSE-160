// Function to draw the giraffe
function drawGirrafe(transformMatrix) {
    // Save the current matrix
    var originalMatrix = new Matrix4(transformMatrix);

    // Draw each part of the giraffe with the transformation applied
    body(transformMatrix);
    frontLegs(transformMatrix);
    backLegs(transformMatrix);
    neck(transformMatrix);
    head(transformMatrix);
    tail(transformMatrix);
    spots(transformMatrix);

    // Restore the original matrix
    transformMatrix.set(originalMatrix);
}

// BODY
function body(transformMatrix) {
    var body = new Cube();
    body.color = [1.0, 0.6, 0.2, 1.0];
    body.matrix = new Matrix4(transformMatrix);
    body.matrix.translate(-0.5, -0.45, 0.0);
    body.matrix.scale(0.9, 0.5, 0.4);
    body.render();
}

// FRONT LEGS
function frontLegs(transformMatrix) {
    // Front Right Leg with darker shade
    var leg1 = new Cube();
    leg1.color = [0.8, 0.4, 0.1, 1.0];
    leg1.matrix = new Matrix4(transformMatrix);
    leg1.matrix.translate(-0.4, -0.45, 0.3);
    // leg1.matrix.rotate(g_legAngle, 0, 0, 1);
    var fRightMat = new Matrix4(leg1.matrix);
    leg1.matrix.scale(0.1, -0.35, 0.1);
    leg1.render();

    // Front Right Leg Toe
    var toe1 = new Cube();
    toe1.color = [0.0, 0.0, 0.0, 1.0];
    toe1.matrix = new Matrix4(fRightMat);
    toe1.matrix.translate(-0.0, -0.4, 0.0);
    toe1.matrix.scale(0.1, 0.05, 0.1);
    toe1.render();

    // Front LEFT Leg with darker shade
    var leg2 = new Cube();
    leg2.color = [0.8, 0.4, 0.1, 1.0];
    leg2.matrix = new Matrix4(transformMatrix);
    leg2.matrix.translate(-0.4, -0.45, 0.0);
    // leg2.matrix.rotate(-g_legAngle, 0, 0, 1);
    var fLeftMat = new Matrix4(leg2.matrix);
    leg2.matrix.scale(0.1, -0.35, 0.1);
    leg2.render();

    // Front LEFT Leg Toe
    var toe2 = new Cube();
    toe2.color = [0.0, 0.0, 0.0, 1.0];
    toe2.matrix = new Matrix4(fLeftMat);
    toe2.matrix.translate(0.0, -0.4, 0.0);
    toe2.matrix.scale(0.1, 0.05, 0.1);
    toe2.render();
}

// BACK LEGS
function backLegs(transformMatrix) {
    // Back Right Leg with darker shade
    var leg3 = new Cube();
    leg3.color = [0.8, 0.4, 0.1, 1.0];
    leg3.matrix = new Matrix4(transformMatrix);
    leg3.matrix.translate(0.2, -0.45, 0.3);
    // leg3.matrix.rotate(g_legAngle, 0, 0, 1);
    var bRightMat = new Matrix4(leg3.matrix);
    leg3.matrix.scale(0.1, -0.35, 0.1);
    leg3.render();

    // Back Right Leg Toe
    var toe3 = new Cube();
    toe3.color = [0.0, 0.0, 0.0, 1.0];
    toe3.matrix = new Matrix4(bRightMat);
    toe3.matrix.translate(0.0, -0.4, 0.0);
    toe3.matrix.scale(0.1, 0.05, 0.1);
    toe3.render();

    // Back Left Leg with darker shade
    var leg4 = new Cube();
    leg4.color = [0.8, 0.4, 0.1, 1.0];
    leg4.matrix = new Matrix4(transformMatrix);
    leg4.matrix.translate(0.2, -0.45, 0.0);
    // leg4.matrix.rotate(-g_legAngle, 0, 0, 1);
    var bLeftMat = new Matrix4(leg4.matrix);
    leg4.matrix.scale(0.1, -0.35, 0.1);
    leg4.render();

    // Back Left Leg Toe
    var toe4 = new Cube();
    toe4.color = [0.0, 0.0, 0.0, 1.0];
    toe4.matrix = new Matrix4(bLeftMat);
    toe4.matrix.translate(0.0, -0.4, 0.0);
    toe4.matrix.scale(0.1, 0.05, 0.1);
    toe4.render();
}

// NECK
function neck(transformMatrix) {
    var neck = new Cube();
    neck.color = [1.0, 0.7, 0.3, 1.0];
    neck.matrix = new Matrix4(transformMatrix);
    neck.matrix.translate(-0.5, 0.05, 0.15);
    neck.matrix.scale(0.1, 0.5, 0.1);
    neck.render();
}

// HEAD
function head(transformMatrix) {
    var orhead = new Cube();
    orhead.matrix = new Matrix4(transformMatrix);
    orhead.matrix.translate(-0.45, 0.55, 0.2);
    // orhead.matrix.rotate(g_headAngle, 0, 1, 0);
    let ormatrix = new Matrix4(orhead.matrix);

    var head = new Cube();
    head.matrix = new Matrix4(ormatrix);
    head.color = [1.0, 0.7, 0.3, 1.0];
    head.matrix.translate(-0.0, 0.0, -0.175);
    head.matrix.scale(0.3, 0.1, 0.35);
    head.render();

    var head1 = new Cube();
    head1.matrix = new Matrix4(ormatrix);
    head1.color = [1.0, 0.7, 0.3, 1.0];
    head1.matrix.translate(-0.0, 0.1, -0.175);
    head1.matrix.scale(0.2, 0.1, 0.35);
    head1.render();

    // EYES
    var eye1 = new Cube(); // Left eye
    eye1.matrix = new Matrix4(ormatrix);
    eye1.color = [0.0, 0.0, 0.0, 1.0];
    eye1.matrix.translate(0.2, 0.1, 0.08);
    eye1.matrix.scale(0.05, 0.05, 0.05);
    eye1.render();

    var eye2 = new Cube(); // Right eye
    eye2.matrix = new Matrix4(ormatrix);
    eye2.color = [0.0, 0.0, 0.0, 1.0];
    eye2.matrix.translate(0.2, 0.1, -0.13);
    eye2.matrix.scale(0.05, 0.05, 0.05);
    eye2.render();

    // MOUTH
    var mouth = new Cube();
    mouth.matrix = new Matrix4(ormatrix);
    mouth.color = [0.0, 0.0, 0.0, 1.0];
    mouth.matrix.translate(0.3, 0.03, -0.1);
    mouth.matrix.scale(0.01, 0.01, 0.2);
    mouth.render();

    // HORNS
    var horn1 = new Cube();
    horn1.matrix = new Matrix4(ormatrix);
    horn1.color = [0.5, 0.35, 0.05, 1.0];
    horn1.matrix.translate(0.15, 0.2, 0.1);
    horn1.matrix.scale(0.02, 0.1, 0.02);
    horn1.render();

    var horn2 = new Cube();
    horn2.matrix = new Matrix4(ormatrix);
    horn2.color = [0.5, 0.35, 0.05, 1.0];
    horn2.matrix.translate(0.15, 0.2, -0.1);
    horn2.matrix.scale(0.02, 0.1, 0.02);
    horn2.render();
}

// TAIL
function tail(transformMatrix) {
    // First tail segment
    var tail1 = new Cube();
    tail1.color = [1.0, 0.75, 0.45, 1.0];
    tail1.matrix = new Matrix4(transformMatrix);
    tail1.matrix.translate(0.4, -0.08, 0.18);
    // tail1.matrix.rotate(-g_tailAngle1, 0, 0, 1);
    var tail1Mat = new Matrix4(tail1.matrix);
    tail1.matrix.scale(0.15, 0.03, 0.05);
    tail1.render();

    // Second tail segment
    var tail2 = new Cube();
    tail2.color = [1.0, 0.75, 0.45, 1.0];
    tail2.matrix = new Matrix4(tail1Mat);
    tail2.matrix.translate(0.15, 0.0, 0.0);
    // tail2.matrix.rotate(-g_tailAngle2, 0, 0, 1);
    var tail2Mat = new Matrix4(tail2.matrix);
    tail2.matrix.scale(0.15, 0.03, 0.05);
    tail2.render();

    // Tail end
    var tailEnd = new Cube();
    tailEnd.color = [1.0, 0.75, 0.45, 1.0];
    tailEnd.matrix = new Matrix4(tail2Mat);
    tailEnd.matrix.translate(0.15, -0.04, 0.0);
    tailEnd.matrix.scale(0.1, 0.1, 0.1);
    tailEnd.render();
}

// SPOTS
function spots(transformMatrix) {
    // Left Spots
    var spot1 = new Cube();
    spot1.color = [0.0, 0.0, 0.0, 1.0];
    spot1.matrix = new Matrix4(transformMatrix);
    spot1.matrix.translate(0.13, -0.27, -0.001);
    spot1.matrix.rotate(62, 0, 0, 1);
    spot1.matrix.scale(0.1, 0.07, 0.01);
    spot1.render();

    var spot2 = new Cube();
    spot2.color = [0.0, 0.0, 0.0, 1.0];
    spot2.matrix = new Matrix4(transformMatrix);
    spot2.matrix.translate(-0.29, -0.14, -0.001);
    spot2.matrix.rotate(30, 0, 0, 1);
    spot2.matrix.scale(0.08, 0.12, 0.001);
    spot2.render();

    // Add more spots as needed...
}