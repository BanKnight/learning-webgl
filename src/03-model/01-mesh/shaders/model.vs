#version 300 es

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

out vec3 Normal;   //法向量,基于世界坐标，没有经过model矩阵的变换
out vec3 FragPos;  //片段的世界坐标，用于计算光源和片段之间的向量
out vec2 TexCoords;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    FragPos = vec3(model * vec4(aPos, 1.0));    
    TexCoords = aTexCoords;

    //将法线向量变换到和光线的方向向量同一空间
    //注意：这里有两个问题需要处理
    //1 法线向量没有位移 2 不等比缩放会导致不再垂直于表面
    Normal = mat3(transpose(inverse(model))) * aNormal;
    
}