export default {
    vs:`#version 300 es
    layout (location = 0) in vec3 aPos;
    layout (location = 1) in vec3 aNormal;

    out vec3 Normal;   //法向量,基于世界坐标，没有经过model矩阵的变换
    out vec3 FragPos;  //片段的世界坐标，用于计算光源和片段之间的向量

    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 projection;

    void main()
    {
        gl_Position = projection * view * model * vec4(aPos, 1.0);
        FragPos = vec3(model * vec4(aPos, 1.0));    

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

    out vec4 FragColor;

    // 物体颜色 = 材质颜色 (环境光照反射率+漫反射光照反射率+镜面光照反射率) = 光源照射物体反射出来的颜色
    struct Material {
        vec3 ambient;       //环境光照,定义了在环境光照下这个物体反射得是什么颜色，通常这是和物体颜色相同的颜色
        vec3 diffuse;       //漫反射,定义了在漫反射光照下物体的颜色。（和环境光照一样）
        vec3 specular;      //镜面光照,镜面光照对物体的颜色影响（或者甚至可能反射一个物体特定的镜面高光颜色）
        float shininess;    //反光度,影响镜面高光的散射/半径
    }; 

    struct Light {
        vec3 position;      //
    
        vec3 ambient;       //环境光强度
        vec3 diffuse;       //漫反射强度
        vec3 specular;      //反光度强度
    };

    uniform Material material;
    uniform Light light;

    uniform vec3 viewPos;

    void main()
    {

        vec3 ambient = light.ambient * material.ambient;

        // 漫反射 
        vec3 norm = normalize(Normal);
        vec3 lightDir = normalize(light.position - FragPos);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = light.diffuse * (diff * material.diffuse);

        // 镜面光
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, norm);  
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = light.specular * (spec * material.specular);  

        vec3 result = ambient + diffuse + specular;
        FragColor = vec4(result, 1.0);
    }
    `
}
