const mat4 = glMatrix.mat4

export default class Element
{
    constructor(context)
    {
        this.context = context
        this.position = {
            x:0,
            y:0,
            z:0
        }

        this.camera = null
        this.shader = null
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

        this.draw(dt)
    }

    update_model(gl)
    {
        mat4.identity(this.model)
        mat4.translate(this.model, this.model, [this.position.x,this.position.y,this.position.z])

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
    }

    draw(/* dt */)
    {
        console.log("empty draw")
    }
}