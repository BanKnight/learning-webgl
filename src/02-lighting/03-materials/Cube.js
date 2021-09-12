
import shaders from "./shaders";
import Element from "./Element"

const vec3 = glMatrix.vec3

export default class Cube extends Element
{
    constructor(context)
    {
        super(context)

        this.material = {
            ambient: vec3.create(),       //环境光照,定义了在环境光照下这个物体反射得是什么颜色，通常这是和物体颜色相同的颜色
            diffuse: vec3.create(),       //漫反射,定义了在漫反射光照下物体的颜色。（和环境光照一样）
            specular: vec3.create(),      //镜面光照,镜面光照对物体的颜色影响（或者甚至可能反射一个物体特定的镜面高光颜色）
            shininess: 0,    //反光度,影响镜面高光的散射/半径
        }
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
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            -0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,

            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,
            -0.5, 0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, 0.5, -1.0, 0.0, 0.0,
            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,

            0.5, 0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            -0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,

            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0
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

        {
            gl.uniform3fv(this.shader.uniforms["material.ambient"].location, this.material.ambient);
            gl.uniform3fv(this.shader.uniforms["material.diffuse"].location, this.material.diffuse);
            gl.uniform3fv(this.shader.uniforms["material.specular"].location, this.material.specular);
            gl.uniform1f(this.shader.uniforms["material.shininess"].location, this.material.shininess);
        }

        gl.bindVertexArray(this.vao);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    set_color(r,g,b)
    {
        this.material.ambient[0] = r 
        this.material.ambient[1] = g 
        this.material.ambient[2] = b 

        this.material.diffuse[0] = r 
        this.material.diffuse[1] = g 
        this.material.diffuse[2] = b 
    }
}