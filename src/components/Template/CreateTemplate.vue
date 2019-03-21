<template>
  <Layout class="create-stage ad-tabs content-bg">
    <!-- 创建模板: 配置 -->
    <Sider style="min-width: 300px; max-width: 300px; width: 300px; overflow: auto;">
      <div class="template-config">
        <!-- 模版名称 -->
        <div class="config-item">
          <Form
            slot="content"
            ref="stageNameFrom"
            :model="stageName"
            :rules="nameRules"
            :label-width="60"
          >
            <FormItem prop="name" label="名称">
              <Input
                type="text"
                v-model="stageName.name"
                autofocus
                :clearable="true"
                placeholder="请输入模版名称"
              />
            </FormItem>
          </Form>
        </div>
        <!-- 画布配置 -->
        <div class="config-item">
          <p class="title">画布配置</p>
          <Form
            slot="content"
            ref="stageForm"
            :model="stageForm"
            :rules="stageRules"
            :label-width="60"
          >
            <FormItem prop="width" label="宽">
              <Input
                type="text"
                v-model="stageForm.width"
                :clearable="true"
                placeholder="请输入画布宽度"
              />
            </FormItem>
            <FormItem prop="height" label="高">
              <Input
                type="text"
                v-model="stageForm.height"
                :clearable="true"
                placeholder="请输入画布高度"
              />
            </FormItem>
            <FormItem prop="url" label="URL">
              <Input
                type="text"
                v-model="stageForm.url"
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
          <StageConfig
            slot="content"
            formTypeSelectionName="形状"
            formType="group"
            :selectionType="shapeList"
            :form="groupForm"
            :initForm="initGroupForm"
          ></StageConfig>
        </div>
        <!-- 装饰配置 -->
        <div name="config-item">
          <p class="title">装饰配置</p>
          <StageConfig
            slot="content"
            formTypeSelectionName="装饰"
            formType="font"
            :selectionType="decorationList"
            :form="fontForm"
            :initForm="initFontForm"
          ></StageConfig>
        </div>
        <Button @click="saveStage" style="margin-left: 55px;">保存模版</Button>
      </div>
    </Sider>
    <!-- 创建模板: 预览 -->
    <Content>
      <div class="template-sences">
        <StageTmp
          ref="stage"
          :stage="stageForm"
          :gconfigs="configGroups"
          :fconfigs="configFonts"
        ></StageTmp>
      </div>
    </Content>
  </Layout>
</template>

<script>
import StageConfig from "./StageConfig.vue";
import StageTmp from "./StageTmp.vue";

export default {
  name: "CreateTemplate",
  components: {
    StageConfig,
    StageTmp
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
      // 形状列表
      shapeList: [
        {
          label: "矩形",
          value: "rect"
        }
        // {
        //   label: '圆形',
        //   value: 'circle'
        // },
        // {
        //   label: '三角形',
        //   value: 'triangle'
        // },
        // {
        //   label: '心形',
        //   value: 'heart'
        // }
      ],
      // 装饰类型
      decorationList: [
        {
          label: "文字",
          value: "font"
        },
        {
          label: "图片",
          value: "image"
        }
      ],
      // groups 初始化
      initGroupForm: this.$store.state.template.groupForm,
      // groups 列表
      configGroups: this.$store.state.template.configGroups,

      // fonts 初始化
      initFontForm: this.$store.state.template.fontForm,
      // fonts 列表
      configFonts: this.$store.state.template.configFonts,

      // 折叠面板
      stageSteps: "1",
      // 模版名称
      stageName: {
        id: 0,
        name: "demo"
      },
      // 模版名称验证
      nameRules: {
        name: [{ required: true, message: "请填写模板名称", trigger: "blur" }]
      },
      // stage 表单
      stageForm: {
        width: 1200,
        height: 628,
        url: "https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E5%A3%81%E7%BA%B8&step_word=&hs=0&pn=20&spn=0&di=44262206120&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=2&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=-1&cs=4171608061%2C3640662274&os=1604884225%2C4238925684&simid=3495308254%2C518288520&adpicid=0&lpn=0&ln=3090&fr=&fmq=1526269427171_R&fm=&ic=0&s=undefined&hd=undefined&latest=undefined&copyright=undefined&se=&sme=&tab=0&width=&height=&face=undefined&ist=&jit=&cg=wallpaper&bdtype=0&oriquery=&objurl=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201409%2F06%2F20140906163254_4atBE.png&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3B17tpwg2_z%26e3Bv54AzdH3Frj5rsjAzdH3F4ks52AzdH3F8lbla0lmaAzdH3F1jpwtsAzdH3F&gsm=0&rpstart=0&rpnum=0&islist=&querylist=&force=undefined"
      },
      // stage 表单验证
      stageRules: {
        width: [{ required: true, validator: vInteger, trigger: "blur" }],
        height: [{ required: true, validator: vInteger, trigger: "blur" }],
        url: [{ type: "url", message: "链接地址不对哦", trigger: "blur" }]
      },
      // stage序列化
      stageJson: {}
    };
  },
  computed: {
    groupForm() {
      return this.$store.state.template.groupForm;
    },
    fontForm() {
      return this.$store.state.template.fontForm;
    },
    tableHeight() {
      if (this.tableHeightData) {
        return this.tableHeightData;
      } else if (this.tableDom) {
        return this.tableDom.clientHeight;
      } else {
        return 330;
      }
    }
  },
  methods: {
    // 画布配置 - 上传图片
    async upload() {
      let _this = this;
      // gray
      let matchStr = /https?:\/\/store2.live.ksmobile.net/; // online

      let formD = new FormData();
      formD.set("file", _this.file);

      const { code, message, data } = await api.postFile(
        AdUploadFileURL,
        formD
      );

      if (code === 200) {
        let newUrl = data[0];
        // gray
        if (newUrl.match(matchStr)) {
          newUrl = newUrl.replace(matchStr, "http://" + document.domain);
        }
        this.stageForm.url = newUrl;

        // 上传的图片宽高
        let _this = this;
        let tmpImg = new Image();

        tmpImg.onload = function() {
          _this.stageForm.width = tmpImg.width;
          _this.stageForm.height = tmpImg.height;
        };
        tmpImg.src = this.stageForm.url;
      } else {
        util.showError(`${code}: ${message}`);
      }
    },
    handleUpload(file) {
      this.file = file;
      this.upload();

      return false;
    },
    // 保存模版
    async saveStage() {
      const saving = this.$Message.loading({
        content: "保存中，请勿操作页面……",
        duration: 0
      });

      // 模版json
      this.configGroups.forEach(item => {
        item.draggable = false;
      });
      this.configFonts.forEach(item => {
        item.draggable = false;
      });

      this.stageJson = {
        name: this.stageName.name,
        configStage: {
          width: this.stageForm.width,
          height: this.stageForm.height,
          url: this.stageForm.url
        },
        configGroups: this.configGroups,
        configFonts: this.configFonts,
        thumbnails: ""
      };

      // 模版图片
      function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(","), // data:img/jpg;base64
          mime = arr[0].match(/:(.*?);/)[1], // img/jpg
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }

      let dataUrl = this.$refs.stage.$refs.stage.getStage().toDataURL(); // base64
      let blob = dataURLtoBlob(dataUrl);
      let formD = new FormData();
      formD.set("file", blob);

      // 上传
      const { code, message, data } = await api.postFile(
        AdUploadFileURL,
        formD
      );

      if (code === 200) {
        this.stageJson.thumbnails = data[0];

        let json = JSON.stringify(this.stageJson);
        let name = this.stageName.name;
        let thumbnails = data[0];
        let m_num = this.stageJson.configGroups.length;

        if (thumbnails !== undefined) {
          const { code, message, data } = await api.post(AdImageTemplateURL, {
            json,
            name,
            thumbnails,
            m_num
          });

          if (code === 200) {
            setTimeout(saving, 0);
            util.showSuccess("Add Success");
            // 刷新模版列表
            this.GetTemplateData();
          } else {
            setTimeout(saving, 0);
            util.showError(`${code}: ${message}`);
          }
        }
      } else {
        setTimeout(saving, 0);
        util.showError(`${code}: ${message}`);
      }
    },
    // 上传psd
    async handleTmpUpload(file) {
      util.showWarning("上传中，请稍等……");
      this.imageModel.form.name = file.name;
      let formD = new FormData();
      formD.set("file", file);
      const { code, message, data } = await api.postFile(
        AdPsdResolveURL,
        formD
      );
      if (code === 200) {
        util.showSuccess("生成模板成功啦^_^");
        this.imageModel.visible = false;
        this.GetTemplateData();
      } else {
        util.showError(`${code}: ${message}`);
      }

      return false;
    }
  }
};
</script>

<style  scoped>
.create-stage {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.template-config {
  background-color: #fff;
  padding: 15px;
}
.title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}
.template-sences {

}
.temp-stage-content {
  border: 1px solid #eee;
  overflow: auto !important;
}
</style>



