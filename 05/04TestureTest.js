/**
 * 将纹理图像贴在二维图形上
 */

//顶点着色器接收顶点的纹理坐标，光栅化后传递给片元着色器
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n' +
'attribute vec2 a_TexCoord;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   v_TexCoord = a_TexCoord;\n' +
'}\n';


//片元着色器根据当前片元的纹理坐标，从纹理图像中抽取纹素的颜色，并赋值给当前片元
var FSHADER_SOURCE = 
'precision mediump float;\n' +
'uniform sampler2D u_Sampler;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
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

    initTextures(gl, n)
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
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

function initTextures(gl, n) {
    var url = 'img/sky.jpg';
    loadImage(url).then((image)=>{
        loadTexture(gl, n, image);
    })
}

function loadImage(url) {
    return new Promise((resolve, reject)=>{
        var image = new Image();
        image.onload = ()=>{
            resolve(image);
        };
        image.onerror = (e)=>{
            reject(e);
        };
        image.src = url;
    })
}

function loadTexture(gl, n, image) {
    /**
     * 纹理对象
     * 用来管理 WebGL 系统中的纹理
     * 可以使用 gl.deleteTexture()来删除一个纹理对象
     */
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    //将纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    gl.uniform1i(u_Sampler, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    console.log('hhh')
}