<template>
  <div class="stage-config">
    <!-- 模版框配置 -->
    <Form :model="config" :label-width="60">
      <!-- 操作按钮 -->
      <FormItem class="group-button">
        <Button @click="addGroup" :disabled="iUpload">添加</Button>
        <Button @click="saveGroup" style="margin: 0 10px;">保存</Button>
        <Button @click="removeGroup">删除</Button>
      </FormItem>
      <!-- 形状/装饰 -->
      <FormItem prop="type" :label="typeText">
        <Select v-model="config.type">
          <Option
            v-for="item in typeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <!-- unique id -->
      <FormItem prop="uniqueId" label="唯一id" style="display: -none;">
        <InputNumber type="text" v-model="config.uniqueId" :disabled="config.disabled" placeholder="id"></InputNumber>
      </FormItem>
      <!-- opacity -->
      <FormItem prop="opacity" label="透明度">
        <InputNumber v-model="config.opacity"></InputNumber>
      </FormItem>
      <!-- 坐标 X -->
      <FormItem prop="x" label="X">
        <InputNumber v-model="config.x"></InputNumber>
      </FormItem>
      <!-- 坐标 Y -->
      <FormItem prop="y" label="Y">
        <InputNumber v-model="config.y"></InputNumber>
      </FormItem>
      <!-- 宽 -->
      <FormItem prop="width" label="宽" v-if="config.type === 'rect' || config.type === 'image'">
        <InputNumber v-model="config.width"></InputNumber>
      </FormItem>
      <!-- 高 -->
      <FormItem prop="height" label="高" v-if="config.type === 'rect' || config.type === 'image'">
        <InputNumber v-model="config.height"></InputNumber>
      </FormItem>
      <!-- 边长 -->
      <FormItem prop="side" label="边长" v-if="config.type === 'triangle'">
        <InputNumber v-model="config.side"></InputNumber>
      </FormItem>
      <!-- 半径 -->
      <FormItem prop="radius" label="半径" v-if="config.type === 'circle'">
        <InputNumber v-model="config.radius"></InputNumber>
      </FormItem>
      <!-- 模版图片/装饰图片 -->
      <FormItem prop="img" label="模版图片">
        <Input type="text" v-model="config.src" :clearable="true" placeholder="url" />
      </FormItem>
      <!-- 文字内容 -->
      <FormItem prop="fontText" label="文字" v-if="config.type === 'font'">
        <Input type="text" v-model="config.fontText" :clearable="true" placeholder="demo" />
      </FormItem>
      <!-- 文字字体 -->
      <FormItem prop="fontFamily" label="字体" v-if="config.type === 'font'">
        <Select v-model="config.fontFamily">
          <Option v-for="item in fontFamilyList" :value="item.value" :key="item.id">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <!-- 文字字号 -->
      <FormItem prop="fontSize" label="字号" v-if="config.type === 'font'">
        <Select v-model="config.fontSize">
          <Option v-for="item in fontSizeList" :value="item.id" :key="item.id">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <!-- 文字颜色 -->
      <FormItem prop="fontColor" label="颜色" v-if="config.type === 'font'">
        <div>
          <ColorPicker v-model="config.fontColor"/>
          <Input type="text" v-model="config.fontColor" :clearable="true" style="width: 50%;" />
        </div>
      </FormItem>
      <!-- 装饰图片 -->
      <FormItem prop="upimg" label="上传" v-if="config.type === 'image'">
        <Upload
          ref="upload"
          action="/"
          accept="['png']"
          :max-size="300"
          :before-upload="handleUpload"
        >
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
      </FormItem>
      <!-- 拖拽 -->
      <FormItem prop="draggable" label="拖拽">
        <div style="width: 160px;">
          <i-switch v-model="config.draggable">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </div>
      </FormItem>
      <!-- 旋转 -->
      <FormItem prop="rotation" label="旋转">
        <div class="slider-box">
          <Slider
            v-model="config.rotation"
            :tip-format="rotateTips"
            @on-change="handleRotate(config.rotation)"
          ></Slider>
        </div>
      </FormItem>
      <!-- 缩放 -->
      <FormItem prop="scale" label="缩放">
        <div class="slider-box">
          <Slider v-model="config.scale" :tip-format="scaleTips" @on-change="handleScale(config.scale)"></Slider>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import list from "../../libs/list.js";
import _ from "lodash";
import util from "../../libs/util.js";
import { mapMutations } from "vuex";

// ID 累加器
function* idMaker() {
  let index = 0;
  while(true)
    yield index++;
}

export default {
  name: "stageConfig",
  props: {
    // 模板框配置/装饰配置
    configType: {
      type: String,
      default: "group"
    },
    // 形状列表/装饰列表
    typeList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      iClick: false,
      // 字体列表
      fontFamilyList: list.fontFamilyList,
      // 字号列表
      fontSizeList: list.fontSizeList
    };
  },
  computed: {
    // 表单
    config() {
      return this.$store.state.template.config[this.configType];
    },
    // 表单初始化
    initConfig() {
      return this.$store.state.template.initConfig[this.configType];
    },
    typeText() {
      return this.configType === 'group' ? "形状" : "装饰";
    },
    // 装饰图片没有上传完不能点击添加
    iUpload() {
      return this.iClick;
    }
  },
  methods: {
    ...mapMutations([
      "setConfigType",
      "add",
      "save",
      "remove",
      "unique"
    ]),
    // 添加
    addGroup() {
      // 设置当前配置类型: group/font
      this.setConfigType(this.configType);

      if (this.config.disabled) {
        util.showWarning("请先保存修改再添加");
        return;
      } else {
        this.add(this.getCloneConfig());
        // 记录下一次开始的 uniqueId
        this.config.uniqueId++;
        this.unique(this.config.uniqueId);
        util.showSuccess("Success!");
      }
    },
    // 保存
    saveGroup() {
      // 设置当前配置类型: group/font
      this.setConfigType(this.configType);

      // 没选中就保存，提示警告信息
      if (!this.config.disabled) {
        util.showWarning("请选中要修改的图层");
        return;
      } else {
        this.save(this.getCloneConfig());
        util.showSuccess("Success!");
      }
    },
    // 删除
    removeGroup() {
      // 设置当前配置类型: group/font
      this.setConfigType(this.configType);
      
      // 没选中就删除，提示警告信息
      if (!this.config.disabled) {
        util.showWarning("请选中要删除的图层");
        return;
      } else {
        if (window.confirm("确认删除所选图层吗?")) {
          this.remove();
          util.showSuccess("Success!");
        }
      }
    },
    // 旋转滑块
    handleRotate(val) {
      this.config.rotation = val;
    },
    // 旋转滑块提示文字
    rotateTips(val) {
      return Math.floor((val / 100) * 360) + " Deg";
    },
    // 缩放滑块
    handleScale(val) {
      this.config.scale = val;
    },
    // 缩放滑块提示文字
    scaleTips(val) {
      return (1 + val / 100).toFixed(2) + " %";
    },
    // 创建 image 对象
    newImage(src) {
      let img = new Image();
      img.src = src;
      return img;
    },
    // 克隆当前表单对象
    getCloneConfig() {
      const clone = _.cloneDeep(this.config);
      clone.img = this.newImage(clone.src);
      clone.stroke = "transparent";
      return clone;
    },
    // 上传模板框图片
    async upload() {
      console.log("上传图片");
      // 上传成功后获取图片信息
      /** this.config.src = data.src;
       *  let img = new Image();
          img.onload = function() {
            this.config.width = img.width;
            this.config.height = img.height;
          };
          img.src = this.config.url;
      */
      this.iClick = false;
    },
    handleUpload(file) {
      this.iClick = true;
      this.file = file;
      this.upload();
      return false;
    }
  }
};
</script>
