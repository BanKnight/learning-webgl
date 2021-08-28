import utils from "../utils"
import shader from "./shader"

export default function (gl)
{
    const simple_shader = utils.load_shader(gl,shader)

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer()
    const ebo = gl.createBuffer()

    gl.bindVertexArray(vao);

    {
        const vertices = [
            0.5, 0.5, 0.0,   // 右上角
            0.5, -0.5, 0.0,  // 右下角
            -0.5, -0.5, 0.0, // 左下角
            -0.5, 0.5, 0.0   // 左上角
        ]

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

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

        // 顶点属性默认是禁用的，所以这里需要开启
        gl.enableVertexAttribArray(
            simple_shader.attributes.aPos,
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
   
    return (dt,total) =>
    {
        gl.useProgram(simple_shader.program)

        gl.bindVertexArray(vao);

        const greenValue = Math.sin(total /1000) / 2.0 + 0.5;

        gl.uniform4fv(simple_shader.uniforms.ourColor.location, [0, greenValue, 0, 1.0]);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }
}