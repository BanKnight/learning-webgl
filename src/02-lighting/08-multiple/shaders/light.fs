#version 300 es
precision mediump float;   //float 变量没有默认精度，所以需要先声明
out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0); // set alle 4 vector values to 1.0
}