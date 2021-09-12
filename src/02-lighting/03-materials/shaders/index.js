import utils from "../../../utils"

const context = require.context("./",false,/\.js$/)
const files = {}

context.keys().forEach(path => {
    if(path.indexOf("./index.js") == -1)
    {
        const name = path.replace(/^\.\/|.js$/g,"")
        files[name] = context(path).default
    }
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