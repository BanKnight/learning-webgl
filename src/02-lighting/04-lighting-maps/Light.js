
import shaders from "./shaders";
import Element from "./Element"

const vec3 = glMatrix.vec3

export default class Light extends Element
{
    constructor(context)
    {
        super(context)

        this.ambient = vec3.create()
        this.diffuse = vec3.create()
        this.specular = vec3.create()
    }

    async setup()
    {
        const gl = this.context.gl

        this.shader = shaders.get("light")

        this.setup_vertices(gl)

        this.setup_indices(gl)
    }

    setup_vertices(gl)
    {

        const vbo = gl.createBuffer()

        const vertices = [
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,

            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,

            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,

            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,

            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,

            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
        ]

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW);

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        gl.vertexAttribPointer(
            this.shader.attributes.aPos.location,
            3,
            gl.FLOAT,
            false,
            12,
            0);

        gl.enableVertexAttribArray(
            this.shader.attributes.aPos.location,
        );
    }

    setup_indices(gl)
    {

        const ebo = gl.createBuffer()

        const indices = [
            0, 1, 3, // 第一个三角形
            1, 2, 3  // 第二个三角形
        ]

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), gl.STATIC_DRAW);

    }

    draw()
    {
        const gl = this.context.gl

        gl.uniform3fv(this.shader.uniforms.color.location, this.diffuse);

        gl.bindVertexArray(this.vao);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    set_color(r, g, b, diffuse_factor = 0.5, ambient_factor = 0.2)
    {
        this.diffuse[0] = r  * diffuse_factor
        this.diffuse[1] = g  * diffuse_factor
        this.diffuse[2] = b  * diffuse_factor

        this.ambient[0] = r  * ambient_factor
        this.ambient[1] = r  * ambient_factor
        this.ambient[2] = r  * ambient_factor
    }
}