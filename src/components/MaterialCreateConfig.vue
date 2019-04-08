<template>
  <div class="material-config">
    <Form :model="config" :label-width="60">
      <!-- unique id -->
      <FormItem prop="uniqueId" label="当前选中">
        <Input type="text" v-model="config.uniqueId" disabled placeholder="已选中的模版框" />
      </FormItem>

      <!-- 选择图片 -->
      <FormItem prop="surl" label="选择图片">
        <Button class="btn" @click="showImageGallery = true">选择图片</Button>
      </FormItem>

      <!-- 坐标 X -->
      <FormItem prop="x" label="X">
        <InputNumber v-model="config.x"></InputNumber>
      </FormItem>

      <!-- 坐标 Y -->
      <FormItem prop="y" label="Y">
        <InputNumber v-model="config.y"></InputNumber>
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
import CommonSliderBar from "./CommonSliderBar";

export default {
  name: "MaterialConfig",
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    CommonSliderBar
  },
  data() {
    return {
      // 选择图片
      showImageGallery: false,
      // 选择的图片url,id
      selectedJson: {}
    };
  },
  mounted() {},
  methods: {
    // 创建素材选择图片
    getSelectedUrl(json) {
      this.selectedJson = json;
    },
    // 确定
    handleOk() {
      this.$store.commit("setUrl", this.selectedJson);
      this.$Message.success("success");
    },
    // 取消
    handleCancel() {
      return;
    }
  }
};
</script>

<style>
.material-config {
  background: #f2f2f2;
  border: 1px solid #dcdee2;
  border-radius: 5px;
  padding: 30px;
}
</style>
