<template>
  <div class="layer-group">
    <v-layer>
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
            rotation: config.rotation * 3.6,
            draggable: false,
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
              else if(config.type === 'polygon'){
                ctx.beginPath()
                ctx.moveTo(config.nodelist[0][0], config.nodelist[0][1])
                for(let i=1;i<config.nodelist.length;i++){
                  ctx.lineTo(config.nodelist[i][0], config.nodelist[i][1])
                }
                ctx.closePath()
              }
            }
          }"
      >
        <v-image
          :config="{
              x: config.vImage.x + config.vImage.width / 2,
              y: config.vImage.y + config.vImage.height / 2,
              offset: {
                x: config.vImage.width / 2,
                y: config.vImage.height / 2,
              },
              width: config.vImage.width,
              height: config.vImage.height,
              scale: {
                x: (1 + config.vImage.scale / 100 ).toFixed(2),
                y: (1 + config.vImage.scale / 100 ).toFixed(2)
              },
              rotation: config.vImage.rotation,
              image: config.vImage.img,
              draggable: true
            }"
          @mousedown="getCurrent(config.vImage.uniqueId)"
          @dragstart="dragStart(config.vImage.uniqueId)"
          @dragmove="dragMove"
          @dragend="dragEnd"
        />
      </v-group>
    </v-layer>
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
    ...mapMutations([
      'setImageId'
    ]),
    // 当前选择的 v-image
    getCurrent(id) {
      this.setImageId(id);
    },
    // dragsrat 鼠标位置
    dragStart(id) {
      this.getCurrent(id);
      this.$emit("on-dragstart");
    },
    // dragmove
    dragMove() {
      this.$emit("on-dragmove");
    },
    // dragend
    dragEnd() {
      this.$emit("on-dragend");
    }
  }
};
</script>
