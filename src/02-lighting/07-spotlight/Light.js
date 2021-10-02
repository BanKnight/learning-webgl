
import Element from "./Element"

const vec3 = glMatrix.vec3

export default class Light extends Element
{
    constructor(context)
    {
        super(context)

        this.direction = vec3.create()
        this.ambient = vec3.create()
        this.diffuse = vec3.create()
        this.specular = vec3.create()

        this.cutOff = 0
        this.outerCutOff = 0

        this.constant = 1;
        this.linear = 0.045;
        this.quadratic = 0.0075;
    }

    draw()
    {
        
    }

    set_direction(x,y,z)
    {
        vec3.set(this.direction,x,y,z)
    }
}