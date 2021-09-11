import utils from "../../utils"

const vec3 = glMatrix.vec3
const mat4 = glMatrix.mat4

export default class Camera
{
    constructor(context)
    {
        this.context = context
        this.position = {
            x: 0,
            y: 0,
            z: 0
        }

        this.front = [0, 0, -1]         //摄像头指向目标的方向向量，那么camera + front = target
        this.up = [0, 1, 0]             //向上的向量
        this.fov = 45
        this.pitch = 0
        this.yaw = -90

        this.view = mat4.create()
        this.projection = mat4.create()
    }

    async setup()
    {
        // this.setup_front()

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
        const from = [this.position.x, this.position.y, this.position.z]
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

    update()
    {
        // this.setup_front()

        this.setup_view()
        this.setup_projection()
    }

    lookat(target)
    {
        this.lookat_position(target.position)
    }

    lookat_position(position)
    {
        const from = [this.position.x, this.position.y, this.position.z]
        const to = [position.x, position.y, position.z]

        vec3.sub(this.front,to,from)        //target - from = up

        // vec3.normalize(this.front,this.front)

        mat4.lookAt(this.view,
            from,
            to, 
            this.up)
    }
}