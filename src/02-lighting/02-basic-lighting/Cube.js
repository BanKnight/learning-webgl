
import shaders from "./shaders";
import Element from "./Element"

export default class Cube extends Element
{
    constructor(context)
    {
        super(context)
        this.color = { r: 255, g: 255, b: 255 }
    }

    async setup()
    {
        const gl = this.context.gl

        this.shader = shaders.get("cube")

        this.vao = gl.createVertexArray();

        gl.bindVertexArray(this.vao);

        this.setup_vertices(gl)

        this.setup_indices(gl)
    }

    setup_vertices(gl)
    {

        const vbo = gl.createBuffer()

        const vertices = [
            -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,
            0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 
            0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 
            0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 
           -0.5,  0.5, -0.5,  0.0,  0.0, -1.0, 
           -0.5, -0.5, -0.5,  0.0,  0.0, -1.0, 
       
           -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
            0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
            0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
            0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
           -0.5,  0.5,  0.5,  0.0,  0.0, 1.0,
           -0.5, -0.5,  0.5,  0.0,  0.0, 1.0,
       
           -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
           -0.5,  0.5, -0.5, -1.0,  0.0,  0.0,
           -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
           -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,
           -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,
           -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,
       
            0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
            0.5,  0.5, -0.5,  1.0,  0.0,  0.0,
            0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
            0.5, -0.5, -0.5,  1.0,  0.0,  0.0,
            0.5, -0.5,  0.5,  1.0,  0.0,  0.0,
            0.5,  0.5,  0.5,  1.0,  0.0,  0.0,
       
           -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
            0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
            0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
            0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
           -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,
           -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,
       
           -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
            0.5,  0.5, -0.5,  0.0,  1.0,  0.0,
            0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
            0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
           -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,
           -0.5,  0.5, -0.5,  0.0,  1.0,  0.0
        ]

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW);

        gl.vertexAttribPointer(
            this.shader.attributes.aPos.location,
            3,
            gl.FLOAT,
            false,
            24,
            0);

        gl.enableVertexAttribArray(
            this.shader.attributes.aPos.location,
        );

        gl.vertexAttribPointer(
            this.shader.attributes.aNormal.location,
            3,
            gl.FLOAT,
            false,
            24,
            12);

        gl.enableVertexAttribArray(
            this.shader.attributes.aNormal.location,
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

        gl.uniform3fv(this.shader.uniforms.color.location, [this.color.r / 255, this.color.g / 255, this.color.b / 255]);

        gl.bindVertexArray(this.vao);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}