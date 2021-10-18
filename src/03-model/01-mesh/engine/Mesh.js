export default class Mesh
{
    constructor()
    {
        this.vertices = []          //[Vertex]
        this.indices = []            //[uint]
        this.textures = []

        this._vao = 0
        this._vbo = 0
        this._ebo = 0
    }

    async setup(gl)
    {

        await this.setup_buffer(gl)

        // await this.setup_material(gl)

    }

    async setup_buffer(gl)
    {
        //先拼成一个大数组
        const total_size = this.vertices.reduce((prev, item) => item.buffer.byteLength + prev, 0)
        const buffer = new Uint8Array(total_size)

        let offset = 0

        this.vertices.forEach((item) =>
        {
            buffer.set(new Uint8Array(item.buffer), offset)
            offset += item.buffer.byteLength

        })

        this._vao = gl.createVertexArray();
        this._vbo = gl.createBuffer()
        this._ebo = gl.createBuffer()

        gl.bindVertexArray(this._vao)

        //todo handle vertices well
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo)
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ebo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(
            0,
            3,
            gl.FLOAT,
            false,
            this.vertices[0].buffer.byteLength,
            0);

        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(
            1,
            3,
            gl.FLOAT,
            false,
            this.vertices[0].buffer.byteLength,
            this.vertices[0].normals.byteOffset,
        );

        //coords
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(
            2,
            2,
            gl.FLOAT,
            false,
            this.vertices[0].buffer.byteLength,
            this.vertices[0].coords.byteOffset,
        );

        //
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(
            3,
            3,
            gl.FLOAT,
            false,
            this.vertices[0].buffer.byteLength,
            this.vertices[0].tangent.byteOffset,
        );

        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(
            4,
            3,
            gl.FLOAT,
            false,
            this.vertices[0].buffer.byteLength,
            this.vertices[0].bitangent.byteOffset,
        );

        // ids
        gl.enableVertexAttribArray(5);
        gl.vertexAttribPointer(
            5,
            4,
            gl.INT,
            false,
            this.vertices[0].buffer.byteLength,
            this.vertices[0].bones.byteOffset,
        );
        // weights
        gl.enableVertexAttribArray(6);
        gl.vertexAttribPointer(
            6,
            4,
            gl.FLOAT,
            false,
            this.vertices[0].buffer.byteLength,
            this.vertices[0].weights.byteOffset,
        );
    }

    /* eslint-disable no-unused-vars */
    draw(shader)
    {
        //这里需要设置diffuse 和 specular等
        //不考虑使用教程中的写法，而是使用数组

        const gl = shader.gl

        const indexes = {}
        const uniforms = shader.uniforms

        for (let i = 0; i < this.textures.length; ++i) 
        {
            const texture = this.textures[i]

            let uniform = uniforms.material[texture.type]
            if(uniform == null)
            {
                continue
            }

            if (uniform instanceof Array) //如果是数组
            {
                const index = indexes[texture.type] || 1

                uniform = uniform[index]
                indexes[texture.type] = index + 1
            }

            gl.activeTexture(gl[`TEXTURE${i}`])
            gl.uniform1i(uniform.location, i);
            gl.bindTexture(gl.TEXTURE_2D, texture.id);
        }

        gl.bindVertexArray(this._vao)

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0)
        gl.bindVertexArray(null)
    }
}