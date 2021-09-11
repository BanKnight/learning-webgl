export default {
    vs:`#version 300 es
    layout (location = 0) in vec3 aPos;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 projection;

    void main()
    {
        gl_Position = projection * view * model * vec4(aPos, 1.0);
    }
    `,
    fs:`#version 300 es
    precision mediump float;   //float 变量没有默认精度，所以需要先声明
    out vec4 FragColor;

    uniform vec4 color; // 在OpenGL程序代码中设定这个变量

    void main()
    {
        FragColor = color;
    }
    `
}
