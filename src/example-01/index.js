import utils from "../utils"
import shader from "./shader"

export default  function (context)
{
    const gl = context.gl
    const simple_shader = utils.load_shader(gl,shader)

    const vertices = [
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.0, 0.5, 0.0
    ]

    const buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW);

    // 告诉gpu如何解析这个数据
    gl.vertexAttribPointer(
        simple_shader.attributes.aPos.index,
        3,
        gl.FLOAT,
        false,
        0,
        0);


    return () =>
    {

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            // 顶点属性默认是禁用的，所以这里需要开启
        gl.enableVertexAttribArray(
            simple_shader.attributes.aPos.index,
            );

        gl.useProgram(simple_shader.program)

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}