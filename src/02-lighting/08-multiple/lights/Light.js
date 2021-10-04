
import Element from "../Element"

const vec3 = glMatrix.vec3

export default class Light extends Element
{
    constructor(context)
    {
        super(context)

        this.ambient = vec3.create()
        this.diffuse = vec3.create()
        this.specular = vec3.create()
    }

    draw()
    {

    }

    set_ambient(x, y, z)
    {
        vec3.set(this.ambient, x, y, z)
    }
    set_diffuse(x, y, z)
    {
        vec3.set(this.diffuse, x, y, z)
    }

    set_specular(x, y, z)
    {
        vec3.set(this.specular, x, y, z)
    }

    prepare(uniform)
    {
        const gl = this.context.gl

        gl.uniform3fv(uniform.ambient.location, this.ambient);
        gl.uniform3fv(uniform.diffuse.location, this.diffuse);
        gl.uniform3fv(uniform.specular.location, this.specular);
    }
}