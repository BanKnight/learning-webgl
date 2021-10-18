
class Shader
{
    constructor(gl)
    {
        this.gl = gl
        this.program = null
        this.attributes = {}
        this.uniforms = {}
    }

    setup(vs, fs)
    {
        if (this.compile(vs, fs) == false)
        {
            return
        }

        this.parse()

        return true
    }

    use()
    {
        this.gl.useProgram(this.program)
    }

    compile(vs, fs)
    {
        const gl = this.gl

        const vs_shader = this.compile_shader(gl.VERTEX_SHADER, vs)
        const fs_shader = this.compile_shader(gl.FRAGMENT_SHADER, fs)

        this.program = gl.createProgram();

        gl.attachShader(this.program, vs_shader);
        gl.attachShader(this.program, fs_shader);
        gl.linkProgram(this.program);

        // 创建失败， alert
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program));
            this.program = null
            return false;
        }

        gl.deleteShader(vs_shader);
        gl.deleteShader(fs_shader);

        return true
    }

    compile_shader(type, source)
    {

        const gl = this.gl
        const shader = gl.createShader(type);

        // Send the source to the shader object

        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    parse()
    {
        const gl = this.gl

        let count = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES)
        for (let i = 0; i < count; ++i)
        {

            const info = gl.getActiveAttrib(this.program, i)
            const array = info.name.split(".")

            const last_name = array.pop()

            let parent = this.attributes

            for (const one of array)
            {
                let exists = parent[one]
                if (exists == null)
                {
                    exists = {}
                    parent[one] = exists
                }
                parent = exists
            }

            parent[last_name] = {
                ...info,
                location: gl.getAttribLocation(this.program, info.name)
            }
        }

        count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)
        for (let i = 0; i < count; ++i)
        {
            const info = gl.getActiveUniform(this.program, i)

            const array = info.name.split(".")

            const last_name = array.pop()

            let parent = this.uniforms

            //example:pointLights[0].position
            for (const one of array)
            {
                const left = one.indexOf("[")
                const right = one.indexOf("]")

                let name = one
                let is_array = false

                if (right > left)    //array
                {
                    name = one.substring(0, left)
                    is_array = true
                }

                let exists = parent[name]
                if (exists == null)
                {
                    if (is_array)
                    {
                        exists = new Array()
                    }
                    else
                    {
                        exists = {}
                    }
                    parent[name] = exists
                }

                parent = exists

                if (is_array)
                {
                    let index = Number(one.substring(left + 1, right))

                    exists = parent[index]

                    if (exists == null)
                    {
                        exists = {}
                        parent[index] = exists
                    }
                    parent = exists
                }
            }

            parent[last_name] = {
                ...info,
                location: gl.getUniformLocation(this.program, info.name)
            }
        }
    }
}


export default class Shaders
{
    constructor(gl)
    {
        this.gl = gl
        this.items = {}
    }

    get(name)
    {
        return this.items[name]
    }

    add(name, vs, fs)
    {

        const shader = new Shader(this.gl)

        shader.setup(vs, fs)

        this.items[name] = shader

        return shader
    }
}