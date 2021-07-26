var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = 5.0;\n' +
    '}\n';

var FSHADER_SOURCE =
    'void main() {\n' +
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    canvas.onmousedown = function (e) {
        click(e, gl, a_Position)
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_Points = [];
function click(e, gl, a_Position) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();

    x = ((x - rect.left) - (rect.width / 2)) / (rect.width / 2);
    y = ((rect.height / 2) - (y - rect.top)) / (rect.height / 2);

    g_Points.push(x);
    g_Points.push(y);

    /**
     * WebGL系统中的绘制操作实际上是在颜色缓冲区中进行绘制的
     * 绘制结束后系统将缓冲区的内容显示在屏幕上，然后颜色缓冲区就会被重置，其中的内容会丢失
     * 因此需要将每次点击的位置记录下来，在每次点击之后，重新绘制全部的点
     */

    gl.clear(gl.COLOR_BUFFER_BIT);
    /**
     * 如果注释掉上述代码（gl.clear(...)），颜色缓冲区就会被WebGl重置为默认的颜色
     */

    var len = g_Points.length;
    for (var i = 0; i < len; i += 2) {
        gl.vertexAttrib2f(a_Position, g_Points[i], g_Points[i + 1]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}