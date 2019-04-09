<template>
  <div class="slider-box">
    <div class="slider-box-wrap">
      <input v-if="unit.toLowerCase() === 'deg'" v-model="form.rotation" type="hidden">
      <input v-if="unit.toLowerCase() === '%'" v-model="form.scale" type="hidden">
      <div class="slider-bar"></div>
      <div
        class="slider-button-wrap"
        @mouseover="iTooltip = true"
        @mouseout="iTooltip = false"
        @mousedown="getDragStart"
      >
        <div class="slider-botton"></div>
        <transition name="fade">
          <div class="tooltip" v-if="iTooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-content">{{ numTooltip }} {{ unit }}</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonSliderBar",
  props: {
    form: {
      type: Object,
      default() {
        return {
          rotation: 0,
          scale: 1
        };
      }
    },
    unit: {
      type: String,
      default: 'deg'
    }
  },
  data() {
    return {
      iTooltip: false,
      numTooltip: 0,
      numTrans: 0,
      disX: 0,
      dragTarget: null,
      dragLeft: ""
    };
  },
  methods: {
    getDragStart(e) {
      this.disX = e.clientX;
      this.dragTarget = e.target.parentNode;

      let oSliderWidth = document.querySelector(".slider-box-wrap").clientWidth || 176;
      this.dragLeft =
        this.dragLeft === ""
          ? oSliderWidth / 2
          : parseInt(this.dragTarget.style.left);
      let oButton = e.target;
      oButton.classList.add("slider-botton-hover");

      document.onmousemove = e => {
        let left = e.clientX - this.disX + this.dragLeft;
        let max = oSliderWidth;
        left = left < 0 ? 0 : left;
        left = left > max ? max : left;

        // 旋转 numTrans  > 60 -> 180  < 60 -> -180
        if (this.unit.toLowerCase() === "deg") {
          this.numTrans =
            this.dragLeft === ""
              ? 0
              : parseInt(((left - oSliderWidth / 2) * 180) / (oSliderWidth / 2));
          this.form.rotation = this.numTrans;
          this.numTooltip = this.numTrans;
        }
        // 缩放 numTrans  > 60 -> 200%  < 60 -> 0
        else if (this.unit.toLowerCase() === "%") {
          this.numTrans =
            this.dragLeft === ""
              ? 0
              : Math.floor(
                  (left - oSliderWidth / 2) *
                    (100 / (oSliderWidth / 2)).toFixed(2)
                );
          this.numTrans = this.numTrans < -100 ? -100 : this.numTrans;
          this.form.scale = this.numTrans;
          this.numTooltip = this.numTrans + 100;
        }
        this.dragTarget.style.left = left + "px";
      };
      document.onmouseup = () => {
        oButton.classList.remove("slider-botton-hover");
        this.iTooltip = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
};
</script>

<style>
.slider-box-wrap {
  position: relative;
}

.slider-bar {
  width: 100%;
  height: 4px;
  margin: 16px 0;
  background-color: #e9eaec;
  border-radius: 3px;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
}

.slider-button-wrap {
  width: 18px;
  height: 18px;
  text-align: center;
  background-color: transparent;
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
}

.slider-botton {
  width: 12px;
  height: 12px;
  border: 2px solid #47cb89;
  border-radius: 50%;
  background-color: #fff;
  transition: all 0.2s linear;
  outline: 0;
}

.slider-botton:hover {
  cursor: grabbing;
  border-color: #19be6b;
  transform: scale(1.5);
}

.slider-botton-hover {
  cursor: grabbing;
  border-color: #19be6b;
  transform: scale(1.5);
}

.tooltip {
  display: block;
  visibility: visible;
  font-size: 12px;
  line-height: 1.5;
  position: absolute;
  z-index: 1060;
  padding: 5px 0 8px;
  will-change: top, left;
  top: -47px;
  left: -19px;
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  bottom: 3px;
  border-width: 5px 5px 0;
  border-top-color: rgba(70, 76, 91, 0.9);
  left: 50%;
  margin-left: -5px;
}

.tooltip-content {
  max-width: 250px;
  min-height: 34px;
  padding: 8px 12px;
  color: #fff;
  text-align: left;
  text-decoration: none;
  background-color: rgba(70, 76, 91, 0.9);
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}
</style>
