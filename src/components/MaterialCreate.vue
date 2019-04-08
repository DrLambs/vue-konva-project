<template>
  <Layout class="create-material">
    <Steps :current="stepCurrent" size="small">
      <Step title="选择模板"></Step>
      <Step title="编辑图片"></Step>
    </Steps>
    <!-- 下一步 -->
    <div class="next-step">
      <Button @click="handleStep">下一步</Button>
    </div>
    <!-- 选择模板 -->
    <div class="select-template" v-if="stepCurrent === 0">
      <h3 class="title">当前模板: {{ currentTemplate.name }}</h3>
      <p>由于当前只存储一个模板，默认选择这个模板。</p>
    </div>
    <!-- 编辑图片 -->
    <div class="edit-image" v-if="stepCurrent === 1">
      <h3 class="title">编辑图片</h3>
      <div class="edit-image-wrap">
        <MaterialCreateConfig></MaterialCreateConfig>
        <MaterialCreateStage
          ref="MaterialCreateStage"
          :stageConfig="currentTemplate.stageConfig"
          :configList="currentTemplate.configList"
        ></MaterialCreateStage>
      </div>
    </div>
    <!-- 生成素材 -->
    <div class="generate-material" v-if="stepCurrent === 3">
      <h3 class="title">生成素材</h3>
      <Button class="title">生成素材</Button>
    </div>
    <!-- 选择图片 -->
    <div class="selet-image" v-if="stepCurrent === 3">
      <h3 class="title">选择图片</h3>
      <CheckboxGroup v-if="imageList.length > 0" v-model="imageSelect" class="image-list">
        <Checkbox v-for="(item, index) in imageList" :key="index" :label="item.url">
          <Card style="width:350px">
            <p slot="title">{{ item.name }}</p>
            <img :src="item.url" alt="image">
          </Card>
        </Checkbox>
      </CheckboxGroup>
    </div>
  </Layout>
</template>

<script>
import CommonSliderBar from "./CommonSliderBar";
import MaterialCreateConfig from "./MaterialCreateConfig";
import MaterialCreateStage from "./MaterialCreateStage";
import { mapState, mapMutations } from "vuex";
import _ from "lodash";
import util from "../libs/util.js";

export default {
  name: "MaterialCreate",
  components: {
    CommonSliderBar,
    MaterialCreateConfig,
    MaterialCreateStage
  },
  data() {
    return {
      stepCurrent: 0,
      curTmp: null,
      imageList: [
        {
          name: "img1",
          url:
            "http://img0.imgtn.bdimg.com/it/u=294851227,664981643&fm=26&gp=0.jpg"
        },
        {
          name: "img2",
          url:
            "http://image3.cnpp.cn/upload2/news/20130921/160952_62920_url.jpg"
        },
        {
          name: "img3",
          url:
            "http://ww2.sinaimg.cn/large/d2e27164gw1fbrx3teglej21kw14r1kx.jpg"
        }
      ],
      imageSelect: []
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
      if (this.stepCurrent === 0) {
        this.stepCurrent += 1;
      } else {
        this.stepCurrent = 0;
      }
    },
    changeSwitch(status) {
      // this.switchTop = status;
    },
    // 保存素材
    middleSave() {
      // this.switchTop = true;
      let _this = this;
      setTimeout(function() {
        _this.$emit("middleSave", [
          _this.$refs.stage.$refs.stage.getStage(),
          _this.index
        ]);
      }, 500);
    }
  }
};
</script>

<style lang="less">
.create-material {
  height: ~"calc(100% - 64px)";
  overflow: auto;
  padding: 30px;

  &.ivu-layout {
    background: #fff;
  }
  .next-step {
    margin-top: 30px;
    margin-right: 120px;
    text-align: right;
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
  }
}
</style>
