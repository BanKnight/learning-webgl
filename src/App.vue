<template>
  <canvas ref="canvas" tabindex="0">
    你的浏览器似乎不支持或者禁用了HTML5 <code>&lt;canvas&gt;</code> 元素.
  </canvas>
</template>

<script>
import example from "./02-lighting/03-materials";

export default {
  name: "App",
  async mounted() {
    const canvas = this.$refs.canvas;
    let inputs = {
      keys: {},
      codes: {},
      mouses: {},
      scroll: 0,
    };

    const gl = canvas.getContext("webgl2");

    if (!gl) {
      alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
      return;
    }

    canvas.addEventListener("keydown", (e) => {
      inputs.keys[e.keyCode] = true;
      inputs.codes[e.code] = true;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;
    });

    canvas.addEventListener("keyup", (e) => {
      inputs.keys[e.keyCode] = e;
      inputs.codes[e.code] = false;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;
    });

    canvas.addEventListener("mousedown", (e) => {
      inputs.mouses[e.button] = e;
      inputs.event = e;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;
    });

    canvas.addEventListener("mouseup", (e) => {
      inputs.mouses[e.button] = false;
      inputs.event = e;

      inputs.ctrl = e.ctrlKey;
      inputs.alt = e.altlKey;
      inputs.shift = e.shiftKey;
    });

    canvas.addEventListener("mousemove", (e) => {
      inputs.event = e;
    });

    canvas.addEventListener(
      "mousewheel",
      (e) => {
        e.preventDefault();

        inputs.scroll = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      },
      false
    );

    const context = {
      canvas,
      gl,
      now: performance.now(),
      width: 0,
      height: 0,
      inputs,
      color:{r:0.2, g:0.3, b:0.3, a:1.0},
    };

    function full_screen() {
      context.width = document.documentElement.clientWidth;
      context.height = document.documentElement.clientHeight;

      canvas.width = context.width
      canvas.height = context.height

      canvas.style.width = context.width + "px";
      canvas.style.height = context.height + "px";

      gl.viewport(0, 0, context.width, context.height);

    }

    window.onresize = full_screen;

    canvas.focus();

    full_screen();

    gl.enable(gl.DEPTH_TEST);

    const draw_example = await example(context);

    let last = context.now;

    function draw(total) {


      gl.clearColor(context.color.r,context.color.g,context.color.b, context.color.a);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      context.now = total;

      draw_example(total - last, context);

      last = total;

      requestAnimationFrame(draw);

      inputs.scroll = 0;
      inputs.event = null;
    }

    requestAnimationFrame(draw);
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline-width: 0;
  border: 0;
}
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
</style>
