/**
 * gl_Position内置变量必须被赋值，否则着色器无法正常工作
 * 使用齐次坐标表示顶点坐标
 */
var VSHADER_SOURCE = 
'void main() {\n' +
'   gl_Position = vec4(1, 0.0, 0.0, 1.0);\n' +    //设置坐标
'   gl_PointSize = 10.0;\n' +                       //设置尺寸
'}\n';

/**
 * gl_FragColor，片元着色器唯一的内置变量，控制像素在屏幕上的最终颜色
 */
var FSHADER_SOURCE =
'void main() {\n' +
'   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +   //设置颜色
'}\n';

function main() {
    var canvas = document.getElementById('example');

    var gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('浏览器不支持 WebGL');
        return;
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     * gd.drawArrays(mode, first, count)
     * 可以用来绘制各种图形
     * 调用该方法时，顶点着色器将被执行 count 次，每次处理1个顶点。
     * 在顶点着色器执行的时候，将调用并执行内部的main()函数；一旦顶点着色器执行完，片元着色器就会开始执行并调用mian()函数
     */
    gl.drawArrays(gl.POINTS, 0, 1);
}