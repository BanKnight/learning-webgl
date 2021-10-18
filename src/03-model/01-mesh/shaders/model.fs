#version 300 es
precision mediump float;   //float 变量没有默认精度，所以需要先声明

in vec3 FragPos; 
in vec3 Normal;
in vec2 TexCoords;

out vec4 FragColor;

struct Material
{
    sampler2D diffuse;
};

struct Light {
    vec3 direction;     //光源的方向
    vec3 ambient;       //环境光强度
    vec3 diffuse;       //漫反射强度
    vec3 specular;      //反光度强度
};

uniform Material material;
uniform Light light;

void main()
{    

    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(-light.direction);
    float diff = max(dot(norm, lightDir), 0.0);

    vec3 tex = vec3(texture(material.diffuse, TexCoords));

    // tex = vec3(0.5,0.5,0.5);

    vec3 ambient  = light.ambient  * tex;
    vec3 diffuse  = light.diffuse  * diff * tex;

    FragColor = vec4(diffuse + ambient, 1.0);
}