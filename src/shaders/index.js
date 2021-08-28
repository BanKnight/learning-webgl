

const ctx = require.context('./', true, /\.js$/)
const files = {}
for (const key of ctx.keys())
{
    if (key.indexOf("index.js") >= 0)
    {
        continue
    }
    const keyArr = key.split('/')
    keyArr.shift() // 移除.
    files[keyArr.join('.').replace(/\.js$/g, '')] = ctx(key)
}

module.exports = function (gl, name)
{
    const file = files[name]

    const shader = {
        name: name,
        program: load_program(gl, file.vs, file.fs),
        attributes: {},
        uniforms: {},
    }

    let count = gl.getProgramParameter(shader.program, gl.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < count; ++i)
    {
        const info = gl.getActiveAttrib(shader.program, i)

        shader.attributes[info.name] = {
            ...info,
            location: gl.getAttribLocation(shader.program, info.name)
        }
    }

    count = gl.getProgramParameter(shader.program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < count; ++i)
    {
        const info = gl.getActiveUniform(shader.program, i)

        shader.uniforms[info.name] = {
            ...info,
            location: gl.getUniformLocation(shader.program, info.name)
        }
    }

    return shader
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
