import Light from "./Light"

const vec3 = glMatrix.vec3

export default class SpotLight extends Light
{
    constructor(context)
    {
        super(context)

        this.direction = vec3.create()

        this.cutOff = 0
        this.outerCutOff = 0

        this.constant = 1;
        this.linear = 0.045;
        this.quadratic = 0.0075;
    }

    prepare(uniform)
    {
        const gl = this.context.gl

        super.prepare(uniform)

        gl.uniform3fv(uniform.position.location, this.position);
        gl.uniform3fv(uniform.direction.location, this.direction);

        gl.uniform1f(uniform.cutOff.location, this.cutOff);
        gl.uniform1f(uniform.outerCutOff.location, this.outerCutOff);

        gl.uniform1f(uniform.constant.location, this.constant);
        gl.uniform1f(uniform.linear.location, this.linear);
        gl.uniform1f(uniform.quadratic.location, this.quadratic);
    }
    set_direction(x, y, z)
    {
        vec3.set(this.direction, x, y, z)
    }
}