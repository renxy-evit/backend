<template>
  <a-modal
    :title="!isEdit ? '新增商品信息' : '编辑商品信息'"
    :visible="visible"
    :target="target"
    :confirm-loading="confirmLoading"
    @ok="!isEdit ? handleSubmit() : hanldeUpdate()"
    @cancel="!isEdit ? handleCancel() : handleEditCancel()"
  >
    <a-form :form="form" layout="horizontal">
      <a-form-item label="商品名称、英文名" style="display: inline-block">
        <a-input
          :disabled="!isEdit && target.pro_name ? true : false"
          autocomplete="off"
          class="input"
          placeholder="商品名称（必填）"
          v-decorator="[
            'pro_name',
            {
              rules: [{ required: true, message: '请填写商品名称!' }],
              initialValue: target.pro_name,
            },
          ]"
        />
      </a-form-item>
      <a-form-item style="display: inline-block; margin-top: 39px">
        <a-input
          :disabled="!isEdit && target.pro_name_en ? true : false"
          autocomplete="off"
          class="input"
          placeholder="商品英文名（选填）"
          v-decorator="[
            'pro_name_en',
            {
              rules: [{ required: true, message: '请填写商品名称!' }],
              initialValue: target.pro_name_en,
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品封面图">
        <vuedraggable
          class="vue-draggable"
          tag="ul"
          v-model="target.pro_show_pic"
          draggable=".draggable-item"
          @start="onDragStart"
          @end="onDragEnd"
          style="display: inline-block"
        >
          <li
            v-for="(item, index) in target.pro_show_pic"
            :key="item + index"
            class="draggable-item"
          >
            <img
              :src="item.url"
              :style="{ width: 100 + 'px', height: 80 + 'px' }"
            />
            <div
              v-if="isEdit || (!isEdit && !target.pro_detail_pic)"
              class="shadow"
              @click="onRemoveHandler(index, target.pro_show_pic)"
            >
              <a-icon type="delete" />
            </div>
          </li>
        </vuedraggable>
        <img-upload
          style="display: inline-block"
          v-if="isEdit || (!isEdit && !target.pro_detail_pic)"
          @handleChange="handleShowChange"
          v-decorator="[
            'pro_show_pic',
            {
              rules: [{ required: false, message: '请上传商品封面图!' }],
            },
          ]"
        ></img-upload>
      </a-form-item>
      <a-form-item label="商品详情图">
        <vuedraggable
          class="vue-draggable"
          tag="ul"
          v-model="target.pro_detail_pic"
          draggable=".draggable-item"
          @start="onDragStart"
          @end="onDragEnd"
          style="display: inline-block"
        >
          <li
            v-for="(item, index) in target.pro_detail_pic"
            :key="item + index"
            class="draggable-item"
          >
            <img
              :src="item.url"
              :style="{ width: 100 + 'px', height: 80 + 'px' }"
            />
            <div
              v-if="isEdit || (!isEdit && !target.pro_detail_pic)"
              class="shadow"
              @click="onRemoveHandler(index, target.pro_detail_pic)"
            >
              <a-icon type="delete" />
            </div>
          </li>
        </vuedraggable>
        <img-upload
          style="display: inline-block"
          v-if="isEdit || (!isEdit && !target.pro_detail_pic)"
          @handleChange="hanldeDetailChange"
          v-decorator="[
            'pro_detail_pic',
            {
              rules: [{ required: false, message: '请上传商品详情图!' }],
            },
          ]"
        ></img-upload>
      </a-form-item>
      <a-form-item label="商品类别" style="display: inline-block">
        <a-select
          :disabled="!isEdit && target.category_nav ? true : false"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
          class="select"
          placeholder="请选择"
          v-decorator="[
            'category_nav',
            {
              rules: [{ required: true, message: '请选择商品分类!' }],
              initialValue: target.category_nav,
            },
          ]"
        >
          <a-select-option
            v-for="nav in navData"
            :key="nav.id"
            :value="nav.name"
            >{{ nav.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item style="display: inline-block; margin-top: 39px">
        <a-select
          :disabled="!isEdit && target.category_nav ? true : false"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
          class="select"
          placeholder="请选择"
          v-decorator="[
            'category_sub',
            {
              rules: [{ required: false }],
              initialValue: target.category_sub || [],
            },
          ]"
        >
          <a-select-option
            v-for="sub in subData"
            :key="sub.id"
            :value="sub.name"
            >{{ sub.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="商品颜色">
        <a-select
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
          class="select"
          placeholder="请选择"
          v-decorator="[
            'pro_color',
            {
              rules: [{ required: true, message: '请选择商品颜色!' }],
              initialValue: target.pro_color,
            },
          ]"
        >
          <a-select-option v-for="item in colorOptions" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品规格">
        <a-select
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
          class="select"
          placeholder="请选择"
          v-decorator="[
            'pro_size',
            {
              rules: [{ required: true, message: '请选择商品规格!' }],
              initialValue: this.target.pro_size,
            },
          ]"
        >
          <a-select-option v-for="item in sizeOptions" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品现价">
        <a-input
          autocomplete="off"
          class="input"
          type="text"
          placeholder="商品现价"
          v-decorator="[
            'pro_price',
            {
              rules: [
                { required: true, message: '请填写商品价格!' },
                { validator: priceValidator },
              ],
              initialValue: isEdit ? this.target.pro_price : '',
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品原价">
        <a-input
          autocomplete="off"
          class="input"
          type="text"
          placeholder="商品原价"
          v-decorator="[
            'pro_old_price',
            {
              rules: [{ required: false }, { validator: priceValidator }],
              initialValue: isEdit ? this.target.pro_old_price : '',
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品库存">
        <a-input
          autocomplete="off"
          class="input"
          type="text"
          placeholder="商品库存"
          v-decorator="[
            'pro_stock',
            {
              rules: [{ required: true, message: '请填写商品库存!' }],
              initialValue: isEdit ? this.target.pro_stock : '',
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品权重">
        <!-- <span class="add-on">商品权重</span> -->
        <a-input
          autocomplete="off"
          class="input"
          type="text"
          placeholder="0"
          v-decorator="[
            'pro_priority',
            {
              rules: [{ required: false }],
              initialValue: isEdit ? this.target.pro_priority : '',
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="文字说明">
        <!-- <span class="add-on" style="margin-top: 3px">文字说明</span> -->
        <a-textarea
          type="text"
          placeholder="选填"
          style="overflow: auto; vertical-align: top; width: auto"
          v-decorator="[
            'pro_detail',
            {
              rules: [{ required: false }],
              initialValue: isEdit ? this.target.pro_detail : '',
            },
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import ImgUpload from "../../components/ImgUpload/index";
import vuedraggable from "vuedraggable";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    target: {
      type: Object,
    },
  },
  data() {
    const priceValidator = (rule, value, callback) => {
      if (value <= 0 && value.length > 0) {
        callback(new Error("价格必须为正数！"));
      } else {
        callback();
      }
    };
    const category = [
      {
        id: 1,
        name: "类别1",
        sub: [
          {
            id: 3,
            name: "子类别1",
          },
          {
            id: 4,
            name: "子类别2",
          },
          {
            id: 5,
            name: "子类别3",
          },
        ],
      },
      {
        id: 2,
        name: "类别2",
        sub: [
          {
            id: 6,
            name: "子类别11",
          },
          {
            id: 7,
            name: "子类别22",
          },
        ],
      },
    ];
    const colorOptions = [
      {
        id: 1,
        name: "颜色1",
      },
      {
        id: 2,
        name: "颜色2",
      },
      {
        id: 3,
        name: "颜色3",
      },
    ];
    const sizeOptions = [
      {
        id: 1,
        name: "规格1",
      },
      {
        id: 2,
        name: "规格2",
      },
      {
        id: 3,
        name: "规格3",
      },
    ];
    return {
      confirmLoading: false,
      pro_show_pic: [],
      pro_detail_pic: [],
      category,
      colorOptions,
      sizeOptions,
      navData: [], //父类别数组
      subData: [], //子类别
      navId: "",
      subId: "",
      indexNum: 0,
      priceValidator,
      disbaled: false,
    };
  },
  components: {
    ImgUpload,
    vuedraggable,
  },
  created() {
    this.navData = this.category.slice(0, this.category.length);
    this.handleCategory();
    this.form = this.$form.createForm(this);
  },
  methods: {
    dragShowEnd(value) {
      this.pro_show_pic = value;
      console.log(this.pro_show_pic);
    },
    dragDetailEnd(value) {
      this.pro_detail_pic = value;
      console.log(this.pro_detail_pic);
    },
    handleSubmit() {
      this.form.validateFields((error, values) => {
        console.log(values);
        if (!error && values) {
          this.confirmLoading = true;
          if (values.category_sub) {
            values.pro_category =
              values.category_nav + "/" + values.category_sub;
          } else {
            values.pro_category = values.category_nav;
          }
          if (values.pro_color) {
            values.pro_color = this.colorOptions[values.pro_color - 1].name;
          }
          if (values.pro_size) {
            values.pro_size = this.sizeOptions[values.pro_size - 1].name;
          }
          values.pro_detail_pic = this.target.pro_detail_pic;
          values.pro_show_pic = this.target.pro_show_pic;
          values.pro_sales = 0;
          delete values.category_sub;
          delete values.category_nav;
          this.$emit("getSubmitInfo", values);
          setTimeout(() => {
            this.$notification.success({
              message: "提交成功",
              duration: 1.5,
            });
            this.confirmLoading = false;
            this.$emit("closeModal");
            this.target.pro_show_pic = [];
            this.target.pro_detail_pic = [];
            this.form.resetFields();
          }, 1000);
        }
      });
    },
    hanldeUpdate() {
      this.form.validateFields((error, values) => {
        if (!error && values) {
          this.confirmLoading = true;
          console.log(typeof values.pro_color);
          if (values.category_sub) {
            values.pro_category =
              values.category_nav + "/" + values.category_sub;
          } else {
            values.pro_category = values.category_nav;
          }
          if (values.pro_color) {
            if (typeof values.pro_color == "number") {
              values.pro_color = this.colorOptions[values.pro_color - 1].name;
            }
          }
          if (values.pro_size) {
            if (typeof values.pro_size == "number") {
              values.pro_size = this.sizeOptions[values.pro_size - 1].name;
            }
          }
          values.pro_sales = 0;
          values.pro_detail_pic = this.target.pro_detail_pic;
          values.pro_show_pic = this.target.pro_show_pic;
          delete values.category_sub;
          delete values.category_nav;
          console.log(values);
          this.$emit("getSubmitInfo", values);
          setTimeout(() => {
            this.$notification.success({
              message: "更新成功",
              duration: 1.5,
            });
            this.confirmLoading = false;
            this.$emit("closeEditModal");
            this.form.resetFields();
          }, 1000);
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.$emit("closeModal");
    },
    handleEditCancel() {
      this.form.resetFields();
      this.$emit("closeEditModal");
    },
    handleCategory() {
      for (let i in this.navData.length) {
        if (this.navData[i].id === this.navId) {
          this.indexNum = i;
          break;
        }
      }
      this.subData = this.navData[this.indexNum].sub;
    },
    onDragStart(e) {
      e.target.classList.add("hideShadow");
    },
    onDragEnd(e) {
      e.target.classList.remove("hideShadow");
    },
    // 移除单张图片
    onRemoveHandler(index, array) {
      this.$confirm({
        title: "确定删除该图片?",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        onOk() {
          // this.imgList = this.imgList.filter((v, i) => {
          //   return i !== index;
          // });
          array.splice(index, 1);
        },
      });
    },
    handleShowChange(file) {
      this.pro_show_pic.push(file);
      if (!Object.keys(this.target).includes("pro_show_pic")) {
        this.target["pro_show_pic"] = [];
      }
      this.target.pro_show_pic.push(file);
      this.$forceUpdate();
    },
    hanldeDetailChange(file) {
      this.pro_detail_pic.push(file);
      if (!Object.keys(this.target).includes("pro_detail_pic")) {
        this.target["pro_detail_pic"] = [];
      }
      this.target.pro_detail_pic.push(file);
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="less" scoped>
.vue-draggable {
  display: flex;
  flex-wrap: wrap;

  .draggable-item {
    float: left;
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
}
</style>