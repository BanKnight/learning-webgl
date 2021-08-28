exports.vs = `#version 300 es
layout (location = 0) in vec3 aPos; // 位置变量的属性位置值为0

void main()
{
    gl_Position = vec4(aPos, 1.0); // 注意我们如何把一个vec3作为vec4的构造器的参数
}
`;
exports.fs = `#version 300 es
precision mediump float;   //float 变量没有默认精度，所以需要先声明
out vec4 FragColor;

uniform vec4 ourColor; // 在OpenGL程序代码中设定这个变量

void main()
{
    FragColor = ourColor;
}
`;
