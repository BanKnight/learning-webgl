export default {
    vs:`#version 300 es
    layout (location = 0) in vec3 aPos;
    layout (location = 1) in vec3 aNormal;
    layout (location = 2) in vec2 aTexCoords;

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 projection;

    out vec3 Normal;   //法向量,基于世界坐标，没有经过model矩阵的变换
    out vec3 FragPos;  //片段的世界坐标，用于计算光源和片段之间的向量
    out vec2 TexCoords;

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
    `,
    fs:`#version 300 es
    precision mediump float;   //float 变量没有默认精度，所以需要先声明

    in vec3 Normal;
    in vec3 FragPos;  
    in vec2 TexCoords;

    out vec4 FragColor;

    // 物体颜色 = 材质颜色 (环境光照反射率+漫反射光照反射率+镜面光照反射率) = 光源照射物体反射出来的颜色
    struct Material {
        sampler2D diffuse;  //漫反射,定义了在漫反射光照下物体的颜色。（和环境光照一样）
        sampler2D specular;      //镜面光照,镜面光照对物体的颜色影响（或者甚至可能反射一个物体特定的镜面高光颜色）
        float shininess;    //反光度,影响镜面高光的散射/半径
    }; 

    struct Light {
        vec3 position;      //聚光灯所在位置
        vec3 direction;     //聚光灯朝向

        float cutOff;       //聚光灯往外的角度的余弦值
        float outerCutOff;  //外切
    
        vec3 ambient;       //环境光强度
        vec3 diffuse;       //漫反射强度
        vec3 specular;      //反光度强度

        float constant;     //衰减需要的各大参数
        float linear;
        float quadratic;
    };

    uniform Material material;
    uniform Light light;

    uniform vec3 viewPos;

    void main()
    {

        vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

        // 漫反射 
        vec3 norm = normalize(Normal);
        vec3 lightDir = normalize(light.position - FragPos);    //片段的光线方向
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;  

        // 镜面光
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, norm);  
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = light.specular * spec * texture(material.specular, TexCoords).rgb; 
        
        //计算聚光灯的强度，灯的中间最亮，依次减弱
        float theta     = dot(lightDir, normalize(-light.direction));
        float epsilon   = light.cutOff - light.outerCutOff;
        float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0); 

        //计算距离衰减
        float distance    = length(light.position - FragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

        //环境光不受影响
        vec3 result = ambient * attenuation   + (diffuse + specular) * attenuation * intensity;

        FragColor = vec4(result, 1.0);
    }
    `
}
