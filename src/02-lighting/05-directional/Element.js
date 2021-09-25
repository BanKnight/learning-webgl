const mat4 = glMatrix.mat4
const vec3 = glMatrix.vec3

import utils from "../../utils"


export default class Element
{
    constructor(context)
    {
        this.context = context
        this.position = vec3.create()

        this.scale = {
            x: 1,
            y: 1,
            z: 1
        }

        this.material = null

        this.camera = null
        this.shader = null
        this.light = null

        this.model = mat4.create()
    }

    async setup()
    {

    }

    update(dt)
    {
        this.update_model()

        if (this.shader == null)
        {
            return
        }

        this.prepare_draw(dt)

        this.draw(dt)
    }

    update_model()
    {
        mat4.identity(this.model)
        mat4.translate(this.model, this.model, this.position)

        mat4.rotate(this.model, this.model, this.context.now / 1000 * utils.radians(55), [1, 1, 1])
        mat4.scale(this.model, this.model, [this.scale.x, this.scale.y, this.scale.z])
    }

    prepare_draw()
    {
        const gl = this.context.gl

        gl.useProgram(this.shader.program)

        this.prepare_model(gl)
        this.prepare_camera(gl)
        this.prepare_light(gl)
    }

    prepare_model(gl)
    {
        gl.uniformMatrix4fv(this.shader.uniforms.model.location, false, this.model);
    }

    prepare_camera(gl)
    {
        {
            const view = this.camera.view

            gl.uniformMatrix4fv(this.shader.uniforms.view.location, false, view);
        }

        {
            const projection = this.camera.projection

            gl.uniformMatrix4fv(this.shader.uniforms.projection.location, false, projection);
        }

        if (this.shader.uniforms.viewPos)
        {
            const position = this.camera.position

            gl.uniform3fv(this.shader.uniforms.viewPos.location, position);
        }
    }
    prepare_light(gl)
    {
        if (this.light == null)
        {
            return
        }

        {
            const direction = this.light.direction

            gl.uniform3fv(this.shader.uniforms["light.direction"].location, direction);
        }
        {
            gl.uniform3fv(this.shader.uniforms["light.ambient"].location, this.light.ambient);
            gl.uniform3fv(this.shader.uniforms["light.diffuse"].location, this.light.diffuse);
            gl.uniform3fv(this.shader.uniforms["light.specular"].location, this.light.specular);
        }
    }


    draw(/* dt */)
    {
        console.log("empty draw")
    }
}