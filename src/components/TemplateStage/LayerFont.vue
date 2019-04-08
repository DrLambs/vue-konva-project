<template>
  <div class="layer-font">
    <v-layer>
      <v-group
        v-for="(config, index) in configs"
        :key="index"
        :config="{
          x: config.x + config.width / 2,
          y: config.y + config.height / 2,
          rotation: config.rotation,
          scale: {
            x: (1 + config.scale / 100 ).toFixed(2),
            y: (1 + config.scale / 100 ).toFixed(2)
          },
          offset: {
            x: config.width / 2,
            y: config.height / 2,
          },
          draggable: config.draggable
        }"
        @dragstart="dragStart(config.uniqueId)"
        @dragmove="dragMove"
        @dragend="dragEnd"
        @click="getCurrent(config.uniqueId)"
      >
        <!-- 文字 -->
        <v-text
          v-if="config.type === 'font'"
          :config="{
            x: 0,
            y: 0,
            fontFamily: config.fontFamily,
            fontSize: config.fontSize,
            text: config.fontText,
            fill: config.fontColor,
            opacity: config.opacity
          }"
        />

        <!-- 图片 -->
        <v-image
          v-if="config.type === 'image'"
          :config="{
            width: config.width,
            height: config.height,
            image: config.img,
            opacity: config.opacity
          }"
        />
      </v-group>
    </v-layer>
    <!-- layer 结束 -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "LayerFont",
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
      'setConfigType',
      'current'
    ]),
    // 获取当前 group
    getCurrent(index) {
      this.configs.forEach(item => {
        if (parseInt(item["uniqueId"]) === parseInt(index)) {
          item["disabled"] = true;
          this.setConfigType('font');
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
    }
  }
};
</script>
