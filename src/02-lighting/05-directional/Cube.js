
import shaders from "./shaders";
import Element from "./Element"

// const vec3 = glMatrix.vec3

export default class Cube extends Element
{
    constructor(context)
    {
        super(context)

        this.material = {
            diffuse: null,       //漫反射,定义了在漫反射光照下物体的颜色。（和环境光照一样）
            specular: null,      //镜面光照,镜面光照对物体的颜色影响（或者甚至可能反射一个物体特定的镜面高光颜色）
            emission:null,       //一个储存了每个片段的发光值(Emission Value)的贴图
            shininess: 0,    //反光度,影响镜面高光的散射/半径
        }
    }

    async setup()
    {
        const gl = this.context.gl

        this.shader = shaders.get("cube")

        this.setup_vertices(gl)

        // this.setup_indices(gl)

        await this.setup_texture(gl)
    }

    setup_vertices(gl)
    {

        const vertices = [
            // positions          // normals           // texture coords
         -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  0.0,
         0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  0.0,
         0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  1.0,
         0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  1.0,
        -0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  1.0,
        -0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  0.0,

        -0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,
         0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  0.0,
         0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  1.0,
         0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  1.0,
        -0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  1.0,
        -0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,

        -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,  1.0,  0.0,
        -0.5,  0.5, -0.5, -1.0,  0.0,  0.0,  1.0,  1.0,
        -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,  0.0,  1.0,
        -0.5, -0.5, -0.5, -1.0,  0.0,  0.0,  0.0,  1.0,
        -0.5, -0.5,  0.5, -1.0,  0.0,  0.0,  0.0,  0.0,
        -0.5,  0.5,  0.5, -1.0,  0.0,  0.0,  1.0,  0.0,

         0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,
         0.5,  0.5, -0.5,  1.0,  0.0,  0.0,  1.0,  1.0,
         0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
         0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
         0.5, -0.5,  0.5,  1.0,  0.0,  0.0,  0.0,  0.0,
         0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,

        -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  0.0,  1.0,
         0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  1.0,  1.0,
         0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  1.0,  0.0,
         0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  1.0,  0.0,
        -0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  0.0,  0.0,
        -0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  0.0,  1.0,

        -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0,  1.0,
         0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  1.0,  1.0,
         0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
         0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
        -0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  0.0,  0.0,
        -0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0,  1.0
        ]

        const vbo = gl.createBuffer()

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
            32,
            0);

        gl.enableVertexAttribArray(
            this.shader.attributes.aPos.location,
        );

        gl.vertexAttribPointer(
            this.shader.attributes.aNormal.location,
            3,
            gl.FLOAT,
            false,
            32,
            12);

        gl.enableVertexAttribArray(
            this.shader.attributes.aNormal.location,
        );

        gl.vertexAttribPointer(
            this.shader.attributes.aTexCoords.location,
            2,
            gl.FLOAT,
            false,
            32,
            24);

        gl.enableVertexAttribArray(
            this.shader.attributes.aTexCoords.location,
        );
    }

    async setup_texture(gl)
    {
        const res = this.context.res

        const textures = await res.load_images([
            "container2.png",
            "container2_specular.png",
        ])

        this.material.diffuse = textures[0]
        this.material.specular = textures[1]

        gl.useProgram(this.shader.program)

        //映射到纹理单元的index
        gl.uniform1i(this.shader.uniforms["material.diffuse"].location, 0);
        gl.uniform1i(this.shader.uniforms["material.specular"].location, 1);
    }

    draw()
    {
        const gl = this.context.gl

        {
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, this.material.diffuse);

            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D, this.material.specular);
        }

        {
            gl.uniform1f(this.shader.uniforms["material.shininess"].location, this.material.shininess);
        }

        gl.bindVertexArray(this.vao);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

}