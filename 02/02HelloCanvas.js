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
    /**
     * 由于 WebGL 继承自 OpenGL ES，所以它遵循 OpenGl ES 颜色分量的取值范围（0.0 ~ 1.0）
     * 一旦指定了背景色之后，背景色就会驻存在 WebGL 系统中，在下次调用 gl.clearColor 之前不会改变
     * 也就是，如果背景色不变，该方法调用一次即可
     */
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    /**
     * 该方法继承自 OpenGL，它基于多基本缓冲区模型
     * 参数：
     *      gl.COLOR_BUFFER_BIT     指定颜色缓存区
     *      gl.DEPTH_BUFFER_BIT     指定深度缓冲区
     *      gl.STENCIL_BUFFER_BIT   指定模板缓冲区
     */
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     * 清空缓冲区的默认参数
     *      颜色缓冲区：(0.0, 0.0, 0.0, 1.0)
     *      深度缓冲区：1.0
     *      模板缓冲区：0
     */
}