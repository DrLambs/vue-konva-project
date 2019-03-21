<template>
  <div id="layerText">
    <v-layer ref="layer" :layer-type="layerType">
      <v-group
        ref="group"
        v-for="config in configs"
        :config="{
          x: config.x + config.width / 2,
          y: config.y + config.height / 2,
          rotation: config.rotation * 3.6,
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
          ref="text"
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
          ref="image"
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
export default {
  name: "LayerText",
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
        this.$store.state.template.fontCurrentIndex,
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
    }
  }
};
</script>

<style>
</style>



