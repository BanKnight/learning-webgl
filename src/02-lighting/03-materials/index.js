import * as KeyCode from 'keycode-js';

import shaders from "./shaders";
import Cube from "./Cube"
import Camera from "./Camera"
import Light from "./Light";

import utils from "../../utils"

export default async function (context)
{
    let gl = context.gl

    shaders.setup(gl)

    const camera = new Camera(context)

    {
        camera.position[0] = 0
        camera.position[1] = 0
        camera.position[2] = 3
    }

    const light = new Light(context)
    {
        light.camera = camera

        light.position[0] = 0
        light.position[1] = 0
        light.position[2] = 0

        light.scale.x = 0.2
        light.scale.y = 0.2
        light.scale.z = 0.2

        light.set_color(1,1,1)

        light.specular[0] = 1.0
        light.specular[1] = 1.0
        light.specular[2] = 1.0

        light.setup()
    }

    const cubes = []

    for (let i = 0; i < 10; ++i)
    {
        const cube = new Cube(context)

        cube.camera = camera
        cube.light = light

        cube.position[0] = utils.random(-4, 4)
        cube.position[1] = utils.random(-4, 4)
        cube.position[2] = utils.random(-4, 4)

        const scale = utils.random(0.5, 1)

        cube.scale.x = scale
        cube.scale.y = utils.random(0.5, 1)
        cube.scale.z = scale

        cube.set_color(Math.random(), Math.random(), Math.random())

        cube.material.specular[0] = 0.5
        cube.material.specular[1] = 0.5
        cube.material.specular[2] = 0.5

        cube.material.shininess = 32.0

        await cube.setup()

        cubes.push(cube)
    }

    camera.lookAt(light)

    await camera.setup()

    context.color.r = 0
    context.color.g = 0.1
    context.color.b = 0.1

    const speed = 2.5
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
    }

    return (dt) =>
    {
        update_event(dt)

        camera.update(dt)

        {   //光源的颜色不断变化

            light.set_color(
                Math.sin(context.now / 1000 * 2.0) ,
                Math.sin(context.now / 1000 * 0.7) ,
                Math.sin(context.now / 1000 * 1.3))
        }

        light.update(dt)

        for (const cube of cubes)
        {
            cube.update(dt)
        }
    }
}

