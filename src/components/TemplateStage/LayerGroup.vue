<template>
  <div class="layer-group">
    <v-layer v-if="configs.length > 0">
      <v-group
        v-for="(config, index) in configs"
        :key="index"
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
          rotation: config.rotation,
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
          :config="{
            x: config.strokeWidth,
            y: config.strokeWidth,
            width: config.width - config.strokeWidth * 2,
            height: config.height - config.strokeWidth * 2,
            image: config.img,
            draggable: false,
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
import { mapMutations } from "vuex";

export default {
  name: "LayerGroup",
  props: {
    configs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    ...mapMutations(["setConfigType", "current"]),
    // 获取当前 group
    getCurrent(index) {
      this.configs.forEach(item => {
        if (parseInt(item["uniqueId"]) === parseInt(index)) {
          item.disabled = true;
          this.setConfigType("group");
          this.current(item);
        }
      });
    },
    // 拖动改变位置
    dragStart(index) {
      this.getCurrent(index);
      this.$emit("on-dragstart");
    },
    // 拖动改变位置
    dragMove() {
      this.$emit("on-dragmove");
    },
    // 拖动改变位置
    dragEnd() {
      this.$emit("on-dragend");
    },
    // 阻止事件冒泡
    dragStartImage(element, e) {
      if (e) e.cancelBubble = true;
    },
    dragMoveImage(element, e) {
      if (e) e.cancelBubble = true;
    },
    dragEndImage(element, e) {
      if (e) e.cancelBubble = true;
    }
  }
};
</script>
