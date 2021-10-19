
import Mesh from "./Mesh"
import Texture from "./Texture"
import Vertex from "./Vertex"

const delimiter_pattern = /\s+/;

function check_vector(container, len)
{
    if (container.length != len)
    {
        throw new Error("length not valid")
    }

    for (let i = 0; i < len; ++i)
    {
        if (container[i] == null)
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
                            indices: 0,
                            has_normals: false,
                            smooth: false,
                            meshes: []
                        }

                        obj.children.push(child)
                    }
                    break
                case "v":
                    {
                        const ss = value.split(delimiter_pattern, 6);
                        const array = ss.map(parseFloat)

                        if (array.length == 3)
                        {
                            obj.vertices.push(array)
                        }
                        else if (array.length == 4)
                        {
                            const w = array[3]

                            obj.vertices.push([array[0] / 2, array[1] / w, array[2] / w])

                        }
                        else
                        {
                            const second = array.splice(3, 3)

                            obj.vertices.push(array)
                            obj.colors.push(second)
                        }

                    }
                    break
                case "vn":
                    {
                        const ss = value.split(delimiter_pattern, 3);

                        const array = ss.map(parseFloat)

                        check_vector(array, 3)

                        obj.normals.push(array)
                    }
                    break
                case "vt":
                    {
                        const ss = value.split(delimiter_pattern, 2);

                        const array = ss.map(parseFloat)

                        // if (array.length == 2) {
                        //     array.push(0)
                        // }

                        obj.uvs.push(array)
                    }
                    break
                case "f":
                    {
                        const ss = value.split(delimiter_pattern, 3);

                        const face = { positions: [], coords: [], normals: [], material: child.material, type: key }

                        for (const one of ss)
                        {

                            const array = one.split("/").map((item) => parseInt(item, 10))

                            if (array[0])
                            {
                                face.positions.push(array[0] > 0 ? array[0] - 1 : obj.vertices.length + array[0])
                            }

                            if (array[1])
                            {
                                if (obj.uvs.length > 0)
                                {
                                    face.coords.push(array[1] > 0 ? array[1] - 1 : obj.uvs.length + array[1])
                                }
                                else if (obj.normals.length > 0)
                                {
                                    face.normals.push(array[2] > 0 ? array[2] - 1 : obj.normals.length + array[2])
                                }
                            }
                            if (array[2])
                            {
                                face.normals.push(array[2] > 0 ? array[2] - 1 : obj.normals.length + array[2])
                            }
                        }

                        if (face.positions.length == 0)
                        {
                            continue
                        }

                        child.faces.push(face)

                        child.indices += face.positions.length
                        child.has_normals = child.has_normals || face.normals.length > 0

                    }
                    break
                case "usemtl":
                    {
                        child.material = value
                        obj.curr_material = value
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
                this.add_face(obj, mesh, face)
            }

            mesh.material = mtl.materials[child.material]

            await this.load_material(mesh, obj.directory)

            this.meshes.push(mesh)
        }
    }

    add_face(obj, mesh, face)
    {


        for (let i = 0, len = face.positions.length; i < len; ++i)
        {
            const position = face.positions[i]
            const vertex = new Vertex()

            vertex.position.set(obj.vertices[position])

            if (face.normals.length > 0 && i < face.normals.length)
            {
                vertex.normals.set(obj.normals[face.normals[i]])
            }

            // if(position < obj.colors.length)
            // {
            //     const color = obj.colors[vertex];

            //     vertex.colors.set(color)       //vec3 / vec4
            // }

            if (i < face.coords.length)
            {
                const index = face.coords[i]

                vertex.coords.set(obj.uvs[index])
            }

            if (i != len - 1 || face.type != "l")
            {
                mesh.indices.push(mesh.indices.length)
            }

            mesh.vertices.push(vertex)
        }
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
            if (type != "diffuse")
            {
                continue
            }

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