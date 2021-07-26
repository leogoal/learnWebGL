var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = 5.0;\n' +
'}\n';

var FSHADER_SOURCE = 
'precision mediump float;\n' +
'uniform vec4 u_FragColor;\n' +
'void main() {\n' +
'   gl_FragColor = u_FragColor;\n' +
'}\n';

function main() {
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    canvas.onmousedown = function(e) {
        click(e, gl, a_Position, u_FragColor);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];
function click(e, gl, a_Position, u_FragColor) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();

    x = ((x - rect.left) - (rect.width / 2)) / (rect.width / 2);
    y = ((rect.height / 2) - (y - rect.top)) / (rect.height / 2);
    g_points.push([x, y]);

    if(x >= 0.0 && y >= 0.0) {
        //第一象限
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if(x < 0 && y < 0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else if(x < 0 && y >= 0) {
        //第二象限
        g_colors.push([0.0, 0.0, 1.0, 1.0]);
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT)
    var len = g_points.length;
    for(let i = 0; i < len; i++) {
        var pos = g_points[i];
        gl.vertexAttrib2f(a_Position, pos[0], pos[1]);

        var color = g_colors[i];
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
