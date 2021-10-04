export default class Scene
{
    constructor(context)
    {
        this.context = context
        this.lights = {
            dir: null,
            points: [],
            spot: null,
        }

        this.nodes = []
    }

    async setup()
    {

    }

    update(dt)
    {
        this.lights.dir.update(dt)
        for (let light of this.lights.points)
        {
            light.update(dt)
        }

        this.lights.spot.update(dt)

        for (let node of this.nodes)
        {
            node.update(dt)
        }
    }

    render(camera)
    {
        // this.lights.dir.render(camera)

        for (let light of this.lights.points)
        {
            this.context.gl.useProgram(light.shader.program)

            this.prepare_camera(light.shader, camera)

            light.render(camera)
        }

        // this.lights.spot.render(camera)

        for (let node of this.nodes)
        {
            if (node.shader == null)
            {
                continue
            }

            this.context.gl.useProgram(node.shader.program)

            this.prepare_camera(node.shader, camera)
            this.prepare_lights(node.shader)

            node.render(camera)
        }
    }

    prepare_camera(shader, camera)
    {
        camera.prepare(shader)
    }

    prepare_lights(shader)
    {
        if (shader.uniforms.dirLight)
        {
            this.lights.dir.prepare(shader.uniforms.dirLight)
        }

        if (shader.uniforms.pointLights)
        {
            for (let i = 0; i < this.lights.points.length; ++i)
            {
                const uniform = shader.uniforms.pointLights[i]
                const light = this.lights.points[i]
                if (uniform && light)
                {
                    light.prepare(uniform)
                }
            }
        }
        if (shader.uniforms.spotLight)
        {
            this.lights.spot.prepare(shader.uniforms.spotLight)
        }
    }
}