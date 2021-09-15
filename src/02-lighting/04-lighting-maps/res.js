import utils from "../../utils"

class Res
{
    constructor()
    {
        this.gl = null
        this.items = {}
    }

    setup(gl)
    {
        this.gl = gl
    }

    async load_image(path)
    {
        let exists = this.items[path]
        if(exists)
        {
            return exists
        }

        const images = await utils.load_images([path])
        const image = images[0]

        if(image == null)
        {
            return
        }

        const gl = this.gl

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);      //表示将t轴反过来
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
        
        this.items[path] = texture

        return texture
    }
}

export default new Res()