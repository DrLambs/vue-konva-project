<template>
  <div class="stage-config">
    <!-- 模版框配置 -->
    <Form :ref="form" :model="form" :label-width="60" :data-type="formType">
      <!-- 操作按钮 -->
      <FormItem class="group-button">
        <Button @click="addGroup(form)" :disabled="iUpload">添加</Button>
        <Button @click="saveGroup(form)" style="margin: 0 10px;">保存</Button>
        <Button @click="removeGroup(form)">删除</Button>
      </FormItem>
      <!-- 形状/装饰 -->
      <FormItem prop="type" :label="formTypeSelectionName">
        <Select v-model="form.type">
          <Option
            v-for="item in selectionType"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <!-- unique id -->
      <FormItem prop="uniqueId" label="唯一id" class="i-hidden" style="display: none;">
        <Input type="text" v-model="form.uniqueId" :disabled="form.disabled" placeholder="id"></Input>
      </FormItem>
      <!-- opacity -->
      <FormItem prop="opacity" label="透明度" class="i-hidden" style="display: none;">
        <InputNumber v-model="form.opacity"></InputNumber>
      </FormItem>
      <!-- 坐标 X -->
      <FormItem prop="x" label="X">
        <InputNumber v-model="form.x"></InputNumber>
      </FormItem>
      <!-- 坐标 Y -->
      <FormItem prop="y" label="Y">
        <InputNumber v-model="form.y"></InputNumber>
      </FormItem>
      <!-- 宽 -->
      <FormItem prop="width" label="宽" v-show="form.type === 'rect' || form.type === 'image'">
        <InputNumber v-model="form.width"></InputNumber>
      </FormItem>
      <!-- 高 -->
      <FormItem prop="height" label="高" v-show="form.type === 'rect' || form.type === 'image'">
        <InputNumber v-model="form.height"></InputNumber>
      </FormItem>
      <!-- 边长 -->
      <FormItem prop="side" label="边长" v-show="form.type === 'triangle'">
        <InputNumber v-model="form.side"></InputNumber>
      </FormItem>
      <!-- 半径 -->
      <FormItem prop="radius" label="半径" v-show="form.type === 'circle'">
        <InputNumber v-model="form.radius"></InputNumber>
      </FormItem>
      <!-- 模版图片/装饰图片 v-show="form.type !== 'font' && form.type !== 'image'" -->
      <FormItem prop="img" label="模版图片" style="display: none;">
        <Input type="text" v-model="form.src" :clearable="true" placeholder="url" />
      </FormItem>
      <!-- 文字内容 -->
      <FormItem prop="fontText" label="字样" v-show="form.type === 'font'">
        <Input type="text" v-model="form.fontText" :clearable="true" placeholder="demo" />
      </FormItem>
      <!-- 文字字体 -->
      <FormItem prop="fontFamily" label="字体" v-show="form.type === 'font'">
        <Select v-model="form.fontFamily">
          <Option v-for="item in fontFamilyList" :value="item.value" :key="item.id">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <!-- 文字字号 -->
      <FormItem prop="fontSize" label="字号" v-show="form.type === 'font'">
        <Select v-model="form.fontSize">
          <Option v-for="item in fontSizeList" :value="item.id" :key="item.id">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <!-- 文字颜色 -->
      <FormItem prop="fontColor" label="颜色" v-if="form.type === 'font'">
        <div>
          <ColorPicker v-model="form.fontColor"/>
          <Input type="text" v-model="form.fontColor" :clearable="true" style="width: 50%;" />
        </div>
      </FormItem>
      <!-- 装饰图片 -->
      <FormItem prop="upimg" label="上传" v-show="form.type === 'image'">
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
          <i-switch v-model="form.draggable">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </div>
      </FormItem>
      <!-- 旋转 -->
      <FormItem prop="rotation" label="旋转">
        <div class="slider-box">
          <Slider
            v-model="form.rotation"
            :tip-format="rotateTips"
            @on-change="handleRotate(form.rotation)"
          ></Slider>
        </div>
      </FormItem>
      <!-- 缩放 -->
      <FormItem prop="scale" label="缩放">
        <div class="slider-box">
          <Slider v-model="form.scale" :tip-format="scaleTips" @on-change="handleScale(form.scale)"></Slider>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: "stageConfig",
  props: ["formTypeSelectionName", "selectionType", "form", "formType"],
  data() {
    return {
      // 字体列表
      fontFamilyList: [
        {
          id: 0,
          value: "Sans-serif"
        },
        {
          id: 1,
          value: "Helvetica"
        },
        {
          id: 2,
          value: "Arial"
        },
        {
          id: 3,
          value: "Verdana"
        },
        {
          id: 4,
          value: "Tahoma"
        },
        {
          id: 5,
          value: "Lucida Grande"
        },
        {
          id: 6,
          value: "Georgia"
        },
        {
          id: 7,
          value: "Arial Black"
        }
      ],
      // 字号列表
      fontSizeList: [
        {
          id: 12,
          value: "12px"
        },
        {
          id: 14,
          value: "14px"
        },
        {
          id: 16,
          value: "16px"
        },
        {
          id: 18,
          value: "18px"
        },
        {
          id: 20,
          value: "20px"
        },
        {
          id: 24,
          value: "24px"
        },
        {
          id: 32,
          value: "32px"
        },
        {
          id: 36,
          value: "36px"
        },
        {
          id: 44,
          value: "44px"
        },
        {
          id: 56,
          value: "56px"
        },
        {
          id: 60,
          value: "60px"
        },
        {
          id: 72,
          value: "72px"
        }
      ],
      // 表单类型：模版框表单 or 点缀层表单
      cFormType: "",
      // 装饰图片链接
      decorationImageUrl:
        "http://" +
        document.domain +
        "/ad_material_temp/9ed0ff276fa8590f8dec7c1971a3b1c7.png",

      iClick: false
    };
  },
  computed: {
    // 装饰图片没有上传完不能点击添加
    iUpload() {
      return this.iClick;
    }
  },
  methods: {
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
        if (data[0].match(matchStr)) {
          newUrl = data[0].replace(matchStr, "http://" + document.domain);
        }

        _this.decorationImageUrl = newUrl;
        let dimg = new Image();
        dimg.src = _this.decorationImageUrl;
        dimg.onload = function() {
          _this.$store.state.stage.fontForm.width = dimg.width;
          _this.$store.state.stage.fontForm.height = dimg.height;

          _this.iClick = false;
          util.showSuccess("上传成功");
          _this.addGroup(_this.form);
        };
      } else {
        util.showError(`${code}: ${message}`);
      }
    },
    handleUpload(file) {
      util.showWarning("上传中，请稍等……");
      this.iClick = true;
      this.file = file;
      this.upload();

      return false;
    },
    // deepClone
    deepClone(origin, target) {
      var target = target || {};
      var toStr = Object.prototype.toString;
      var arrStr = "[object Array]";
      for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
          // 引用值
          if (origin[prop] !== null && typeof origin[prop] == "object") {
            // 是数组
            if (toStr.call(origin[prop]) == arrStr) {
              target[prop] = [];
            }
            // 是对象
            else {
              target[prop] = {};
            }
            this.deepClone(origin[prop], target[prop]);
          }
          // 原始值
          else {
            // 可以转为数字并且不是NaN，转为数字存储。否则正常不转换存储
            if (
              typeof parseInt(origin[prop]) === "number" &&
              !isNaN(parseInt(origin[prop]))
            ) {
              target[prop] = parseInt(origin[prop]);
            } else {
              target[prop] = origin[prop];
            }
          }
        }
      }
      return target;
    },
    // 旋转滑块
    handleRotate(val) {
      this.form.rotation = val;
    },
    // 旋转滑块提示文字
    rotateTips(val) {
      return Math.floor((val / 100) * 360) + " Deg";
    },
    // 缩放滑块
    handleScale(val) {
      this.form.scale = val;
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
    handleSave(name, handle) {
      let _clone = {};
      this.cFormType = this.$refs[name].$attrs["data-type"];

      let _src =
        this.cFormType === "font"
          ? this.decorationImageUrl
          : this.$refs[name].model.src;
      let _img =
        this.cFormType === "font"
          ? this.newImage(this.decorationImageUrl)
          : this.newImage(this.$refs[name].model.src);

      // 克隆当前表单对象
      this.deepClone(this.$refs[name].model, _clone);
      _clone.img = _img;
      _clone.src = _src;
      _clone.stroke = "transparent";
      this.$store.commit(handle, [_clone, this.cFormType]);
    },
    // 添加
    addGroup(name) {
      if (this.$refs[name].model.disabled) {
        util.showWarning("请先保存修改再添加");
        return;
      } else {
        this.handleSave(name, "add");
        // 记录下一次开始的 uniqueId
        this.form.uniqueId++;
        this.$store.commit("unique", [this.form.uniqueId, this.cFormType]);
        util.showSuccess("Success!");
      }
    },
    // 保存
    saveGroup(name) {
      // 没选中就保存，提示警告信息
      if (!this.$refs[name].model.disabled) {
        util.showWarning("请选中要修改的图层");
        return;
      }
      // 选中之后方可保存
      else {
        this.handleSave(name, "save");
        util.showSuccess("Success!");
      }
    },
    // 删除
    removeGroup(name) {
      this.cFormType = this.$refs[name].$attrs["data-type"];

      // 没选中就删除，提示警告信息
      if (!this.$refs[name].model.disabled) {
        util.showWarning("请选中要删除的图层");
        return;
      }
      // 选中之后方可删除
      else {
        if (window.confirm("确认删除所选图层吗?")) {
          this.$store.commit("remove", this.cFormType);
          this.$Message.success("Success!");
        }
      }
    }
  }
};
</script>

<style scoped>
</style>



