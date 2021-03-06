var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 5.0;\n' +
'}\n';

var FSHADER_SOURCE = 
'void main() {\n' +
'   gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
'}\n';

function main() {
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    var n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('初始化顶点数据失败');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 2, 1)
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ])
    var n = 3;
    //创建
    var vertexBuffer = gl.createBuffer()
    if(!vertexBuffer) {
        return -1;
    }
    //绑定
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //分配
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //开启
    gl.enableVertexAttribArray(a_Position);

    return n;
}