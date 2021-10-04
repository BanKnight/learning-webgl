# learning-webgl

用webgl 实现 [learning-opengl](https://learnopengl-cn.github.io)上的内容

## 效果图

![02-lighting/02-basic-lighting](./example.png)

## 运行例子

修改 App.vue 为对应例子，然后查看效果即可

```javascript
import example from "./01/example-12";
```

+ 01
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
  + example-12：演示使用鼠标控制摄像头旋转
+ 02-lighting
  + 01-color: 演示通过修改光源颜色表现光的计算
  + 02-basic-lighting: 演示冯氏光照模型
  + 03-materials: 演示材质系统
  + 04-lighting-maps：演示光照贴图
  + 05-directional：演示平行光
  + 06-point：演示点光源
  + 07-spotlight：演示聚光灯
  + 08-multiple:多光源演示
## 使用到的库

+ [glMatrix 矩阵运算](https://github.com/toji/gl-matrix)

## 项目准备

### vscode 的配置
+ 
+ [例子参考](https://juejin.cn/post/6992023855384494116)

### 本项目利用vue的工程配置，因此首先安装vue-cli

+ 安装 vue-cli

```bash
npm install -g @vue/cli
```

+ 在代码根目录执行

```bash
npm install
```

### 编译以及热重启-开发环境

```bash
npm run serve
```

### 编译以及优化体积-正式环境

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 参考
+ [vue.config.js 的完整配置（超详细）！](https://juejin.cn/post/6886698055685373965)
+ [WebGL入门(三)：使用VUE3编写WebGL程序](https://juejin.cn/post/6992023855384494116)