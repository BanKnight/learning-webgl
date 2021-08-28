const load_shader = require("../shaders")

/**
 * 使用uniform
 * @param {*} gl 
 * @returns 
 */
module.exports = function (gl)
{
    const simple_shader = load_shader(gl, "simple03")

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer()

    gl.bindVertexArray(vao);

    {
        const vertices = [
            // 位置         // 颜色
            0.5, -0.5, 0.0, 1.0, 0.0, 0.0,   // 右下
            -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,   // 左下
            0.0, 0.5, 0.0, 0.0, 0.0, 1.0    // 顶部
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
            24,
            0);


           gl.vertexAttribPointer(
            simple_shader.attributes.aColor.location,
            3,
            gl.FLOAT,
            false,
            24,
            12);

        // 顶点属性默认是禁用的，所以这里需要开启
        gl.enableVertexAttribArray(
            simple_shader.attributes.aPos.location,
        );

        gl.enableVertexAttribArray(
            simple_shader.attributes.aColor.location,
        );
    }

    

    return () =>
    {
        gl.useProgram(simple_shader.program)

        gl.bindVertexArray(vao);

        gl.drawArrays(gl.TRIANGLES,0,3)        
    }
}