var VSHADER_SOURCE = 
/**
 * attribute：存储限定符
 * attribute变量必须声明成全局变量，数据将从着色器外传递给该变量
 */
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
    const canvas = document.getElementById('example');

    const gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return;
    }

    //获取attribute变量的存储地址
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('向着色器中获取attribute变量失败');
        return;
    }

    //将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position, 0.0, 1.0, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}