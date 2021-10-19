import * as KeyCode from 'keycode-js';

import Engine, { Camera, Light } from "./engine"
import model_vs from "./shaders/model.vs"
import model_fs from "./shaders/model.fs"

const mat4 = glMatrix.mat4
// const vec3 = glMatrix.vec3

export default async function (context)
{
    context.color.r = 0.1
    context.color.g = 0.1
    context.color.b = 0.1

    const engine = new Engine(context)
    const shaders = engine.shaders
    const shader = shaders.add("model", model_vs, model_fs)

    const camera = new Camera(context)

    {
        camera.set_position(0, 5, 30)
        camera.lookAtPosition([0, 0, 0])

        camera.setup()
    }

    const mtl = await engine.load_mtl("/nanosuit/nanosuit.mtl")
    const model = await engine.load_model("/nanosuit/nanosuit.obj", mtl)

    await model.setup()

    const model_mat = mat4.create()
    {
        mat4.translate(model_mat, model_mat, [0, 0, 0])

    }

    const light = new Light()
    {//平行光

        light.set_direction(-0.2, -1.0, -0.3)
        light.set_ambient(1, 1, 1)
        light.set_diffuse(1, 1, 1)
        light.set_specular(0.5, 0.5, 0.5)
    }

    const speed = 8
    const sensitivity = 0.1                 //鼠标灵敏度

    let last_mouse = null

    function update_event(dt)
    {
        const inputs = context.inputs
        const distance = speed * dt / 1000

        if (inputs.mouses[0])       //鼠标左键
        {
            const event = inputs.event

            if (event)
            {
                if (last_mouse == null)
                {
                    last_mouse = { x: event.x, y: event.y }
                }

                const xoffset = (event.x - last_mouse.x) * sensitivity
                const yoffset = (last_mouse.y - event.y) * sensitivity

                camera.turn(xoffset, yoffset)

                last_mouse = { x: event.x, y: event.y }
            }
        }
        else if (last_mouse)
        {
            last_mouse = null
        }

        if (inputs.codes[KeyCode.CODE_W])
        {
            camera.move("forward", distance)
        }

        if (inputs.codes[KeyCode.CODE_S])
        {
            camera.move("backward", distance)
        }

        if (inputs.codes[KeyCode.CODE_D])
        {
            camera.move("right", distance)
        }

        if (inputs.codes[KeyCode.CODE_A])
        {
            camera.move("left", distance)
        }

        if (inputs.scroll)
        {
            camera.scroll(inputs.scroll)
        }

        camera.update(dt)
    }

    /* eslint-disable no-unused-vars */
    return (dt) =>
    {
        update_event(dt)

        shader.use()

        context.gl.uniformMatrix4fv(shader.uniforms.model.location, false, model_mat);

        camera.prepare(shader)
        light.prepare(shader)
        model.draw(shader)
    }
}