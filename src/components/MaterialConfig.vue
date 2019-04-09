<template>
  <div class="material-config">
    <Form :model="config" :label-width="45">
      <!-- unique id -->
      <FormItem prop="uniqueId" label="ID">
        <Input type="text" v-model="config.uniqueId" disabled placeholder="已选中的模版框" />
      </FormItem>

      <!-- 选择图片 -->
      <FormItem prop="src" label="地址">
        <Input type="textarea" :rows="6" v-model="config.src" placeholder="图片地址" @on-change="changeImage" />
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
import util from "../libs/util.js";
import { mapState, mapMutations } from "vuex";
import CommonSliderBar from "./CommonSliderBar";

export default {
  name: "MaterialConfig",
  components: {
    CommonSliderBar
  },
  computed: {
    ...mapState({
      config: state => state.material.config
    })
  },
  methods: {
    ...mapMutations(['setUrl']),
    changeImage() {
      const img = util.newImage(this.config.src);
      img.onload = () => {
        this.setUrl(img);
      }
    }
  }
};
</script>

<style>
.material-config {
  background: #f2f2f2;
  border: 1px solid #dcdee2;
  border-radius: 5px;
  padding: 15px;
  min-width: 250px;
  height: 100%;
  overflow: hidden auto;
}
</style>
