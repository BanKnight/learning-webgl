const FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT
const INT_SIZE = Int32Array.BYTES_PER_ELEMENT

export default class Vertex {
        constructor() {

        this.buffer = new ArrayBuffer(Vertex.size())

        this.position = new Float32Array(this.buffer, 0, 3)
        this.normals = new Float32Array(this.buffer, this.position.byteOffset + this.position.byteLength,  3)
        this.coords = new Float32Array(this.buffer, this.normals.byteOffset + this.normals.byteLength, 2)
        this.tangent = new Float32Array(this.buffer, this.coords.byteOffset + this.coords.byteLength,  3)
        this.bitangent = new Float32Array(this.buffer, this.tangent.byteOffset + this.tangent.byteLength,  3)

        this.bones = new Int32Array(this.buffer, this.bitangent.byteOffset + this.bitangent.byteLength,  4)  //[int X 4]
        this.weights = new Float32Array(this.buffer, this.bones.byteOffset + this.bones.byteLength,  4)    //[float * 4]    
    }

    set(target, ...args) {
        const array = this[target]

        for (let i = 0; i < array.length; ++i) {
            array[i] = args[i]
        }
    }
    static size()
    {
        return FLOAT_SIZE * 3 * 4 + FLOAT_SIZE * 2 + INT_SIZE * 4 + FLOAT_SIZE * 4
    }
}