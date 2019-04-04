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
        <v-image :config="stageImage"></v-image>
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
  name: "stageTmp",
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
      // 底图image对象
      stageImage: {
        image: new Image()
      }
    };
  },
  computed: {
    ...mapState({
      configList: state => state.template.configList,
      currentId: state => state.template.currentId
    })
  },
  created () {
    if (this.stageImage.image.complete) {
      this.stageImage.image.src = this.stageConfig.url;
      this.stageImage.image.width = this.stageConfig.width;
      this.stageImage.image.height = this.stageConfig.height;
    }
  },
  methods: {
    ...mapMutations([
      'getStageImage',
      "start",
      "move",
      "end"
    ]),
    getPosition() {
      let pos = {};
      pos.x = this.$refs.stage.getStage().getPointerPosition().x;
      pos.y = this.$refs.stage.getStage().getPointerPosition().y;
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
