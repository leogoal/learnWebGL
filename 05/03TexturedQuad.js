/**
 * 顶点着色器接收顶点的纹理坐标，光栅化后传递给片元着色器
 */
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec2 a_TexCoord;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   v_TexCoord = a_TexCoord;\n' +
'}\n';

/**
 * 片元着色器根据片元的纹理坐标，从纹理图像中抽取出纹素颜色，并赋给当前片元
 */
var FSHADER_SOURCE =
'precision mediump float;\n' +
'uniform sampler2D u_Sampler;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'   gl_FragColor = '
'}\n';

function main() {
    var canvas = document.getElementById('example');
    var gl = getWebGLContext(canvas);
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return;
    }
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        //顶点坐标  纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ])
    var n = 4;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, ) {
    /**
     * 创建纹理对象
     * 纹理对象用来管理 WebGL 系统中的纹理
     * 可以使用 gl.deleteTexture()来删除一个纹理对象
     */
    var texture = gl.createTexture();

    /**
     * 该变量用来接收纹理对象
     * 由于纹素也是有大小的，取样处的纹理坐标很可能并不落在某个像素中心，所以取样通常并不是直接取纹理图像某个像素的颜色，而是通过附近的若干像素共同计算而得
     */
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    var image = new Image();
    image.onload = function() {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = 'img/logo.png';

    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    /**纹理坐标系统的 s轴方向 与 窗口坐标系统的y方向是相反的
     * gl.pixelStorei(pname, param)
     * pname 可以是 gl.UNPACK_FLIP_Y_WEBGL（y轴反转） gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL（将图像RGB颜色值的每一个分量乘以A）
     */

     //对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    /**
     * WebGL通过一种纹理单元的机制来同时使用多个纹理
     * 每个纹理单元有一个单元编号来管理一张纹理图像
     * 系统支持的纹理单元个数取决于硬件和浏览器的WebGL实现（一般至少支持8个）
     * 内置变量 gl.TEXTURE0 ... gl.TEXTURE7 各表示一个纹理单元
     * 在使用纹理单元之前，需要先激活它
     */
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);

    /**
     * 1.告诉 WebGL系统 纹理对象使用的是哪种类型的纹理（开启纹理对象）
     * 2.gl.TEXTURE_2D        二维纹理
     *   gl.TEXTURE_CUBE_MAP  立方体纹理
     * 
     * 3.如果已经激活了某个纹理单元，则纹理对象也会绑定到这个纹理单元上
     * 4.没有办法直接操作纹理对象，需要通过操作纹理单元来操作纹理对象
     */
    //绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    /**
     * 设置纹理图像映射到图形上的具体方式
     * gl.texParameteri(target, pname, param)
     * 
     *      pname                   描述            默认值
     *      gl.TEXTURE_MAG_FILTER   纹理放大        gl.LINEAR
     *      gl.TEXTURE_MIN_FILTER   纹理缩小        gl.NEAREST_MIPMAP_LINEAR (金字塔的纹理类型，原始纹理图像的一些列不同分辨率的版本，本书不介绍)
     *      gl.TEXTURE_WRAP_S       纹理水平填充    gl.REPEAT   
     *      gl.TEXTURE_WRAP_T       纹理重置填充    gl.REPEAT    
     * 
     * 参数值解释
     *      gl.NEAREST          使用原纹理上距离映射后新像素中心最近的那个像素的颜色值
     *      gl.LINEAR           使用距离新像素中心最近的4个像素的颜色值的加权平均（更大的开销）
     * 
     *      gl.REPEAT           平铺式的重复纹理
     *      gl.MIRRORED_REPEAT  镜像对称式的重复纹理
     *      gl.CLAMP_TO_EDGE    使用纹理图像边缘值
     */
    //配置纹理对象的参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    /**
     * gl.texImage2D(target, level, internalformat, format, type, image)
     * 参数解释
     *      target：        gl.TEXTURE_2D  或 gl.TEXTURE_CUBE_MAP  
     *      level：         传入0（该参数为金字塔纹理准备的，本书不涉及）
     *      internalformat：图像的内部格式（gl.RGB 、gl.RGBA 、 gl.ALPHA 、gl.LUMINANCE 、gl.LUMINANCE_ALPHA）
     *                      该方法将纹理图像存储在 WebGL 系统中的纹理对象中，所以必须通过 internalformat 参数来告诉系统纹理图像的格式类型
     *      format：        纹理数据的格式，必须使用与 internalformat 相同的值
     *      type：          纹理数据的数据格式（通常使用 gl.UNSIGNED_BYTE数据类型，其他的数据格式通常被用来压缩数据，以减少浏览器加载图像的时间）
     *      image：         包含纹理图像的Image对象
     */
    //将纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    /**
     * 一种特殊的、专用于纹理对象的数据类型
     * sampler2D：  绑定到 gl.TEXTURE_2D 上的纹理数据类型
     * samplerCube：绑定到 gl.TEXTURE_CUBE_MAP 上的纹理数据类型
     */ 
    //将纹理单元传递给片元着色器 
    gl.uniform1i(u_Sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}