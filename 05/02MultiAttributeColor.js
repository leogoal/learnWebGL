var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 10.0;\n' +
'   v_Color = a_Color;\n' +
'}\n';

var FSHADER_SOURCE = 
'varying vec4 v_Color;\n' +
'void main() {\n' +
'   gl_FragColor = v_Color;\n' +
'}\n';

function main() {
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas)
    
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败')
        return;
    }

    var n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('初始化顶点数据失败')
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
        0.5, -0.5, 0.0, 0.0, 1.0, 1.0
    ])

    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}