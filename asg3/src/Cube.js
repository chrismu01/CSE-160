class Cube{
    constructor() {
        this.type='cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;


        this.cubeVerts32= new Float32Array([
            0,0,0, 1,1,0, 1,0,0
            ,
            0,0,0, 0,1,0, 1,1,0
            ,
            0,1,0, 0,1,1, 1,1,1
            ,
            0,1,0, 1,1,1, 1,1,0
            ,
            1,1,0, 1,1,1, 1,0,0
            ,
            1,0,0, 1,1,1, 1,0,1
            ,
            0,1,0, 0,1,1, 0,0,0
            ,
            0,0,0, 0,1,1, 0,0,1
            ,
            0,0,0, 0,0,1, 1,0,1
            ,
            0,0,0, 1,0,1, 1,0,0
            ,
            0,0,1, 1,1,1, 1,0,1
            ,
            0,0,1, 0,1,1, 1,1,1
        ]);
        
        this.uvVerts= new Float32Array([
            1,0, 0,1, 1,1
            ,
            0,0, 0,1, 1,1
            ,
            1,0, 0,1, 1,1
            ,
            0,0, 0,1, 1,1
            ,
            1, 0, 0, 1, 1, 1
            ,
            0, 0, 0, 1, 1, 1
            ,
            1, 0, 0, 1, 1, 1
            ,
            0, 0, 0, 1, 1, 1
            ,
            1, 0, 0, 1, 1, 1
            ,
            0, 0, 0, 1, 1, 1
            ,
            1, 0, 0, 1, 1, 1
            ,
            0, 0, 0, 1, 1, 1
        ]);
    }
    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        
        // Front face
        drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

        // Back face
        drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 1,1]);
        drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

        // Top face
        drawTriangle3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 1, 1, 1]);
        drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);

        // Bottom face
        drawTriangle3DUV([0, 0, 0, 1, 0, 1, 1, 0, 0], [1, 0, 0, 1, 1, 1]);
        drawTriangle3DUV([0, 0, 0, 0, 0, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1]);

        // Left face
        drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [1, 0, 0, 1, 1, 1]);
        drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1]);

        // Right face
        drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 1, 1, 1]);
        drawTriangle3DUV([1, 0, 0, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
    
    }
    renderfast() {
        var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Collect all vertices for the cube
    var allverts = [];

    // Front face
    allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]); // Triangle 1
    allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]); // Triangle 2

    // Back face
    allverts = allverts.concat([0, 0, 1, 1, 1, 1, 1, 0, 1]); // Triangle 1
    allverts = allverts.concat([0, 0, 1, 0, 1, 1, 1, 1, 1]); // Triangle 2

    // Top face
    allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]); // Triangle 1
    allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]); // Triangle 2

    // Bottom face
    allverts = allverts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]); // Triangle 1
    allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]); // Triangle 2

    // Left face
    allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 1, 0]); // Triangle 1
    allverts = allverts.concat([0, 0, 0, 0, 0, 1, 0, 1, 1]); // Triangle 2

    // Right face
    allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 1, 0]); // Triangle 1
    allverts = allverts.concat([1, 0, 0, 1, 0, 1, 1, 1, 1]); // Triangle 2

    // Draw all vertices at once
    drawTriangle3D(allverts);
    }

    renderfaster() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (g_vertexBuffer==null) {
            initTriange3D();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.cubeVerts), gl.DYNAMIC_DRAW)
        gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW)

        if (g_uvBuffer==null) {
            initUV();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvVerts, gl.DYNAMIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

    
    }
}
var g_uvBuffer=null;
function initUV() {
    g_uvBuffer = gl.createBuffer();
    if (!g_uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);
}

