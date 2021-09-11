import shaders from "./shaders";
import Cube from "./Cube"
import Camera from "./Camera"

export default async function(context)
{
    let gl = context.gl

    shaders.setup(gl)

    const camera = new Camera(context)

    const radius = 10.0;

    camera.position.x = Math.sin(90) * radius;
    camera.position.z = Math.cos(90) * radius;

    const cube = new Cube(context)

    cube.color.r = 0
    cube.color.g = 0
    cube.color.b = 100
    cube.camera = camera

    camera.lookat(cube)

    await cube.setup()
    await camera.setup()

    return (dt)=>
    {
        const radius = 10.0;

        camera.position.x = Math.sin(context.now / 1000) * radius;
        camera.position.z = Math.cos(context.now / 1000) * radius;

        camera.lookat(cube)

        camera.update(dt)
        cube.update(dt)
    }
} 