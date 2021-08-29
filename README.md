# learning-webgl
用webgl 实现 learning-opengl上的内容

## 运行例子
修改 App.vue 为对应例子，然后查看效果即可
```javascript
import example from "./example-07";
```
+ example-01：一个简单的三角形
+ example-02：一个简单的矩形
+ example-03：顶点着色器中修改矩形颜色
+ example-04：演示使用uniform随时间修改矩形颜色
+ example-05：演示多个颜色组成的三角形
+ example-06：演示使用纹理
+ example-07：演示通过矩阵的动态旋转效果
+ example-08：演示通过mvp矩阵，地板上的图片
+ example-09：演示一个旋转中的正六面体
+ example-10：演示围绕原点旋转的摄像头表现
+ example-11：演示使用键盘控制摄像头移动

## 使用到的库
+ [glMatrix 矩阵运算](https://github.com/toji/gl-matrix)


## 项目准备
本项目利用vue的工程配置，因此首先安装vue-cli
+ 安装 vue-cli
```
npm install -g @vue/cli
```
+ 在代码根目录执行
```
npm install
```

### 编译以及热重启-开发环境
```
npm run serve
```

### 编译以及优化体积-正式环境
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
