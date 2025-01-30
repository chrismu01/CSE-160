function drawGirrafe() { 
body();
    frontLegs();
    backLegs();
    neck();
    head();
    face();
    horns();
    tail();
}

//BODY
function body() {
    var body = new Cube();
    body.color = [1.0, 0.6, 0.2, 1.0];
    body.matrix.translate(-0.5, -0.45, 0.0);
    body.matrix.scale(0.9, 0.5, 0.4);
    body.render();
}

//FRONT LEGS
function frontLegs() {
    // Front Right Leg with darker shade
    var leg1 = new Cube();
    leg1.color = [0.8, 0.4, 0.1, 1.0];
    leg1.matrix.translate(-0.4, -0.45, 0.3);
    leg1.matrix.rotate(g_legAngle,0,0,1);
    var fRightMat = new Matrix4(leg1.matrix);
    leg1.matrix.scale(0.1, -0.35, 0.1);
    leg1.render();

    // Front Right Leg Toe
    var toe1 = new Cube();
    toe1.color = [0.0, 0.0, 0.0, 1.0];
    toe1.matrix = fRightMat;
    toe1.matrix.translate(-0.0, -0.4, 0.0);
    toe1.matrix.scale(0.1, 0.05, 0.1);
    toe1.render();

    // Front LEFT Leg with darker shade
    var leg2 = new Cube();
    leg2.color = [0.8, 0.4, 0.1, 1.0];
    leg2.matrix.translate(-0.4, -0.45, 0.0);
    leg2.matrix.rotate(-g_legAngle,0,0,1);
    var fLeftMat = new Matrix4(leg2.matrix);
    leg2.matrix.scale(0.1, -0.35, 0.1); 
    leg2.render();

    // Front LEFT Leg Toe
    var toe2 = new Cube();
    toe2.color = [0.0, 0.0, 0.0, 1.0];
    toe2.matrix = fLeftMat;
    toe2.matrix.translate(0.0, -0.4, 0.0); 
    toe2.matrix.scale(0.1, 0.05, 0.1); 
    toe2.render();
}

//BACK LEGS
function backLegs() {
    // Back Right Leg with darker shade
    var leg3 = new Cube();
    leg3.color = [0.8, 0.4, 0.1, 1.0];
    leg3.matrix.translate(0.2, -0.45, 0.3);
    leg3.matrix.rotate(g_legAngle,0,0,1);
    var bRightMat = new Matrix4(leg3.matrix);
    leg3.matrix.scale(0.1, -0.35, 0.1); 
    leg3.render();

    // Back Right Leg Toe
    var toe3 = new Cube();
    toe3.color = [0.0, 0.0, 0.0, 1.0];
    toe3.matrix = bRightMat;
    toe3.matrix.translate(0.0, -0.4, 0.0);
    toe3.matrix.scale(0.1, 0.05, 0.1);
    toe3.render();

    // Back Left Leg with darker shade
    var leg4 = new Cube();
    leg4.color = [0.8, 0.4, 0.1, 1.0];
    leg4.matrix.translate(0.2, -0.45, 0.0);
    leg4.matrix.rotate(-g_legAngle,0,0,1);
    var bLeftMat = new Matrix4(leg4.matrix);
    leg4.matrix.scale(0.1, -0.35, 0.1); 
    leg4.render();

    // Back Right Leg Toe
    var toe4 = new Cube();
    toe4.color = [0.0, 0.0, 0.0, 1.0];
    toe4.matrix = bLeftMat;
    toe4.matrix.translate(0.0, -0.4, 0.0);
    toe4.matrix.scale(0.1, 0.05, 0.1);
    toe4.render();
}

function neck() {
    var neck = new Cube();
    neck.color = [1.0, 0.7, 0.3, 1.0]; 
    neck.matrix.translate(-0.5, 0.0, 0.15); 
    neck.matrix.scale(0.1, 0.55, 0.1);
    neck.render();
}

function head() {
    // Head with lighter shade
    var head = new Cube();
    head.color = [1.0, 0.7, 0.3, 1.0]; 
    head.matrix.translate(-0.7, 0.55, 0.04);
    head.matrix.scale(0.3, 0.1, 0.35);
    head.render();

    var head1 = new Cube();
    head1.color = [1.0, 0.7, 0.3, 1.0]; 
    head1.matrix.translate(-0.6, 0.65, 0.04);
    head1.matrix.scale(0.2, 0.1, 0.35);
    head1.render();

}

function face() {
    // Eyes with black color
    var eye1 = new Cube();
    eye1.color = [0.0, 0.0, 0.0, 1.0];
    eye1.matrix.translate(-0.651, 0.65, 0.1);
    eye1.matrix.scale(0.05, 0.05, 0.05);
    eye1.render();

    var eye2 = new Cube();
    eye2.color = [0.0, 0.0, 0.0, 1.0];
    eye2.matrix.translate(-0.651, 0.65, 0.27);
    eye2.matrix.scale(0.05, 0.05, 0.05);
    eye2.render();

    //Mouth
    var mouth = new Cube();
    mouth.color = [0.0, 0.0, 0.0, 1.0];
    mouth.matrix.translate(-0.71, 0.58, 0.11);
    mouth.matrix.scale(0.01, 0.01, 0.2);
    mouth.render();
}

function horns() {
    var horn1 = new Cube();
    horn1.color = [0.5, 0.35, 0.05, 1.0];
    horn1.matrix.translate(-0.45, 0.75, 0.1);
    horn1.matrix.scale(0.02, 0.1, 0.02);
    horn1.render();

    var horn2 = new Cube();
    horn2.color = [0.5, 0.35, 0.05, 1.0];
    horn2.matrix.translate(-0.45, 0.75, 0.3);
    horn2.matrix.scale(0.02, 0.1, 0.02);
    horn2.render();
}

function tail() {
    // Tail
    var tail = new Cube();
    tail.color = [1.0, 0.75, 0.45, 1.0];
    tail.matrix.translate(0.4, -0.08, 0.18);
    tail.matrix.rotate(-g_tailAngle,0,0,1);
    var tailMat = new Matrix4(tail.matrix);
    tail.matrix.scale(0.25, 0.03, 0.05);
    tail.render();

    //Tail end
    var tailend = new Cube();
    tailend.matrix = tailMat;
    tailend.color = [1.0, 0.75, 0.45, 1.0];
    tailend.matrix.translate(0.25, -0.022, -0.015);
    tailend.matrix.scale(0.08, 0.08, 0.08);
    tailend.render();
}