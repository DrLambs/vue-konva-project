<template>
  <Layout class="create-material">
    <Steps :current="stepCurrent" size="small" class="step">
      <Step title="选择模板"></Step>
      <Step title="编辑图片"></Step>
      <Step title="查看素材"></Step>
    </Steps>
    <!-- 下一步 -->
    <div class="next-step">
      <Button @click="handleStep">下一步</Button>
    </div>
    <!-- 选择模板 -->
    <div class="select-template create-item" v-if="stepCurrent === 0">
      <h3 class="title">当前模板: {{ currentTemplate.name }}</h3>
      <p>由于当前只存储一个模板，默认选择这个模板。</p>
    </div>
    <!-- 编辑图片 -->
    <div class="edit-image create-item" v-if="stepCurrent === 1">
      <h3 class="title">编辑图片</h3>
      <div class="edit-image-wrap">
        <MaterialConfig></MaterialConfig>
        <Card class="stage-card">
          <p slot="title">{{ currentTemplate.name }}</p>
          <div slot="extra">
            <i-switch v-model="switchTop" style="margin-right: 10px;"/>
            <span>预览（注意：预览时不可编辑图片，编辑之前请先关闭预览）</span>
            <Button @click="handleSave">保存素材</Button>
          </div>
          <MaterialStage
            ref="MaterialStage"
            :iVisible="switchTop"
            :stageConfig="currentTemplate.stageConfig"
            :configList="currentTemplate.configList"
          ></MaterialStage>
        </Card>
      </div>
    </div>
    <!-- 查看素材 -->
    <div class="view-material create-item" v-if="stepCurrent === 2">
      <img :src="dataSrc">
    </div>
  </Layout>
</template>

<script>
import MaterialConfig from "./MaterialConfig";
import MaterialStage from "./MaterialStage";
import { mapState, mapMutations } from "vuex";
import _ from "lodash";
import util from "../libs/util.js";

export default {
  name: "Material",
  components: {
    MaterialConfig,
    MaterialStage
  },
  data() {
    return {
      stepCurrent: 0,
      switchTop: true,
      timer: null,
      dataSrc: ""
    };
  },
  computed: {
    ...mapState({
      currentTemplate: state => state.material.currentTemplate
    })
  },
  created() {
    this.handleJson();
  },
  methods: {
    ...mapMutations(["getCurrentTepmlate"]),
    handleJson() {
      // 处理 json 字符串
      const config = JSON.parse(localStorage.getItem("_stage_json"));
      config.id = 0;
      // group
      config.configList.group.forEach(item => {
        item.img = util.newImage(item.src);
        // v-image 配置跟 group 分开
        let _clone = _.cloneDeep(item);
        _clone.x = 0;
        _clone.y = 0;
        _clone.rotation = 0;
        _clone.scale = 0;
        _clone.img = util.newImage(item.src);
        item.vImage = _clone;
      });
      // font
      config.configList.font.forEach(item => {
        item.img = util.newImage(item.src);
      });
      this.getCurrentTepmlate(config);
    },
    handleStep() {
      if (localStorage.getItem("_image_dataurl")) {
        this.dataSrc = localStorage.getItem("_image_dataurl");
      }
      if (this.stepCurrent < 2) {
        this.stepCurrent += 1;
      } else {
        this.stepCurrent = 0;
      }
    },
    // 保存素材
    handleSave() {
      const _this = this;
      this.switchTop = true;
      this.timer = setTimeout(function() {
        const stage = _this.$refs.MaterialStage.$refs.stage.getStage();
        const canvas = stage.toCanvas();
        _this.dataSrc = stage.toDataURL();
        canvas.toBlob(
          function(blob) {
            util.showSuccess(`success: ${blob}`);
            localStorage.setItem("_image_dataurl", _this.dataSrc);
          },
          "image/jpeg",
          1
        );
      }, 500);
    }
  }
};
</script>

<style lang="less">
img {
  max-width: 100%;
  max-height: 100%;
}
.create-material {
  height: ~"calc(100% - 64px)";
  overflow: hidden;
  padding: 30px;
  position: relative;

  &.ivu-layout {
    background: #fff;
  }
  .step {
    margin-bottom: 15px;
  }
  .next-step {
    position: absolute;
    top: 24px;
    right: 15%;
  }
  .create-item {
    height: ~"calc(100% - 54px)";
  }
  .select-template {
    text-align: center;
  }
  .title {
    margin-bottom: 15px;
  }
  .selet-image {
    margin-bottom: 30px;

    img {
      max-width: 100%;
      max-height: 100%;
    }
    .image-list {
      display: flex;

      .ivu-checkbox-wrapper {
        position: relative;
      }
      .ivu-checkbox {
        position: absolute;
        top: 20px;
        right: 16px;
        z-index: 9;
      }
    }
  }
  .edit-image-wrap {
    display: flex;
    justify-content: space-between;
    height: ~"calc(100% - 36px)";
  }
  .stage-card {
    width: ~"calc(100% - 240px)";
    padding: 0;

    .ivu-card-body {
      height: ~"calc(100% - 52px)";
      overflow: auto;
    }
  }
}
</style>
