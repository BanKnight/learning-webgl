const vec3 = glMatrix.vec3

export default class Light
{
    constructor()
    {
        this.direction = vec3.create()
        this.ambient = vec3.create()
        this.diffuse = vec3.create()
        this.specular = vec3.create()
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

    set_direction(x,y,z)
    {
        vec3.set(this.direction,x,y,z)
    }

    prepare(shader)
    {
        const gl = shader.gl
        const uniform = shader.uniforms.light

        if(uniform == null)
        {
            return
        }

        gl.uniform3fv(uniform.direction.location, this.direction);
        gl.uniform3fv(uniform.ambient.location, this.ambient);
        gl.uniform3fv(uniform.diffuse.location, this.diffuse);
        gl.uniform3fv(uniform.specular.location, this.specular);
    }
}