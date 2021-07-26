var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 5.0;\n' +
'}\n';

var FSHADER_SOURCE =
'void main() {\n' +
'   gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);\n' +
'}\n';

function main() {
    var canvas = document.getElementById('example');
    if(!canvas) {
        console.log('canvas标签不存在');
        return;
    }
    var gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('获取webgl绘图上下文失败');
        return;
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    canvas.onmousedown = function(e) {
        click(e, gl, canvas, a_Position);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];  //鼠标点击位置数组
function click(e, gl, canvas, a_Position) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();

    x = ((x - rect.left) - (rect.width / 2)) / (rect.width / 2);
    y = (rect.height / 2 - (y - rect.top)) / (rect.height / 2);

    g_points.push(x);
    g_points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i+=2) {
        gl.vertexAttrib2f(a_Position, g_points[i], g_points[i + 1]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}