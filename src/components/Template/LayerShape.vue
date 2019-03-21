<template>
  <div id="LayerShape">
    <v-layer ref="layer" :layer-type="layerType">
      <v-group
        ref="group"
        v-for="config in configs"
        :config="{
          x: config.x + config.width / 2,
          y: config.y + config.height / 2,
          offset: {
            x: config.width / 2,
            y: config.height / 2,
          },
          scale: {
            x: (1 + config.scale / 100 ).toFixed(2),
            y: (1 + config.scale / 100 ).toFixed(2)
          },
          width: config.width,
          height: config.height,
          rotation: config.rotation * 3.6,
          draggable: config.draggable,
          clipFunc: function(ctx) {
            // 矩形
            if(config.type === 'rect') {
              ctx.rect(0, 0, config.width, config.height)
            }
            // 圆形 —— 参数：半径
            else if(config.type === 'circle') {
              ctx.arc(config.width / 2, config.height / 2, config.radius, 0, Math.PI * 2, false)
            }
            // 三角形 —— 正三角形
            else if(config.type === 'triangle') {
              ctx.beginPath();
              ctx.moveTo(config.side / 2, 0)
              ctx.lineTo(0, Math.sqrt(Math.pow(config.side, 2) - Math.pow(config.side / 2, 2)))
              ctx.lineTo(config.side, Math.sqrt(Math.pow(config.side, 2) - Math.pow(config.side / 2, 2)))
              ctx.closePath()
            }
            // 心形 —— 配置默认
            else if(config.type === 'heart') {
              ctx.beginPath()
              // 起始点
              ctx.moveTo(75, 40)
              // 左半边
              ctx.bezierCurveTo(75, 37, 70, 25, 50, 25)
              ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5)
              ctx.bezierCurveTo(20, 80, 40, 102, 75, 120)
              // 右半边
              ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5)
              ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25)
              ctx.bezierCurveTo(85, 25, 75, 37, 75, 40)

              //闭合路径
              ctx.closePath()
            }
          }
        }"
        @dragstart="dragStart(config.uniqueId)"
        @dragmove="dragMove"
        @dragend="dragEnd"
        @click="getCurrent(config.uniqueId)"
      >
        <v-image
          ref="image"
          :config="{
            x: config.strokeWidth,
            y: config.strokeWidth,
            width: config.width - config.strokeWidth * 2,
            height: config.height - config.strokeWidth * 2,
            image: config.img,
            draggable: !config.draggable,
            opacity: config.opacity,
            stroke: config.stroke,
            strokeWidth: config.strokeWidth
          }"
          @dragstart="dragStartImage"
          @dragmove="dragMoveImage"
          @dragend="dragEndImage"
        />
      </v-group>
    </v-layer>
    <!-- layer 结束 -->
  </div>
</template>

<script>
export default {
  name: "LayerShape",
  props: ["layerType", "configs"],
  data() {
    return {
      ltype: ""
    };
  },
  mounted: function() {},
  methods: {
    // 获取当前 group
    getCurrent(index) {
      let _index = parseInt(index);
      this.ltype = this.$refs.layer.$attrs["layer-type"];

      this.configs.forEach(item => {
        if (parseInt(item["uniqueId"]) === _index) {
          item["disabled"] = true;

          this.$store.commit("current", [item, this.ltype]);
        }
      });
    },
    // 拖动改变位置
    dragStart(index) {
      this.getCurrent(index);
      this.$emit("dragStart", [
        this.$store.state.stage.currentIndex,
        this.ltype
      ]);
    },
    // 拖动改变位置
    dragMove() {
      this.$emit("dragMove", this.ltype);
    },
    // 拖动改变位置
    dragEnd() {
      this.$emit("dragEnd", this.ltype);
    },
    dragStartImage(element, e) {
      e.cancelBubble = true;
    },
    dragMoveImage(element, e) {
      e.cancelBubble = true;
    },
    dragEndImage(element, e) {
      e.cancelBubble = true;
    }
  }
};
</script>

<style>
</style>



