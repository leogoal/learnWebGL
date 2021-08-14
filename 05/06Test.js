/**
 * 同时绘制2个纹理
 */

/**
 * 顶点着色器的纹理坐标，光栅化后传递给片元着色器
 */
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec2 a_TexCoord;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   v_TexCoord = a_TexCoord;\n' +
'}\n';

var FSHADER_SOURCE =
'precision mediump float;\n' +
'uniform sampler2D u_Sampler0;\n' +
'uniform sampler2D u_Sampler1;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'   vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +
'   vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
'   gl_FragColor = color0 * color1;\n' +
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
        console.log('...');
        return;
    }

    initTextures(gl, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
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
    var url0 = 'img/sky.jpg';
    loadImage(url0).then((image)=>{
        loadTexture(gl, n, image, 0);
    })

    var url1 = 'img/circle.gif';
    loadImage(url1).then((image)=>{
        loadTexture(gl, n, image, 1);
    })

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
}

function loadImage(url) {
    return new Promise((resolve, reject)=>{
        var image = new Image();
        image.onload = ()=>{
            resolve(image);
        };
        image.onerror = (e)=>{
            reject(e)
            console.log('加载资源失败')
        };
        image.src = url;
    })
}

var g_init0 = false;
var g_init1 = false;
function loadTexture(gl, n, image, int_image) {

    //激活纹理单元
    var u_Sampler;
    if(0 === int_image) {
        gl.activeTexture(gl.TEXTURE0);
        u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler0');
        g_init0 = true;
    } else {
        gl.activeTexture(gl.TEXTURE1);
        u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler1');
        g_init1 = true;
    }
    //绑定纹理对象
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //设置纹理对象填充方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //将纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, int_image);


    if(g_init0 && g_init1) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}

