function drawGirrafe() { 
body();
    frontLegs();
    backLegs();
    neck();
    head();
    tail();
    spots();
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
    neck.matrix.translate(-0.5, 0.05, 0.15);
    // neck.matrix.rotate(45,0,0,1)
    neck.matrix.scale(0.1, 0.5, 0.1);
    neck.render();
}

function head() {
    var orhead = new Cube();
    // orhead.color = [1,0,0,0.5];
    orhead.matrix.translate(-0.45, 0.55, 0.2);
    // orhead.matrix.rotate(0,45,0,1);
    
    orhead.matrix.rotate(g_headAngle, 0, 1, 0);
    let ormatrix = orhead.matrix;
    // orhead.matrix.scale(0.1, 0.1, 0.04);
    // orhead.render();


    var head = new Cube();
    head.matrix = new Matrix4(ormatrix);
    head.color = [1.0, 0.7, 0.3, 1.0];
    head.matrix.translate(-0., 0., -0.175);
    head.matrix.scale(0.3, 0.1, 0.35);
    head.render();

    var head1 = new Cube();
    head1.matrix = new Matrix4(ormatrix)
    head1.color = [1.0, 0.7, 0.3, 1.0]; 
    // head1.matrix.translate(-0.6, 0.65, 0.04);
    head1.matrix.translate(-0., 0.1, -0.175);
    head1.matrix.scale(0.2, 0.1, 0.35);
    head1.render();

    // EYES WITH BLACK EYES
    var eye1 = new Cube(); //left
    eye1.matrix = new Matrix4(ormatrix);
    eye1.color = [0.0, 0.0, 0.0, 1.0];
    eye1.matrix.translate(0.2, 0.1, 0.08);
    eye1.matrix.scale(0.05, 0.05, 0.05);
    eye1.render();

    var eye2 = new Cube();
    eye2.matrix = new Matrix4(ormatrix);
    eye2.color = [0.0, 0.0, 0.0, 1.0];
    eye2.matrix.translate(0.2, 0.1, -0.13);
    eye2.matrix.scale(0.05, 0.05, 0.05);
    eye2.render();

    //MOUTH
    var mouth = new Cube();
    mouth.matrix = new Matrix4(ormatrix);
    mouth.color = [0.0, 0.0, 0.0, 1.0];
    mouth.matrix.translate(0.3, 0.03, -0.1);
    mouth.matrix.scale(0.01, 0.01, 0.2);
    mouth.render();
    
    //HORNS
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





function tail() {
   // First tail segment
   var tail1 = new Cube();
   tail1.color = [1.0, 0.75, 0.45, 1.0];
   tail1.matrix.translate(0.4, -0.08, 0.18);
   tail1.matrix.rotate(-g_tailAngle1, 0, 0, 1);
   var tail1Mat = new Matrix4(tail1.matrix);
   tail1.matrix.scale(0.15, 0.03, 0.05);
   tail1.render();


   // Second tail segment
   var tail2 = new Cube();
   tail2.color = [1.0, 0.75, 0.45, 1.0];
   tail2.matrix = new Matrix4(tail1Mat);
   tail2.matrix.translate(0.15, 0.0, 0.0);
   tail2.matrix.rotate(-g_tailAngle2, 0, 0, 1);
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

function spots() {
    //Left Spots
    var spot1 = new Cube();
    spot1.color = [0.0, 0.0, 0.0, 1.0];
    spot1.matrix.translate(0.13, -0.27, -0.001);
    spot1.matrix.rotate(62,0,0,1);
    spot1.matrix.scale(0.1, 0.07, 0.01);
    spot1.render();

    var spot2 = new Cube();
    spot2.color = [0.0, 0.0, 0.0, 1.0];
    spot2.matrix.translate(-0.29, -0.14, -0.001);
    spot2.matrix.rotate(30,0,0,1);
    spot2.matrix.scale(0.08, 0.12, 0.001);
    spot2.render();

    var spot3 = new Cube();
    spot3.color = [0.0, 0.0, 0.0, 1.0];
    spot3.matrix.translate(-0.15, -0.31, -0.001);
    spot3.matrix.rotate(12,0,0,1);
    spot3.matrix.scale(0.06, 0.08, 0.001);
    spot3.render();

    var spot4 = new Cube();
    spot4.color = [0.0, 0.0, 0.0, 1.0];
    spot4.matrix.translate(0.3, -0.3, -0.001);
    spot4.matrix.rotate(12,0,0,1);
    spot4.matrix.scale(0.03, 0.05, 0.001);
    spot4.render();

    var spot5 = new Cube();
    spot5.color = [0.0, 0.0, 0.0, 1.0];
    spot5.matrix.translate(-0.4, -0.4, -0.001);
    spot5.matrix.rotate(40,0,0,1);
    spot5.matrix.scale(0.05, 0.03, 0.001);
    spot5.render();

    var spot6 = new Cube();
    spot6.color = [0.0, 0.0, 0.0, 1.0];
    spot6.matrix.translate(0.3, -0.05, -0.001);
    spot6.matrix.rotate(20,0,0,1);
    spot6.matrix.scale(0.05, 0.03, 0.001);
    spot6.render();

    

    //Back Spots
    var spot7 = new Cube();
    spot7.color = [0.0, 0.0, 0.0, 1.0];
    spot7.matrix.translate(0.4, -0.38, 0.3001);
    spot7.matrix.scale(0.001, 0.08, 0.05);
    spot7.render();

    var spot8 = new Cube();
    spot8.color = [0.0, 0.0, 0.0, 1.0];
    spot8.matrix.translate(0.4, -0.23, 0.0501);
    // spot8.matrix.rotate(33,0,0,1)
    spot8.matrix.scale(0.001, 0.08, 0.09);
    spot8.render();

    var spot9 = new Cube();
    spot9.color = [0.0, 0.0, 0.0, 1.0];
    spot9.matrix.translate(0.4, -0.16, 0.2701);
    spot9.matrix.scale(0.001, 0.04, 0.05);
    spot9.render();

    var spot10 = new Cube();
    spot10.color = [0.0, 0.0, 0.0, 1.0];
    spot10.matrix.translate(0.4, -0.4, 0.1);
    spot10.matrix.scale(0.001, 0.04, 0.03);
    spot10.render();
    

    //Right Spots

    var spot11 = new Cube();
    spot11.color = [0.0, 0.0, 0.0, 1.0];
    spot11.matrix.translate(-0.3, -0.2, 0.4001);
    spot11.matrix.rotate(62,0,0,1);
    spot11.matrix.scale(0.1, 0.07, 0.001);
    spot11.render();

    var spot12 = new Cube();
    spot12.color = [0.0, 0.0, 0.0, 1.0];
    spot12.matrix.translate(0.1, -0.14, 0.4001);
    spot12.matrix.rotate(30,0,0,1);
    spot12.matrix.scale(0.08, 0.12, 0.0001);
    spot12.render();

    var spot13 = new Cube();
    spot13.color = [0.0, 0.0, 0.0, 1.0];
    spot13.matrix.translate(-0.15, -0.41, 0.4001);
    spot13.matrix.rotate(12,0,0,1);
    spot13.matrix.scale(0.06, 0.08, 0.0001);
    spot13.render();

    var spot14 = new Cube();
    spot14.color = [0.0, 0.0, 0.0, 1.0];
    spot14.matrix.translate(-0.3, -0.3, 0.4001);
    spot14.matrix.rotate(12,0,0,1);
    spot14.matrix.scale(0.03, 0.05, 0.001);
    spot14.render();

    var spot15 = new Cube();
    spot15.color = [0.0, 0.0, 0.0, 1.0];
    spot15.matrix.translate(0.25, -0.3, 0.4001);
    spot15.matrix.rotate(40,0,0,1);
    spot15.matrix.scale(0.05, 0.03, 0.0001);
    spot15.render();

    var spot16 = new Cube();
    spot16.color = [0.0, 0.0, 0.0, 1.0];
    spot16.matrix.translate(0.3, -0.05, 0.4001);
    spot16.matrix.rotate(20,0,0,1);
    spot16.matrix.scale(0.05, 0.03, 0.0001);
    spot16.render();

    //Front Spots
    var spot17 = new Cube();
    spot17.color = [0.0, 0.0, 0.0, 1.0];
    spot17.matrix.translate(-0.51, -0.38, 0.3001);
    spot17.matrix.scale(0.001, 0.08, 0.05);
    spot17.render();

    var spot18 = new Cube();
    spot18.color = [0.0, 0.0, 0.0, 1.0];
    spot18.matrix.translate(-0.51, -0.23, 0.0501);
    spot18.matrix.scale(0.001, 0.08, 0.09);
    spot18.render();

    var spot19 = new Cube();
    spot19.color = [0.0, 0.0, 0.0, 1.0];
    spot19.matrix.translate(-0.51, -0.16, 0.2701);
    spot19.matrix.scale(0.001, 0.04, 0.05);
    spot19.render();

    var spot20 = new Cube();
    spot20.color = [0.0, 0.0, 0.0, 1.0];
    spot20.matrix.translate(-0.51, -0.4, 0.1);
    spot20.matrix.scale(0.001, 0.04, 0.03);
    spot20.render();
    //neck spots
    var spot21 = new Cube();
    spot21.color = [0.0, 0.0, 0.0, 1.0];
    spot21.matrix.translate(-0.45, 0.3, 0.14);
    spot21.matrix.rotate(62,0,0,1);
    spot21.matrix.scale(0.05, 0.03, 0.01);
    spot21.render();

    var spot22 = new Cube();
    spot22.color = [0.0, 0.0, 0.0, 1.0];
    spot22.matrix.translate(-0.47, 0.1, 0.14);
    spot22.matrix.rotate(15,0,0,1);
    spot22.matrix.scale(0.03, 0.07, 0.01);
    spot22.render();

    var spot23 = new Cube();
    spot23.color = [0.0, 0.0, 0.0, 1.0];
    spot23.matrix.translate(-0.47, 0.45, 0.14);
    spot23.matrix.rotate(15,0,0,1);
    spot23.matrix.scale(0.07, 0.02, 0.01);
    spot23.render();

    //back
    var spot24 = new Cube();
    spot24.color = [0.0, 0.0, 0.0, 1.0];
    spot24.matrix.translate(-0.45, 0.35, 0.25);
    spot24.matrix.rotate(15,0,0,1);
    spot24.matrix.scale(0.02, 0.04, 0.001);
    spot24.render();

    var spot25 = new Cube();
    spot25.color = [0.0, 0.0, 0.0, 1.0];
    spot25.matrix.translate(-0.48, 0.15, 0.25);
    spot25.matrix.rotate(15,0,0,1);
    spot25.matrix.scale(0.04, 0.03, 0.001);
    spot25.render();
    
}