<template>
  <canvas ref="canvas" width="640" height="480" tabindex="0">
    你的浏览器似乎不支持或者禁用了HTML5 <code>&lt;canvas&gt;</code> 元素.
  </canvas>
</template>

<script>
import example from "./example-12";

export default {
  name: "App",
  async mounted() {
    const canvas = this.$refs.canvas;
    let inputs = {
      keys:{},
      mouses:{},
      event:null,
      scroll:0,
    };

    const gl = canvas.getContext("webgl2");

    if (!gl) {
      alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
      return;
    }

    canvas.addEventListener("keydown", (e) => {

      inputs.keys[e.key] = true;
      inputs.event = e;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;

    });

    canvas.addEventListener("keyup", (e) => {
      inputs.keys[e.key] = false;
      inputs.event = e;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;

    });

    canvas.addEventListener("mousedown", (e) => {

      inputs.mouses[e.button] = true

      inputs.event = e;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;  

    });

    canvas.addEventListener("mouseup", (e) => {

      inputs.mouses[e.button] = false
      inputs.event = e;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;
    });

    canvas.addEventListener("mousemove", (e) => {
      inputs.event = e;
    });

    canvas.addEventListener(
      "DOMMouseScroll",
      (e) => {
        e.preventDefault();

        inputs.scroll = Math.max(
          -1,
          Math.min(1, e.wheelDelta || -e.detail)
        );
      },
      false
    );

    canvas.focus();

    gl.enable(gl.DEPTH_TEST);

    const draw_example = await example(gl, 640, 480);

    let last = 0;
    function draw(total) 
    {
      gl.clearColor(0.2, 0.3, 0.3, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      draw_example(total - last, total, inputs);

      last = total;

      requestAnimationFrame(draw);

      inputs.scroll = 0
    }

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
