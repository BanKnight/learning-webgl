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

    uniform vec3 color; 
    uniform vec3 light; // 灯的颜色
    uniform vec3 lightPos;
    uniform vec3 viewPos;

    void main()
    {

        float ambientStrength = 0.1;
        float specularStrength = 0.5;

        vec3 ambient = ambientStrength * light;    //环境光的影响

        vec3 norm = normalize(Normal);
        vec3 lightDir = normalize(lightPos - FragPos);   //光线向量，
        
        float diff = max(dot(norm, lightDir), 0.0); //得到他们的夹角
        vec3 diffuse = diff * light;       //得到漫反射的光

        //计算镜面光照，得到反射的光的出射方向
        vec3 viewDir = normalize(viewPos - FragPos);    //观察者方向
        vec3 reflectDir = reflect(-lightDir, norm);     //第一个参数需要从光源指向片段的向量，刚好相反了

        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 256.0);
        vec3 specular = specularStrength * spec * light;

        vec3 result = (ambient + diffuse + specular) * color;  //其实为什么是加法呢

        FragColor = vec4(result, 1.0);
    }
    `
}
