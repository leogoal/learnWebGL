var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n' +
'attribute float a_PointSize;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = a_PointSize;\n' +
'}\n';

var FSHADER_SOURCE = 
'void main() {\n' +
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);' +
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

    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
    /**
     * 将几种“逐顶点”的数据（坐标 尺寸）交叉储存在一个数组中
     */
    var vertices = new Float32Array([
        0.0, 0.5, 5.0,
        -0.5, -0.5, 10.0,
        0.5, -0.5, 20.0
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
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}

