<template>
  <div class="stage-material">
    <!-- 舞台渲染 -->
    <v-stage
      ref="stage"
      :config="{
        width: stageConfig.width,
        height: stageConfig.height
      }"
    >
      <!-- 底图 -->
      <v-layer>
        <v-image :config="{image: image, width: stageConfig.width, height: stageConfig.height}"></v-image>
      </v-layer>

      <!-- 模版框图层 -->
      <LayerGroup
        v-if="configList.group.length > 0"
        :configs="configList.group"
        @on-dragstart="dragStart"
        @on-dragmove="dragMove"
        @on-dragend="dragEnd"
      ></LayerGroup>
      <!-- 文字图层 -->
      <LayerFont v-if="configList.font.length > 0 && iVisible" :configs="configList.font"></LayerFont>
    </v-stage>
  </div>
</template>

<script>
import LayerGroup from "./LayerGroup";
import LayerFont from "./LayerFont";
import { mapMutations } from "vuex";

export default {
  name: "MaterialStage",
  props: {
    stageConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    configList: {
      type: Object,
      default() {
        return {};
      }
    },
    iVisible: {
      type: Boolean,
      default: true
    }
  },
  components: {
    LayerGroup,
    LayerFont
  },
  data() {
    return {
      image: null
    };
  },
  created() {
    this.getStageImage();
  },
  methods: {
    ...mapMutations(["start", "move", "end"]),
    getStageImage() {
      const image = new window.Image();
      image.src = this.stageConfig.url;
      image.onload = () => {
        // set image only when it is loaded
        this.image = image;
      };
    },
    getPosition() {
      let pos = this.$refs.stage.getStage().getPointerPosition();
      return pos;
    },
    // dragsrat 鼠标位置
    dragStart() {
      this.start(this.getPosition());
    },
    // dragmove
    dragMove() {
      this.move(this.getPosition());
    },
    // dragend
    dragEnd() {
      this.end(this.getPosition());
    }
  }
};
</script>
