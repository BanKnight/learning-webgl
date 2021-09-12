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
    const light = new Light(context)
    {
        light.color.r = 255
        light.color.g = 255
        light.color.b = 255

        light.camera = camera

        light.position.x = 0
        light.position.y = 0
        light.position.z = 0

        light.scale.x = 0.2
        light.scale.y = 0.2
        light.scale.z = 0.2

        light.setup()
    }

    const cubes = []

    for (let i = 0; i < 10; ++i)
    {
        const cube = new Cube(context)

        cube.camera = camera
        cube.light = light

        cube.color.r = utils.random(100, 255)
        cube.color.g = utils.random(100, 255)
        cube.color.b = utils.random(100, 255)

        cube.position.x = utils.random(-4, 4)
        cube.position.y = utils.random(-4, 4)
        cube.position.z = utils.random(-4, 4)

        const scale = utils.random(0.5, 1)

        cube.scale.x = scale
        cube.scale.y = scale
        cube.scale.z = scale

        await cube.setup()

        cubes.push(cube)
    }

    await camera.setup()

    context.color.r = 0
    context.color.g = 0.1
    context.color.b = 0.1

    return (dt) =>
    {
        {   //摄像头围绕原点旋转
            const radius = 10.0;

            camera.position.x = Math.sin(context.now / 1000) * radius;
            camera.position.z = Math.cos(context.now / 1000) * radius;

            camera.lookat_position({ x: 0, y: 0, z: 0 })

            camera.update(dt)

        }

        {   //光源的颜色不断变化
            light.color.g = (Math.sin(context.now / 1000) / 2.0 + 0.5) * 255
        }

        light.update(dt)

        for (const cube of cubes)
        {
            cube.update(dt)
        }
    }
}