import Material from "./Material"

const vec3 = glMatrix.vec3

const ALIAS = {
    ka: "ambient",
    kd: "diffuse",
    ks: "specular",
    map_kd: "diffuse",
    map_bump: "bump",
    map_ks: "specular",
    map_ke: "emissive",
    map_d: "alpha",
    norm: "normal",
}


export default class Mtl
{
    constructor(res)
    {
        this.gl = res.gl
        this.res = res
        this.materials = {}
    }

    async setup()
    {

    }
    async fetch(url)
    {
        const response = await fetch(url)

        return response.text()
    }

    async load(url, options)
    {

        const delimiter_pattern = /\s+/;

        const content = await this.fetch(url)
        const lines = content.split("\n")

        let material = null
        for (let line of lines)
        {
            line = line.trim()
            if (line.length == 0 || line.charAt(0) == "#")
            {
                continue
            }

            const pos = line.indexOf(' ');
            let key = pos >= 0 ? line.substring(0, pos) : line;
            let value = pos >= 0 ? line.substring(pos + 1) : '';

            key = key.toLowerCase();
            value = value.trim();

            switch (key)
            {
                case "newmtl":
                    {
                        material = new Material()
                        this.materials[value] = material
                    }
                    break
                case "d":
                {
                    const n = parseFloat( value );

					if ( n < 1 ) {

						material.opacity = n;
						material.transparent = true;

					}
                }
                    break
                case "ns":
                    {
                        material.shiness = parseFloat(value)
                    }
                    break
                case "ka":
                case "kd":
                case "ks":
                    {
                        const alias = ALIAS[key]
                        const prop = material[alias]

                        const ss = value.split(delimiter_pattern, 3);
                        vec3.set(prop, parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2]))

                        if (options && options.normalizeRGB)
                        {
                            vec3.set(prop, prop[0] / 255, prop[1] / 255, prop[2] / 255)
                        }
                    }
                    break
                default:    //map_xx
                    {
                        const alias = ALIAS[key]
                        if(alias)
                        {
                            material.maps[alias] = value
                        }
                    }
            }
        }
    }
}