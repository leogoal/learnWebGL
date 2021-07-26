**本章内容**

*1.三角形在3D图形中的重要地位，以及 WebGL 如何绘制三角形

*2.使用多个三角形绘制其他类型的基本图形

*3.利用简单的方程对三角形做基本的变换，如 移动 旋转 缩放

*4.利用矩阵简化变换

**缓冲区对象**
>WebGL提供的一种很方便的机制，可以一次性地向着色器传入多个顶点的数据
>缓冲区对象是WebGL系统中的一块内存区域，可以一次性地向缓冲区对象中填充大量地顶点数据，然后将这些数据保存在其中，供顶点着色器使用



**总结**

*1.WebGL 核心方法
>gl.createBuffer()
>gl.bindBuffer()
>gl.bufferData()
>gl.vertexAttribPointer()
>gl.enableVertexAttribArray()