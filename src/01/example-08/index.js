import utils from "../../utils"
import shader from "./shader"

const mat4 = glMatrix.mat4

export default async function (context)
{
    const gl = context.gl
    const simple_shader = utils.load_shader(gl, shader)

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer()
    const ebo = gl.createBuffer()

    gl.bindVertexArray(vao);

    {
        const vertices = [
            // ---- 位置 ---- - 纹理坐标 -
            0.5, 0.5, 0.0, 1.0, 1.0,   // 右上
            0.5, -0.5, 0.0, 1.0, 0.0,   // 右下
            -0.5, -0.5, 0.0, 0.0, 0.0,   // 左下
            -0.5, 0.5, 0.0, 0.0, 1.0    // 左上
        ]

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW);

        // 告诉gpu如何解析这个数据
        gl.vertexAttribPointer(
            simple_shader.attributes.aPos.location,
            3,
            gl.FLOAT,
            false,
            20,
            0);

        gl.vertexAttribPointer(
            simple_shader.attributes.aTexCoord.location,
            2,
            gl.FLOAT,
            false,
            20,
            12);

        // 顶点属性默认是禁用的，所以这里需要开启
        gl.enableVertexAttribArray(
            simple_shader.attributes.aPos.location,
        );

        gl.enableVertexAttribArray(
            simple_shader.attributes.aTexCoord.location,
        );
    }
    {
        const indices = [
            0, 1, 3, // 第一个三角形
            1, 2, 3  // 第二个三角形
        ]

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), gl.STATIC_DRAW);
    }

    // gl.bindVertexArray(0);

    const images = await utils.load_images(["container.jpg", "awesomeface.png"])
    const textures = []
    {
        for (let i = 0; i < images.length; ++i)
        {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);      //表示将t轴反过来
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);

            gl.generateMipmap(gl.TEXTURE_2D);

            textures.push(texture)
        }

        gl.useProgram(simple_shader.program)

        //告诉gpu uniform 绑定到哪个纹理单元的编号
        gl.uniform1i(simple_shader.uniforms.texture1.location, 0);
        gl.uniform1i(simple_shader.uniforms.texture2.location, 1);

    }

    return () =>
    {
        //将纹理单元中的纹理切换
        for (let i = 0; i < textures.length; ++i)
        {
            const texture = textures[i]

            gl.activeTexture(gl[`TEXTURE${i}`])
            gl.bindTexture(gl.TEXTURE_2D, texture);
        }

        gl.useProgram(simple_shader.program)

        gl.bindVertexArray(vao);

        const model = mat4.create()     //局部空间
        const view = mat4.create()      //观察矩阵，用于摄像机
        const projection = mat4.create()        //投影矩阵

        //绕着X轴旋转，有个疑惑，确定旋转轴后，旋转的方向又是如何确定的
        mat4.rotate(model, model, utils.radians(-55), [1, 0, 0])        
        mat4.translate(view, view, [0,0,-3])        //将整个世界的点往Z轴负方向移动，那么世界的东西就露出来

        //然后开始做投影计算，表现出3d的特点来
        mat4.perspective(projection,utils.radians(45.0), context.width / context.height, 0.1, 100.0);

        gl.uniformMatrix4fv(simple_shader.uniforms.model.location, false, model);
        gl.uniformMatrix4fv(simple_shader.uniforms.view.location, false, view);

        //投影矩阵在不变的情况下，可以优化写在帧循环外面，减少设置
        //通过教程中上面这句话可以理解，矩阵中的全局变量果然不会丢失，可以利用这点做优化
        gl.uniformMatrix4fv(simple_shader.uniforms.projection.location, false, projection);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }
}