<template>
  <div class="stage-template">
    <!-- 舞台渲染 -->
    <v-stage
      ref="stage"
      :config="{
        width: stage.width,
        height: stage.height
      }"
      class="stage-fixed"
    >
      <!-- 底图 -->
      <v-layer ref="layer">
        <v-image ref="image" :config="configBackground"></v-image>
      </v-layer>
      <!-- 模版框图层 -->
      <layerTmpShape
        layerType="group"
        v-if="gconfigs.length > 0"
        :configs="gconfigs"
        @dragStart="dStart"
        @dragMove="dMove"
        @dragEnd="dEnd"
      ></layerTmpShape>
      <!-- 文字图层 -->
      <layerTmpText
        layerType="font"
        v-if="fconfigs.length > 0"
        :configs="fconfigs"
        @dragStart="dStart"
        @dragMove="dMove"
        @dragEnd="dEnd"
      ></layerTmpText>
    </v-stage>
  </div>
</template>

<script>
import LayerShape from "./LayerShape";
import LayerText from "./LayerText";

export default {
  name: "stageTmp",
  props: ["stage", "gconfigs", "fconfigs"],
  components: {
    LayerShape,
    LayerText
  },
  data() {
    return {
      // 底图image对象
      backgroundImage: new Image()
    };
  },
  computed: {
    configBackground() {
      this.backgroundImage.src = this.stage.url;
      this.backgroundImage.width = this.stage.width;
      this.backgroundImage.height = this.stage.height;

      return {
        image: this.backgroundImage
      };
    }
  },
  methods: {
    // 拖动改变位置
    dStart([index, type]) {
      let posX = this.$refs.stage.getStage().getPointerPosition().x;
      let posY = this.$refs.stage.getStage().getPointerPosition().y;

      this.$store.commit("start", [posX, posY, type]);
    },
    // 拖动改变位置
    dMove(type) {
      let posX = this.$refs.stage.getStage().getPointerPosition().x;
      let posY = this.$refs.stage.getStage().getPointerPosition().y;

      this.$store.commit("move", [posX, posY, type]);
    },
    // 拖动改变位置
    dEnd(type) {
      let posX = this.$refs.stage.getStage().getPointerPosition().x;
      let posY = this.$refs.stage.getStage().getPointerPosition().y;

      this.$store.commit("end", [posX, posY, type]);
    }
  }
};
</script>



