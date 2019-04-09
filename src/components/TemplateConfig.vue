<template>
  <div class="stage-config">
    <!-- 模版框配置 -->
    <Form :model="config" :label-width="45">
      <!-- 操作按钮 -->
      <FormItem class="group-button">
        <Button @click="addGroup">添加</Button>
        <Button @click="saveGroup" style="margin: 0 4px;">保存</Button>
        <Button @click="removeGroup">删除</Button>
      </FormItem>
      <!-- 形状/装饰 -->
      <FormItem prop="type" :label="typeText">
        <Select v-model="config.type">
          <Option v-for="item in typeList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <!-- unique id -->
      <FormItem prop="uniqueId" label="ID" style="display: -none;">
        <InputNumber v-model="config.uniqueId" :disabled="true" placeholder="id"></InputNumber>
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
      <FormItem prop="img" label="URL">
        <Input type="textarea" :rows="6" v-model="config.src" placeholder="url"/>
      </FormItem>
      <!-- 文字内容 -->
      <FormItem prop="fontText" label="文字" v-if="config.type === 'font'">
        <Input type="text" v-model="config.fontText" :clearable="true" placeholder="demo"/>
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
          <Input type="text" v-model="config.fontColor" :clearable="true" style="width: 50%;"/>
        </div>
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
        <CommonSliderBar :form="config" unit="Deg"></CommonSliderBar>
      </FormItem>
      <!-- 缩放 -->
      <FormItem prop="scale" label="缩放">
        <CommonSliderBar :form="config" unit="%"></CommonSliderBar>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import list from "../libs/list.js";
import util from "../libs/util.js";
import _ from "lodash";
import { mapMutations } from "vuex";
import CommonSliderBar from "./CommonSliderBar";

export default {
  name: "TemplateConfig",
  components: {
    CommonSliderBar
  },
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
      return this.configType === "group" ? "形状" : "装饰";
    }
  },
  methods: {
    ...mapMutations(["setConfigType", "add", "save", "remove"]),
    // 克隆当前表单对象
    getCloneConfig() {
      const clone = _.cloneDeep(this.config);
      clone.img = util.newImage(clone.src);
      clone.stroke = "transparent";
      return clone;
    },
    // 添加
    addGroup() {
      // 设置当前配置类型: group/font
      this.setConfigType(this.configType);
      if (this.config.disabled) {
        util.showWarning("请先保存修改再添加");
        return;
      } else {
        this.add(this.getCloneConfig());
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
        this.remove();
        util.showSuccess("Success!");
      }
    }
  }
};
</script>
