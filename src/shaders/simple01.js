exports.vs = `#version 300 es
in vec3 aPos;
out vec4 vertexColor;
void main()
{
    gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
    vertexColor = vec4(0.5, 0.0, 0.0, 1.0); // 把输出变量设置为暗红色
}
`;
exports.fs = `#version 300 es
precision mediump float;   //float 变量没有默认精度，所以需要先声明
in vec4 vertexColor;
out vec4 FragColor;

void main() {
  FragColor = vertexColor;
}
`;
