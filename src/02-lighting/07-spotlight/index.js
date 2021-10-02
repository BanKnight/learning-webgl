import * as KeyCode from 'keycode-js';

import shaders from "./shaders";
import res from "./res"

import Cube from "./Cube"
import Camera from "./Camera"
import Light from "./Light";

import utils from "../../utils"

const vec3 = glMatrix.vec3

export default async function (context)
{
    let gl = context.gl

    shaders.setup(gl)
    res.setup(gl)

    context.res = res

    const camera = new Camera(context)

    {
        camera.position[0] = 0
        camera.position[1] = 0
        camera.position[2] = 3
    }

    const light = new Light(context)
    {
        light.camera = camera

        light.position[0] = 1.2
        light.position[1] = 1
        light.position[2] = 2

        light.scale.x = 0.2
        light.scale.y = 0.2
        light.scale.z = 0.2

        light.ambient[0] =  0.2
        light.ambient[1] = 0.2
        light.ambient[2] = 0.2

        light.diffuse[0] = 0.5
        light.diffuse[1] = 0.5
        light.diffuse[2] = 0.5

        light.specular[0] = 1.0
        light.specular[1] = 1.0
        light.specular[2] = 1.0

        light.cutOff = Math.cos(utils.radians(12.5))
        light.outerCutOff = Math.cos(utils.radians(17.5))

        light.constant = 1
        light.linear = 0.09
        light.quadratic = 0.032

        await light.setup()
    }

    const cubes = []

    const count = 20
    const radius = 4
    for (let i = 0; i < count; ++i)
    {
        const cube = new Cube(context)

        cube.camera = camera
        cube.light = light

        cube.position[0] = utils.random(-radius, radius)
        cube.position[1] = utils.random(-radius, radius)
        cube.position[2] = utils.random(-radius, radius)

        const scale = utils.random(0.5, 1)

        cube.scale.x = scale
        cube.scale.y = utils.random(0.5, 1)
        cube.scale.z = scale

        // cube.set_color(Math.random(), Math.random(), Math.random())

        cube.material.shininess = 64.0

        await cube.setup()

        cubes.push(cube)
    }

    camera.lookAt(light)

    await camera.setup()

    context.color.r = 0.1
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

        //将聚光灯设置成摄像头发出
        vec3.copy(light.direction,camera.front)
        vec3.copy(light.position,camera.position)

        light.update(dt)

        for (const cube of cubes)
        {
            cube.update(dt)
        }
    }
}

