const mat4 = glMatrix.mat4

export default class Element
{
    constructor(context)
    {
        this.context = context
        this.position = {
            x: 0,
            y: 0,
            z: 0
        }
        this.scale = {
            x: 1,
            y: 1,
            z: 1
        }

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
        const gl = this.context.gl

        gl.useProgram(this.shader.program)

        this.update_model(gl)
        this.update_camera(gl)
        this.update_light(gl)

        this.draw(dt)
    }

    update_model(gl)
    {
        mat4.identity(this.model)
        mat4.translate(this.model, this.model, [this.position.x, this.position.y, this.position.z])
        mat4.scale(this.model, this.model, [this.scale.x, this.scale.y, this.scale.z])

        gl.uniformMatrix4fv(this.shader.uniforms.model.location, false, this.model);
    }

    update_camera(gl)
    {
        {
            const view = this.camera.view

            gl.uniformMatrix4fv(this.shader.uniforms.view.location, false, view);
        }

        {
            const projection = this.camera.projection

            gl.uniformMatrix4fv(this.shader.uniforms.projection.location, false, projection);
        }
        if(this.shader.uniforms.viewPos)
        {
            const position = this.camera.position

            gl.uniform3fv(this.shader.uniforms.viewPos.location, [position.x,position.y,position.z]);
        }
    }
    update_light(gl)
    {
        if(this.light == null)
        {
            return
        }

        {
            const color = this.light.color

            gl.uniform3fv(this.shader.uniforms.light.location, [color.r / 255, color.g / 255, color.b / 255]);
        }

        {
            const position = this.light.position

            gl.uniform3fv(this.shader.uniforms.lightPos.location, [position.x,position.y,position.z]);
        }
    }


    draw(/* dt */)
    {
        console.log("empty draw")
    }
}