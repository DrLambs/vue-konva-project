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
      <v-layer ref="layer">
        <v-image ref="image" :config="stageImageConfig"></v-image>
      </v-layer>

      <!-- 模版框图层 -->
      <LayerGroup
        v-if="configList.group.length > 0"
        :configs="configList.group"
        @on-mousedown="handleMouseDown"
        @on-dragstart="dragStart"
        @on-dragmove="dragMove"
        @on-dragend="dragEnd"
      ></LayerGroup>
      <!-- 文字图层 -->
      <LayerFont v-if="configList.font.length > 0" :configs="configList.font"></LayerFont>
    </v-stage>
  </div>
</template>

<script>
import LayerGroup from "./LayerGroup";
import LayerFont from "./LayerFont";
import { mapState, mapMutations } from "vuex";

export default {
  name: "MaterialCreateStage",
  // props: ["stage", "gconfigs", "fconfigs", "index", "iVisible"],
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
    }
  },
  components: {
    LayerGroup,
    LayerFont
  },
  data() {
    return {
      // 背景 image对象
      backgroundImage: new Image()
    };
  },
  computed: {
    // 背景 config
    stageImageConfig () {
      let _img = new Image();
      _img.src = this.stageConfig.url;
      _img.width = this.stageConfig.width;
      _img.height = this.stageConfig.height;
      return { image: _img };
    }
  },
  methods: {
    ...mapMutations([
      "start",
      "move",
      "end"
    ]),
    getPosition() {
      let pos = this.$refs.stage.getStage().getPointerPosition();
      return pos;
    },
    handleMouseDown(index) {
      console.log(index)
    },
    // dragsrat 鼠标位置
    dragStart(id, index) {
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
