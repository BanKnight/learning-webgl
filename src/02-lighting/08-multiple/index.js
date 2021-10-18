import * as KeyCode from 'keycode-js';

import shaders from "./shaders";
import res from "./res"

import Cube from "./Cube"
import Camera from "./Camera"
import Scene from "./Scene"
import { DirLight, PointLight, SpotLight } from "./lights";

import utils from "../../utils"

export default async function (context)
{
    let gl = context.gl

    shaders.setup(gl)
    res.setup(gl)

    context.res = res
    context.shaders = shaders

    const scene = new Scene(context)

    const camera = new Camera(context)
    {
        camera.set_position(0, 0, 3)
    }

    const dir = new DirLight(context)
    {   //平行光
        dir.set_direction(-0.2, -1.0, -0.3)
        dir.set_ambient(0.05,0.05,0.05)
        dir.set_diffuse(0.4, 0.4, 0.4)
        dir.set_specular(0.5,0.5,0.5)

        await dir.setup()

        scene.lights.dir = dir
    }

    const radius = 4

    //点光源
    for (let i = 0; i < 4; ++i)
    {
        const point = new PointLight(context)

        point.set_position(utils.random(-radius * 1.5, radius * 1.5),
            utils.random(-radius * 1.5, radius * 1.5),
            utils.random(-radius / 2, radius / 2))

        point.set_scale(0.2, 0.2, 0.2)

        point.set_ambient(0.05,0.05,0.05)
        point.set_diffuse(0.8, 0.8, 0.8)
        point.set_specular(1.0, 1.0, 1.0)

        point.constant = 1
        point.linear = 0.09
        point.quadratic = 0.032

        await point.setup()

        scene.lights.points.push(point)
    }
    const spot = new SpotLight(context)
    {
        spot.set_position(...camera.position)
        spot.set_direction(...camera.front)

        spot.set_ambient(1, 1, 1)
        spot.set_diffuse(1, 1, 1)
        spot.set_specular(1.0, 1.0, 1.0)

        spot.constant = 1
        spot.linear = 0.09
        spot.quadratic = 0.032

        spot.cutOff = Math.cos(utils.radians(12.5))
        spot.outerCutOff = Math.cos(utils.radians(15.0))

        await spot.setup()

        scene.lights.spot = spot
    }

    const count = 20
    for (let i = 0; i < count; ++i)
    {
        const cube = new Cube(context)

        cube.set_position(utils.random(-radius, radius),
            utils.random(-radius, radius),
            utils.random(-radius, radius))

        const scale = utils.random(0.5, 1)

        cube.set_scale(scale, utils.random(0.5, 1), scale)

        cube.material.shininess = 32.0

        await cube.setup()

        scene.nodes.push(cube)
    }

    camera.lookAt(scene.lights.points[0])

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

        spot.set_position(...camera.position)
        spot.set_direction(...camera.front)

        scene.update(dt)
        scene.render(camera)
    }
}

