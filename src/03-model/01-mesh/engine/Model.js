
import Mesh from "./Mesh"
import Texture from "./Texture"
import Vertex from "./Vertex"

const delimiter_pattern = /\s+/;

function check_vector(container,len)
{
    if(container.length != len)
    {
        throw new Error("length not valid")
    }

    for(let i = 0;i < len;++i)
    {
        if(container[i] == null)
        {
            throw new Error("item not right")
        }
    }
}

export default class Model
{
    constructor(res)
    {
        this.gl = res.gl
        this.res = res
        this.meshes = []
    }

    async setup()
    {
        for (const mesh of this.meshes)
        {
            await mesh.setup(this.gl)
        }
    }

    draw(shader)
    {
        for (const mesh of this.meshes)
        {

            mesh.draw(shader)


        }
    }
    async fetch(url)
    {
        const response = await fetch(url)

        return response.text()
    }
    async load(url, material)
    {
        const content = await this.fetch(url)

        const obj = this.parse(content)

        obj.directory = url.substring(0, url.lastIndexOf("/"))

        await this.convert(obj, material)
    }

    parse(content)
    {
        const obj = {
            mtl: null,
            children: [],
            vertices: [],
            normals: [],
            colors: [],
            uvs: [],
        }
        let child = null

        const lines = content.split("\n")
        for (let line of lines)
        {
            line = line.trim()
            const pos = line.indexOf(' ');
            let key = pos >= 0 ? line.substring(0, pos) : line;
            let value = pos >= 0 ? line.substring(pos + 1) : '';

            switch (key)
            {
                case "#": continue
                case "mtllib":
                    obj.mtl = value
                    break
                case "o":
                    {
                        child = {
                            name: value,
                            faces: [],
                            smooth: false
                        }

                        obj.children.push(child)

                    }
                    break
                case "v":
                    {
                        const ss = value.split(delimiter_pattern, 3);
                        const array = ss.map(parseFloat)

                        check_vector(array,3)

                        obj.vertices.push(array)
                    }
                    break
                case "vt":
                    {
                        const ss = value.split(delimiter_pattern, 3);

                        const array = ss.map(parseFloat)

                        check_vector(array,2)

                        obj.uvs.push(array)
                    }
                    break
                case "vn":
                    {
                        const ss = value.split(delimiter_pattern, 3);

                        const array = ss.map(parseFloat)

                        check_vector(array,3)

                        obj.normals.push(array)
                    }
                    break
                case "f":
                    {
                        const ss = value.split(delimiter_pattern, 3);

                        for (const one of ss)
                        {
                            const face = one.split("/").map(parseFloat)

                            check_vector(face,3)

                            child.faces.push(face)
                        }
                    }
                    break
                case "usemtl":
                    {
                        child.material = value
                    }
                    break
                case "s":
                    {
                        child.smooth = value !== '0' && value !== 'off';
                    }
                    break

            }
        }

        return obj
    }

    async convert(obj, mtl)
    {

        for (const child of obj.children)
        {

            const mesh = new Mesh()

            mesh.name = child.name

            for (const face of child.faces)
            {
                this.add_vertx(obj, mesh, face)
            }

            mesh.material = mtl.materials[child.material]

            await this.load_material(mesh, obj.directory)

            this.meshes.push(mesh)
        }
    }

    add_vertx(obj, mesh, face)
    {

        const position_index = face[0] > 0 ? face[0] - 1 : obj.vertices.length + face[0]
        const coords_index = face[1] > 0 ? face[1] - 1 : obj.uvs.length + face[1]
        const normal_index = face[2] > 0 ? face[2] - 1 : obj.normals.length + face[2]

        const vertex = new Vertex()

        vertex.position.set(obj.vertices[position_index])
        vertex.coords.set(obj.uvs[coords_index])
        vertex.normals.set(obj.normals[normal_index])

        mesh.vertices.push(vertex)
        mesh.indices.push(mesh.indices.length)
    }

    async load_material(mesh, directory)
    {
        const material = mesh.material
        if (material == null)
        {
            return
        }

        const urls = []

        for (const type in material.maps)
        {
            const url = material.maps[type]

            urls.push(`${directory}/${url}`)

            const texture = new Texture()

            texture.type = type
            texture.path = url

            mesh.textures.push(texture)
        }

        const images = await this.res.load_images(urls)

        for (let i = 0; i < images.length; ++i)
        {
            const texture = mesh.textures[i]

            texture.id = images[i]
        }
    }
}