import utils from "../utils"
import shader from "./shader"

const vec3 = glMatrix.vec3
const mat4 = glMatrix.mat4

export default async function (gl, width, height)
{
    const simple_shader = utils.load_shader(gl, shader)

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer()
    const ebo = gl.createBuffer()

    gl.bindVertexArray(vao);

    {
        const vertices = [
            -0.5, -0.5, -0.5, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            -0.5, 0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0,

            -0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 0.5, 1.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,

            -0.5, 0.5, 0.5, 1.0, 0.0,
            -0.5, 0.5, -0.5, 1.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,
            -0.5, 0.5, 0.5, 1.0, 0.0,

            0.5, 0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, -0.5, 1.0, 1.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,

            -0.5, 0.5, -0.5, 0.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0,
            -0.5, 0.5, 0.5, 0.0, 0.0,
            -0.5, 0.5, -0.5, 0.0, 1.0
        ]

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW);

        // 告诉gpu如何解析这个数据
        gl.vertexAttribPointer(
            simple_shader.attributes.aPos.location,
            3,
            gl.FLOAT,
            false,
            20,
            0);

        gl.vertexAttribPointer(
            simple_shader.attributes.aTexCoord.location,
            2,
            gl.FLOAT,
            false,
            20,
            12);

        // 顶点属性默认是禁用的，所以这里需要开启
        gl.enableVertexAttribArray(
            simple_shader.attributes.aPos.location,
        );

        gl.enableVertexAttribArray(
            simple_shader.attributes.aTexCoord.location,
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

    // gl.bindVertexArray(0);

    const images = await utils.load_images(["container.jpg", "awesomeface.png"])
    const textures = []
    {
        for (let i = 0; i < images.length; ++i)
        {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);      //表示将t轴反过来
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);

            gl.generateMipmap(gl.TEXTURE_2D);

            textures.push(texture)
        }

        gl.useProgram(simple_shader.program)

        //告诉gpu uniform 绑定到哪个纹理单元的编号
        gl.uniform1i(simple_shader.uniforms.texture1.location, 0);
        gl.uniform1i(simple_shader.uniforms.texture2.location, 1);

    }

    //每个立方体的位置
    const cubePositions = [
        [0.0, 0.0, 0.0],
        [2.0, 5.0, -15.0],
        [-1.5, -2.2, -2.5],
        [-3.8, -2.0, -12.3],
        [2.4, -0.4, -3.5],
        [-1.7, 3.0, -7.5],
        [1.3, -2.0, -2.5],
        [1.5, 2.0, -2.5],
        [1.5, 0.2, -1.5],
        [-1.3, 1.0, -1.5],
    ]

    const camera_position = [0, 0, 3]       //摄像头的位置
    const camera_front = [0, 0, -1]         //摄像头指向目标的方向向量，那么camera + front = target\
    const camera_up = [0, 1, 0]             //向上的向量

    let fov = 45.0

    const speed = 2.5
    const sensitivity = 0.05                 //鼠标灵敏度

    let last_mouse = null
    let pitch = 0
    let yaw = -90

    camera_front[0] = (Math.cos(utils.radians(pitch)) * Math.cos(utils.radians(yaw)))
    camera_front[1] = Math.sin(utils.radians(pitch))
    camera_front[2] = (Math.cos(utils.radians(pitch)) * Math.sin(utils.radians(yaw)))

    vec3.normalize(camera_front, camera_front)

    function handle_events(dt, inputs)
    {
        const distance = speed * dt / 1000

        if (inputs.mouses[0])       //鼠标左键
        {
            if (last_mouse == null)
            {
                last_mouse = { x: inputs.event.x, y: inputs.event.y }
            }
            else
            {
                const event = inputs.event

                const xoffset = event.x - last_mouse.x
                const yoffset = last_mouse.y - event.y

                if (xoffset != 0 && yoffset != 0)
                {
                    yaw += xoffset * sensitivity
                    pitch += yoffset * sensitivity

                    if (pitch > 89.0)
                        pitch = 89.0;
                    if (pitch < -89.0)
                        pitch = -89.0;

                    camera_front[0] = (Math.cos(utils.radians(pitch)) * Math.cos(utils.radians(yaw)))
                    camera_front[1] = Math.sin(utils.radians(pitch))
                    camera_front[2] = (Math.cos(utils.radians(pitch)) * Math.sin(utils.radians(yaw)))

                    vec3.normalize(camera_front, camera_front)

                    last_mouse = { x: inputs.event.x, y: inputs.event.y }
                }
            }

        }
        else 
        {
            last_mouse = null
        }

        if (inputs.keys.ArrowUp)
        {
            if (inputs.ctrl)
            {
                vec3.add(camera_position, camera_position, [distance * camera_front[0], distance * camera_front[1], distance * camera_front[2]])
            }
            else
            {
                vec3.add(camera_position, camera_position, [distance * camera_up[0], distance * camera_up[1], distance * camera_up[2]])
            }
        }

        if (inputs.keys.ArrowDown)
        {
            if (inputs.ctrl)
            {
                vec3.add(camera_position, camera_position, [-distance * camera_front[0], -distance * camera_front[1], -distance * camera_front[2]])
            }
            else
            {
                vec3.add(camera_position, camera_position, [-distance * camera_up[0], -distance * camera_up[1], -distance * camera_up[2]])
            }
        }

        //右向量
        const right = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), camera_front, camera_up))

        if (inputs.keys.ArrowRight)
        {
            vec3.add(camera_position, camera_position, [distance * right[0], distance * right[1], distance * right[2]])
        }

        if (inputs.keys.ArrowLeft)
        {
            vec3.add(camera_position, camera_position, [-distance * right[0], -distance * right[1], -distance * right[2]])
        }

        if (inputs.scroll)
        {
            if (fov >= 1.0 && fov <= 45.0)
                fov -= inputs.scroll;
            if (fov <= 1.0)
                fov = 1.0;
            if (fov >= 45.0)
                fov = 45.0;
        }
    }

    return (dt, total, inputs) =>
    {
        //将纹理放到纹理单元中的对应位置,又加上之前设置过了uniform 对应的纹理单元
        for (let i = 0; i < textures.length; ++i)
        {
            const texture = textures[i]

            gl.activeTexture(gl[`TEXTURE${i}`])
            gl.bindTexture(gl.TEXTURE_2D, texture);
        }

        handle_events(dt, inputs)

        gl.useProgram(simple_shader.program)

        gl.bindVertexArray(vao);

        {   // 摄像机围绕
            const view = mat4.create()      //观察矩阵，用于摄像机

            //lookAt：out,position,target,up
            mat4.lookAt(view, camera_position, vec3.add(vec3.create(), camera_position, camera_front), camera_up)

            gl.uniformMatrix4fv(simple_shader.uniforms.view.location, false, view);
        }

        {//投影矩阵
            const projection = mat4.create()

            mat4.perspective(projection, utils.radians(fov), width / height, 0.1, 100.0);

            gl.uniformMatrix4fv(simple_shader.uniforms.projection.location, false, projection);
        }

        for (let i = 0; i < cubePositions.length; ++i)
        {
            const position = cubePositions[i]

            const model = mat4.create()     //局部空间

            // 立方体 移动 + 旋转不同方向
            mat4.translate(model, model, position)
            mat4.rotate(model, model, utils.radians(20 * i), [1, 0.3, 0.5])

            gl.uniformMatrix4fv(simple_shader.uniforms.model.location, false, model);

            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }
    }
}