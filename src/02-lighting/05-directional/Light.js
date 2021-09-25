
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
    }

    draw()
    {
       
    }

    set_color(r, g, b, diffuse_factor = 0.5, ambient_factor = 0.2)
    {
        this.diffuse[0] = r  * diffuse_factor
        this.diffuse[1] = g  * diffuse_factor
        this.diffuse[2] = b  * diffuse_factor

        this.ambient[0] = r  * ambient_factor
        this.ambient[1] = r  * ambient_factor
        this.ambient[2] = r  * ambient_factor
    }

    set_direction(x,y,z)
    {
        vec3.set(this.direction,x,y,z)
    }
}