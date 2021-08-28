<template>
  <canvas ref="canvas" width="640" height="480">
    你的浏览器似乎不支持或者禁用了HTML5 <code>&lt;canvas&gt;</code> 元素.
  </canvas>
</template>

<script>

import example from "./example-06";

export default {
  name: "App",
  async mounted() {
    const canvas = this.$refs.canvas;

    const gl = canvas.getContext("webgl2");

    if (!gl) {
      alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
      return;
    }

    gl.enable(gl.DEPTH_TEST);

    const draw_example = await example(gl, 640, 480);

    let last = 0;

    const draw = (total) => {
      gl.clearColor(0.2, 0.3, 0.3, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      draw_example(total - last, total);

      last = total;

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
