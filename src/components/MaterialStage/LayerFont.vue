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
            draggable: false
          }"
      >
        <!-- 文字 -->
        <v-text
          v-if="config.type === 'font'"
          :config="{
              fontFamily: config.fontFamily,
              fontSize: config.fontSize,
              text: config.fontText,
              fill: config.fontColor,
              opacity: 1
            }"
        />

        <!-- 图片 -->
        <v-image
          v-if="config.type === 'image'"
          :config="{
              width: config.width,
              height: config.height,
              image: config.img,
              opacity: 1
            }"
        />
      </v-group>
    </v-layer>
  </div>
</template>

<script>
export default {
  name: "LayerFont",
  props: {
    configs: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
