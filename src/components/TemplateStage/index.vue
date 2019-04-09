<template>
  <div class="stage-template">
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
      <LayerFont
        v-if="configList.font.length > 0"
        :configs="configList.font"
        @on-dragstart="dragStart"
        @on-dragmove="dragMove"
        @on-dragend="dragEnd"
      ></LayerFont>
    </v-stage>
  </div>
</template>

<script>
import LayerGroup from "./LayerGroup";
import LayerFont from "./LayerFont";
import { mapState, mapMutations } from "vuex";

export default {
  name: "TemplateStage",
  components: {
    LayerGroup,
    LayerFont
  },
  props: {
    stageConfig: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      image: null
    };
  },
  computed: {
    ...mapState({
      // 配置列表
      configList: state => state.template.configList,
      // 当前 id
      currentId: state => state.template.currentId
    })
  },
  created() {
    this.getStageImage();
  },
  watch: {
    "stageConfig.url": {
      deep: true,
      handler() {
        this.getStageImage();
      }
    }
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
    dragStart() {
      this.start(this.getPosition());
    },
    dragMove() {
      this.move(this.getPosition());
    },
    dragEnd() {
      this.end(this.getPosition());
    }
  }
};
</script>

<style lang="less" scoped>
.stage-template {
  border: 1px solid #dcdee2;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
}
</style>
