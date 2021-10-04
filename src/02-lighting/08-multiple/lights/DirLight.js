import Light from "./Light"

const vec3 = glMatrix.vec3

export default class DirLight extends Light
{
    constructor(context)
    {
        super(context)
        this.direction = vec3.create()
    }
    set_direction(x,y,z)
    {
        vec3.set(this.direction,x,y,z)
    }

    prepare(uniform)
    {
        const gl = this.context.gl

        super.prepare(uniform)

        gl.uniform3fv(uniform.direction.location, this.direction);
    }
}
