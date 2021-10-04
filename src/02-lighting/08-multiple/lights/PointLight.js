import Light from "./Light"

export default class PointLight extends Light
{
    constructor(context)
    {
        super(context)

        this.constant = 1;
        this.linear = 0.045;
        this.quadratic = 0.0075;
    }

    async setup()
    {
        await super.setup()

        this.shader = this.context.shaders.get("light")

        this.setup_vertices()

        this.setup_indices()
    }

    setup_vertices()
    {
        const gl = this.context.gl
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

    setup_indices()
    {
        const gl = this.context.gl
        const ebo = gl.createBuffer()

        const indices = [
            0, 1, 3, // 第一个三角形
            1, 2, 3  // 第二个三角形
        ]

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), gl.STATIC_DRAW);

    }

    prepare(uniform)
    {
        const gl = this.context.gl

        super.prepare(uniform)

        gl.uniform1f(uniform.constant.location, this.constant);
        gl.uniform1f(uniform.linear.location, this.linear);
        gl.uniform1f(uniform.quadratic.location, this.quadratic);
    }

    draw()
    {
        const gl = this.context.gl

        gl.bindVertexArray(this.vao);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}
