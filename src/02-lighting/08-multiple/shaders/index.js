import utils from "../../../utils"

const context = require.context("./",false,/\.(glsl|vs|fs|vert|frag)$/)
const files = {}

context.keys().forEach(path => {
    
    const relative = path.replace("./","")
    const dot_index = relative.lastIndexOf(".")

    if(dot_index == -1)
    {
        return
    }

    const name = relative.substring(0,dot_index)
    const ext = relative.substring(dot_index + 1)

    let exists = files[name]
    if(exists == null)
    {
        exists = {}
        files[name] = exists
    }

    exists[ext] = context(path).default
});

class Shaders
{
    constructor()
    {
        this.items = {}
    }

    setup(gl)
    {
        for(let name in files)
        {
            let file = files[name]
            
            const shader = utils.load_shader(gl,file)

            this.items[name] = shader
        }
    }
    get(name)
    {
        return this.items[name]
    }
}

export default new Shaders()