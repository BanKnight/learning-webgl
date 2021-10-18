const vec3 = glMatrix.vec3

export default class Material
{
    constructor()
    {
        this.ambient = vec3.create()
        this.diffuse = vec3.create()
        this.specular = vec3.create()
        this.shiness = 0.0

        this.maps = {}
    }
}