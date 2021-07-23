/**
 * 最简单的WebGL程序，使用背景色清空<canvas>元素的绘图区
 */
function main() {
    var canvas = document.getElementById('example');

    //获取WEBGL绘图上下文
    var gl = getWebGLContext(canvas);
    if(!gl) {
        console.log('浏览器不支持 webgl ');
        return;
    }

    //指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}