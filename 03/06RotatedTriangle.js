var VSHADER_SOURCE =
// x1 = x * cosB - y * sinB
// y1 = x * sinB + y * cosB
'attribute vec4 a_Position;\n' +
'uniform float u_CosB, u_SinB;\n' +
'void main() {\n' +
'   gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
'   gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
'   gl_Position.z = a_Position.z;\n' +
'   gl_Position.w = 1.0;\n' +
'}\n';

var FSHADER_SOURCE = 
'void main() {\n' +
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
'}\n';


/**
 * 旋转的角度
 */
var ANGLE = 90.0;
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

    /**
     * 角度转弧度
     */
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n)
    
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ])

    var n = 3;

    //创建
    var vertexBuffer = gl.createBuffer();
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