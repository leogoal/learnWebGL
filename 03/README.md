**本章内容**

*1.三角形在3D图形中的重要地位，以及 WebGL 如何绘制三角形

*2.使用多个三角形绘制其他类型的基本图形

*3.利用简单的方程对三角形做基本的变换，如 移动 旋转 缩放

*4.利用矩阵简化变换

**缓冲区对象**
>WebGL提供的一种很方便的机制，可以一次性地向着色器传入多个顶点的数据
>缓冲区对象是WebGL系统中的一块内存区域，可以一次性地向缓冲区对象中填充大量地顶点数据，然后将这些数据保存在其中，供顶点着色器使用

**利用缓冲区对象向顶点着色器传入多个顶点地数据**

*1.创建缓冲区对象 - gl.createBuffer()
*2.绑定缓冲区对象 - gl.bindBuffer()
*3.将数据写入缓冲区对象 - gl.bufferData()
*4.将缓冲区对象分配给一个 attribute变量 - gl.vertexAttribPointer()
*5.开启 attribute变量 - gl.enableVertexAttribArray()

**细节
>1）创建缓冲区后，WebGL 系统中多了一个新创建的缓冲区对象（gl.deleteBuffer(buffer)方法可以删除之前创建的缓冲区对象）

>2）将缓冲区对象绑定到 WebGL 系统中已经存在的目标上，这个目标表示缓冲区对象的用途，这样WebGL才能正确处理其中的内容

>   gl.bindBuffer(target, buffer)函数规范

>   target参数有 gl.ARRAY_BUFFER：表示缓冲区对象包含了顶点的数据

>                gl.ELEMENT_ARRAY_BUFFER：表示缓冲区对象中包含了顶点的索引值

>   buffer参数：之前由 gl.createBuffer() 返回的待绑定的缓冲区对象（如果指定为null，则禁用对 target 的绑定）

>3）开辟空间并向缓冲区中写入数据，将第二个参数中的数据写入了绑定到第一个参数 gl.ARRAY_BUFFER 上的缓冲区对象
>不能直接向缓冲区写入数据，而只能向“目标”写入数据，所以要向缓冲区写入数据，必须先绑定

>   gl.bufferData(target, data, usage)函数规范

>   target：gl.ARRAY_BUFFER 或 gl.ELEMENT_ARRAY_BUFFER

>   data：写入缓冲区对象的数据（类型化数组）

>   usage：表示程序将如何使用存储在缓冲区对象中的数据（该参数帮助WebGl优化操作，如果传入错误的值，也不会终止程序，仅仅是降低程序的效率）

>        gl.STATIC_DRAW：只会向缓冲区对象中写入一次数据，但需要绘制很多次

>        gl.STREAM_DRAW：只会向缓冲区对象中写入一次数据，然后绘制若干次

>        gl.DYNAMIC_DRAW：会向缓冲区对象中多次写入数据，并绘制很多次

>4）将绑定到 gl.ARRAY_BUFFER的缓冲区对象分配给由 location 指定的 attribute 变量

>   gl.vertexAttribPointer(location, size, type, normalized, stride, offset)函数规范

>   location：待分配给 attribute 变量的存储地址

>   size：指定缓冲区中每个顶点的分量个数（1~4）；若 size 比 attribute 变量需要的分量数小，缺失部分将按照与 gl.vertexAttrib[1234]f 相同的规则补全

>   type：指定数据格式，包括（gl.UNSIGNED_BYTE gl.SHORT gl.UNSIGNED_SHORT gl.INT gl.UNSIGNED_INT gl.FLOAT）

>   normalize：true / false (表明是否将非浮点型的数据归一化到 [0, 1]或[-1, 1]区间)

>   stride：指定相邻2个顶点间的字节数，默认为0

>   offset：指定缓冲区对象中的偏移量，如果从起始位置开始的，offset设为0

>5）开启 attribute 变量

>   gl.enableVertexAttribArray(location)

>   可以使用 gl.disableVertexAttribArray(location)来关闭分配



**类型化数组**

*1.包括 

     数组类型         每个元素所占字节数            描述
> Int8Array             1                           8位整型数

> UInt8Array            1                           8位无符号整型数

> Int16Array            2                           16位整型数

> UInt16Array           2                           16位无符号整型数

> Int32Array            4                           32位整型数

> UInt32Array           4                           32位无符号整型数

> Float32Array          4                           单精度32位浮点数

> Float64Array          8                           双精度64位浮点数

*2.类型化数据的方法 属性和常量

>get(index)

>set(index, value)

>set(array, offset)：从第 offset 个元素开始，将数组 array中的值填充进去

>length

>BYTES_PER_ELEMENT：数组中每个元素所占的字节数

*3.使用 new 运算符来创建
                 