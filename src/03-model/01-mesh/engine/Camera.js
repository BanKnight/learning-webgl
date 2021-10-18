import utils from "../../../utils"

const vec3 = glMatrix.vec3
const mat4 = glMatrix.mat4

export default class Camera
{
    constructor(context)
    {
        this.context = context
        this.position = vec3.create()

        this.front = [0, 0, -1]         //摄像头指向目标的方向向量，那么camera + front = target
        this.up = [0, 1, 0]             //向上的向量
        this.fov = 45
        this.pitch = 0
        this.yaw = -90

        this.view = mat4.create()
        this.projection = mat4.create()
    }

    set_position(x, y, z)
    {
        vec3.set(this.position, x, y, z)
    }

    async setup()
    {
        this.setup_front()

        this.setup_view()
        this.setup_projection()
    }

    setup_front()
    {
        this.front[0] = (Math.cos(utils.radians(this.pitch)) * Math.cos(utils.radians(this.yaw)))
        this.front[1] = Math.sin(utils.radians(this.pitch))
        this.front[2] = (Math.cos(utils.radians(this.pitch)) * Math.sin(utils.radians(this.yaw)))

        vec3.normalize(this.front, this.front)
    }

    setup_view()
    {
        const from = this.position
        const to = vec3.add(vec3.create(), from, this.front)

        mat4.lookAt(this.view,
            from,
            to,
            this.up)
    }

    setup_projection()
    {
        mat4.perspective(this.projection,
            utils.radians(this.fov),
            this.context.width / this.context.height,
            0.1, 100.0);
    }

    prepare(shader)
    {
        const gl = this.context.gl

        if (shader.uniforms.view)
        {
            gl.uniformMatrix4fv(shader.uniforms.view.location, false, this.view);
        }
        if (shader.uniforms.projection)
        {
            gl.uniformMatrix4fv(shader.uniforms.projection.location, false, this.projection);
        }
        if (shader.uniforms.viewPos)
        {
            gl.uniform3fv(shader.uniforms.viewPos.location, this.position);
        }
    }

    update()
    {
        this.setup_front()
        this.setup_view()
        this.setup_projection()
    }

    lookAt(target)
    {
        this.lookAtPosition(target.position)
    }

    lookAtPosition(position)
    {
        vec3.sub(this.front, position, this.position)

        vec3.normalize(this.front, this.front)
    }

    move(direction, distance)
    {
        switch (direction)
        {
            case "forward":
                {
                    vec3.add(this.position, this.position, [distance * this.front[0], distance * this.front[1], distance * this.front[2]])

                }
                break
            case "backward":
                {
                    vec3.add(this.position, this.position, [-distance * this.front[0], -distance * this.front[1], -distance * this.front[2]])

                }
                break
            case "right":
                {
                    const right = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.front, this.up))
                    vec3.add(this.position, this.position, [distance * right[0], distance * right[1], distance * right[2]])

                }
                break
            default:
                {
                    const right = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.front, this.up))
                    vec3.add(this.position, this.position, [-distance * right[0], -distance * right[1], -distance * right[2]])

                }
                break
        }
    }

    turn(xoffset, yoffset)
    {
        this.yaw += xoffset
        this.pitch += yoffset

        if (this.pitch > 89.0)
            this.pitch = 89.0;
        if (this.pitch < -89.0)
            this.pitch = -89.0;

        this.front[0] = (Math.cos(utils.radians(this.pitch)) * Math.cos(utils.radians(this.yaw)))
        this.front[1] = Math.sin(utils.radians(this.pitch))
        this.front[2] = (Math.cos(utils.radians(this.pitch)) * Math.sin(utils.radians(this.yaw)))

        vec3.normalize(this.front, this.front)
    }

    scroll(offset)
    {
        this.fov -= offset;

        if (this.fov <= 1.0)
            this.fov = 1.0;
        if (this.fov >= 45.0)
            this.fov = 45.0;
    }
}