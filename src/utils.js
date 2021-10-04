exports.load_shader = function (gl, sources)
{
    const shader = {
        program: load_program(gl, sources.vs, sources.fs),
        attributes: {},
        uniforms: {},
    }

    let count = gl.getProgramParameter(shader.program, gl.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < count; ++i)
    {
        const info = gl.getActiveAttrib(shader.program, i)
        const array = info.name.split(".")

        const last_name = array.pop()

        let parent = shader.attributes

        for(const one of array)
        {
            let exists = parent[one]
            if(exists == null)
            {
                exists = {}
                parent[one] = exists
            }
            parent = exists
        }

        parent[last_name] = {
            ...info,
            location: gl.getAttribLocation(shader.program, info.name)
        }
    }

    count = gl.getProgramParameter(shader.program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; ++i)
    {
        const info = gl.getActiveUniform(shader.program, i)

        const array = info.name.split(".")

        const last_name = array.pop()

        let parent = shader.uniforms

        //example:pointLights[0].position
        for(const one of array)
        {
            const left = one.indexOf("[")
            const right = one.indexOf("]")

            let name = one
            let is_array = false

            if(right > left)    //array
            {
                name = one.substring(0,left)
                is_array = true
            }

            let exists = parent[name]
            if(exists == null)
            {
                if(is_array)
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

            if(is_array)
            {
                let index = Number(one.substring(left + 1,right))

                exists = parent[index]

                if(exists == null)
                {
                    exists = {}
                    parent[index] = exists
                }
                parent = exists
            }
        }

        parent[last_name] = {
            ...info,
            location: gl.getUniformLocation(shader.program, info.name)
        }
    }

    return shader
}

exports.load_image = function (url)
{
    return new Promise((resolve) =>
    {
        const img = new Image()

        img.src = url
        img.onload = () =>resolve(img)
    })
}

exports.load_images = function (urls)
{
    return new Promise((resolve) =>
    {
        const images = []
        let done = 0
        for (const url of urls)
        {
            const img = new Image()

            img.src = url
            img.onload = () =>
            {
                done++
                if (done == images.length)
                {
                    resolve(images)
                }
            }
            images.push(img)
        }
    })
}

exports.radians = function (angle)
{
    return angle / 180 * Math.PI
}

function load_program(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // 创建着色器程序
    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // 创建失败， alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return shaderProgram;
}

function loadShader(gl, type, source)
{
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

exports.random = function (min, max)
{
    const interval = max - min

    return min + Math.random() * interval
}