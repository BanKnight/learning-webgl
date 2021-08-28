export default {
    vs:`#version 300 es
    layout (location = 0) in vec3 aPos;
    layout (location = 1) in vec3 aColor;
    layout (location = 2) in vec2 aTexCoord;
    
    out vec3 ourColor;
    out vec2 TexCoord;
    
    void main()
    {
        gl_Position = vec4(aPos, 1.0);
        ourColor = aColor;
        TexCoord = vec2(aTexCoord.x, aTexCoord.y);
    }
    `,
    fs:`#version 300 es
    precision mediump float;   //float 变量没有默认精度，所以需要先声明
    out vec4 FragColor;
    
    in vec3 ourColor;
    in vec2 TexCoord;
    
    // texture samplers
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    
    void main()
    {
        // linearly interpolate between both textures (80% container, 20% awesomeface)
        FragColor = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), 0.2);
    }
    `
}
