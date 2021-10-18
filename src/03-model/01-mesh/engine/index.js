import Model from "./Model"
import Mtl from "./Mtl"
import Res from "./Res"
import Shaders from "./Shaders"

export Camera from "./Camera"
export Light from "./Light"

class Engine
{
    constructor(context)
    {
        this.gl = context.gl
        this.context = context
        this.res = new Res(this.gl)
        this.shaders = new Shaders(this.gl)
    }

    async load_mtl(url)
    {
        const mtl = new Mtl(this.res)

        await mtl.load(url)

        return mtl
    }

    async load_model(url,mtl)
    {
        const model = new Model(this.res)

        await model.load(url,mtl)

        return model
    }
}

export default Engine

