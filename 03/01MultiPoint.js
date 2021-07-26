var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 10.0;\n' +
'}\n';

var FSHADER_SOURCE = 
'void main() {\n' +
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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
        console.log('设置顶点坐标失败');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ])
    var n = 3;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('创建缓冲区对象失败');
        return;
    }
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //将缓冲区对象分配给 attribute 变量
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //开启 attribute 变量
    gl.enableVertexAttribArray(a_Position);

    return n;
}