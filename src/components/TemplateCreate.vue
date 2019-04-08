<template>
  <Layout class="create-stage">
    <!-- 创建模板: 配置 -->
    <Sider
      class="template-config"
      style="min-width: 300px; max-width: 300px; width: 300px; overflow: auto;"
    >
      <!-- 模版名称 -->
      <div class="config-item">
        <Form :model="stageName" :rules="nameRules" :label-width="60">
          <FormItem prop="name" label="名称">
            <Input type="text" v-model="stageName.name" :clearable="true" placeholder="请输入模版名称"/>
          </FormItem>
        </Form>
      </div>
      <!-- 画布配置 -->
      <div class="config-item">
        <p class="title">画布配置</p>
        <Form :model="stageConfig" :rules="stageRules" :label-width="60">
          <FormItem prop="width" label="宽">
            <InputNumber
              type="text"
              v-model="stageConfig.width"
              :clearable="true"
              placeholder="请输入画布宽度"
            ></InputNumber>
          </FormItem>
          <FormItem prop="height" label="高">
            <InputNumber
              type="text"
              v-model="stageConfig.height"
              :clearable="true"
              placeholder="请输入画布高度"
            ></InputNumber>
          </FormItem>
          <FormItem prop="url" label="URL">
            <Input
              type="text"
              v-model="stageConfig.url"
              :clearable="true"
              placeholder="请输入画布背景图片地址"
            />
          </FormItem>
          <FormItem prop="upimg" label="上传">
            <Upload ref="upload" action="/" accept="image/*" :before-upload="handleUpload">
              <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <!-- 模版框配置 -->
      <div name="config-item">
        <p class="title">模版框配置</p>
        <TemplateCreateConfig configType="group" :typeList="shapeList"></TemplateCreateConfig>
      </div>
      <!-- 装饰配置 -->
      <div name="config-item">
        <p class="title">装饰配置</p>
        <TemplateCreateConfig configType="font" :typeList="decorationList"></TemplateCreateConfig>
      </div>
      <Button @click="saveStage" style="margin-left: 55px;">保存模版</Button>
    </Sider>
    <!-- 创建模板: 预览 -->
    <Content class="template-sences">
      <TemplateCreateStage ref="TemplateCreateStage" :stageConfig="stageConfig"></TemplateCreateStage>
    </Content>
  </Layout>
</template>

<script>
import list from "../libs/list.js";
import { mapState } from "vuex";
import TemplateCreateConfig from "./TemplateCreateConfig.vue";
import TemplateCreateStage from "./TemplateCreateStage";

export default {
  name: "TemplateCreate",
  components: {
    TemplateCreateConfig,
    TemplateCreateStage
  },
  data() {
    // 数字
    const vInteger = (rule, value, callback) => {
      // 不为空
      if (value === "") {
        return callback(new Error("必填项"));
      }
      // 数字检测
      else if (!/^\d{1,}$/.test(value)) {
        return callback(new Error("请用数字填写（且为整数）"));
      } else {
        callback();
      }
    };
    return {
      // 模版名称
      stageName: {
        id: 0,
        name: "konva_demo"
      },
      // 模版名称验证
      nameRules: {
        name: [{ required: true, message: "请填写模板名称", trigger: "blur" }]
      },
      // stage 表单验证
      stageRules: {
        width: [{ required: true, validator: vInteger, trigger: "blur" }],
        height: [{ required: true, validator: vInteger, trigger: "blur" }],
        url: [{ type: "url", message: "链接地址不对哦", trigger: "blur" }]
      },
      // 形状列表
      shapeList: list.shapeList,
      // 装饰类型
      decorationList: list.decorationList,
      // stage序列化
      stageJson: {}
    };
  },
  computed: {
    ...mapState({
      // 底图
      stageConfig: state => state.template.stageConfig,
      // 配置列表
      configList: state => state.template.configList
    })
  },
  methods: {
    // 上传画布图片
    upload() {
      // console.log("上传画布图片");
      // 上传成功后将图片地址，宽，高信息赋给 stageConfig
      /** this.stageConfig.url = data.url;
       *  let tmpImg = new Image();
          tmpImg.onload = function() {
            this.stageConfig.width = tmpImg.width;
            this.stageConfig.height = tmpImg.height;
          };
          tmpImg.src = this.stageConfig.url;
      */
    },
    handleUpload(file) {
      this.file = file;
      this.upload();
      return false;
    },
    // 保存模版
    saveStage() {
      // 模版配置 json
      for (let prop in this.configList) {
        this.configList[prop].forEach(item => (item.draggable = false));
      }
      this.stageJson = {
        name: this.stageName.name,
        stageConfig: {
          width: this.stageConfig.width,
          height: this.stageConfig.height,
          url: this.stageConfig.url
        },
        configList: this.configList,
        thumbnails: "" // 模板预览图片，先将创建的模板处理成图片文件发给后台，存储返回成功后的 url
      };

      const canvas = this.$refs.TemplateCreateStage.$refs.stage.getStage().toCanvas();
      // 有跨域的图片 toBlob 会报错
      const blob = canvas.toBlob(
        function(blob) {
          console.log(blob);
          // 存储预览图片
        },
        "image/jpeg",
        0.95
      );
      // 存储配置
      localStorage.setItem("_stage_json", JSON.stringify(this.stageJson));
    }
  }
};
</script>

<style lang="less" scoped>
.create-stage {
  display: flex;
  height: ~"calc(100vh - 64px)";
  overflow: hidden;

  .template-config {
    background-color: #fff;
    padding: 15px;

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
    }
  }

  .template-sences {
    height: 100%;
    overflow: hidden;
  }
}
</style>
