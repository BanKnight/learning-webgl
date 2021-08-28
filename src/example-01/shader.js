export default {
    vs:`#version 300 es
    layout (location = 0) in vec3 aPos;
    
    void main()
    {
        gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
    }
    `,
    fs:`#version 300 es
    precision mediump float;   //float 变量没有默认精度，所以需要先声明
    out vec4 FragColor;
    
    void main()
    {
        FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);
    } 
    `
}
