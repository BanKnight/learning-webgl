const mat4 = glMatrix.mat4
const vec3 = glMatrix.vec3

import utils from "../../utils"

export default class Element
{
    constructor(context)
    {
        this.context = context
        this.scale = vec3.create(1, 1, 1)
        this.position = vec3.create()
        this.model = mat4.create()

        this.material = null

        this.vao = null
        this.camera = null
        this.shader = null
        this.lights = null
    }

    set_position(x, y, z)
    {
        vec3.set(this.position, x, y, z)
    }

    set_scale(x, y, z)
    {
        vec3.set(this.scale, x, y, z)
    }

    async setup()
    {

    }

    /* eslint-disable no-unused-vars */
    update(dt)
    {
        this.update_model()
    }

    render()
    {
        this.prepare_model()

        this.draw()
    }

    update_model()
    {
        mat4.identity(this.model)
        mat4.translate(this.model, this.model, this.position)

        mat4.rotate(this.model, this.model, this.context.now / 1000 * utils.radians(55), [1, 1, 1])
        mat4.scale(this.model, this.model, this.scale)
    }

    prepare_model()
    {
        this.context.gl.uniformMatrix4fv(this.shader.uniforms.model.location, false, this.model);
    }

    draw()
    {
        console.log("empty draw")
    }
}