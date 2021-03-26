<template>
  <a-modal
    :title="!isEdit ? '新增商品信息' : '编辑商品信息'"
    :visible="visible"
    :target="target"
    :confirm-loading="confirmLoading"
    @ok="!isEdit ? handleSubmit() : hanldeUpdate()"
    @cancel="handleCancel"
  >
    <a-form :form="form" layout="horizontal">
      <a-form-item label="商品名称、英文名">
        <a-input
          class="input"
          placeholder="商品名称（必填）"
          v-decorator="[
            'pro_name',
            { rules: [{ required: true, message: '请填写商品名称!' }] },
          ]"
        />
        <a-input class="input" placeholder="商品英文名（选填）" />
      </a-form-item>
      <a-form-item label="商品封面图">
        <img-upload
          :file-list="showFileList"
          v-decorator="[
            'pro_show_pic',
            { rules: [{ required: true, message: '请上传商品封面图!' }] },
          ]"
        >
        </img-upload>
      </a-form-item>
      <a-form-item label="商品详情图">
        <img-upload
          :file-list="detailFileList"
          v-decorator="[
            'pro_detail_pic',
            { rules: [{ required: true, message: '请上传商品详情图!' }] },
          ]"
        ></img-upload>
      </a-form-item>
      <a-form-item label="商品类别" style="display: inline-block">
        <a-select
          class="select"
          placeholder="请选择"
          v-decorator="[
            'category_nav',
            { rules: [{ required: true, message: '请选择商品分类!' }] },
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
      <a-form-item style="display: inline-block; margin-top: 38px">
        <a-select
          class="select"
          placeholder="请选择"
          v-decorator="['category_sub', { rules: [{ required: false }] }]"
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
          class="select"
          placeholder="请选择"
          v-decorator="[
            'pro_color',
            { rules: [{ required: true, message: '请选择商品颜色!' }] },
          ]"
        >
          <a-select-option v-for="item in colorOptions" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品规格">
        <a-select
          class="select"
          placeholder="请选择"
          v-decorator="[
            'pro_size',
            { rules: [{ required: true, message: '请选择商品规格!' }] },
          ]"
        >
          <a-select-option v-for="item in sizeOptions" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="商品现价">
        <a-input
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
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品原价">
        <a-input
          class="input"
          type="text"
          placeholder="商品原价"
          v-decorator="[
            'pro_old_price',
            { rules: [{ required: false }, { validator: priceValidator }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品库存">
        <a-input
          class="input"
          type="text"
          placeholder="商品库存"
          v-decorator="[
            'pro_stock',
            { rules: [{ required: true, message: '请填写商品库存!' }] },
          ]"
        />
      </a-form-item>
      <a-form-item label="商品权重">
        <!-- <span class="add-on">商品权重</span> -->
        <a-input
          class="input"
          type="text"
          placeholder="0"
          v-decorator="['pro_priority', { rules: [{ required: false }] }]"
        />
      </a-form-item>
      <a-form-item label="文字说明">
        <!-- <span class="add-on" style="margin-top: 3px">文字说明</span> -->
        <a-textarea
          type="text"
          placeholder="选填"
          style="overflow: auto; vertical-align: top; width: auto"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import ImgUpload from "../../components/ImgUpload/index";
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
      showFileList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
      ],
      detailFileList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
      ],
      category,
      colorOptions,
      sizeOptions,
      navData: [], //父类别数组
      subData: [], //子类别
      navId: "",
      subId: "",
      indexNum: 0,
      priceValidator,
    };
  },
  components: {
    ImgUpload,
  },
  created() {
    this.navData = this.category.slice(0, this.category.length);
    this.handleCategory();
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator("pro_name", { initialValue: "" });
    this.form.getFieldDecorator("pro_name_en", { initialValue: "" });
    this.form.getFieldDecorator("pro_price", { initialValue: "" });
    this.form.getFieldDecorator("pro_old_price", { initialValue: "" });
    this.form.getFieldDecorator("pro_color", { initialValue: "1" });
    this.form.getFieldDecorator("pro_size", { initialValue: "1" });
    this.form.getFieldDecorator("category_nav", { initialValue: "1" });
    this.form.getFieldDecorator("category_sub", { initialValue: "1" });
    this.form.getFieldDecorator("pro_priority", { initialValue: "" });
    this.form.getFieldDecorator("pro_stock", { initialValue: "" });
    this.form.getFieldDecorator("pro_show_pic", { initialValue: {} });
    this.form.getFieldDecorator("pro_detail_pic", { initialValue: {} });
    this.form.setFieldsValue({ pro_price: "20" });
  },
  methods: {
    setData(data) {
      const {
        pro_key,
        pro_no,
        pro_name,
        pro_color,
        pro_name_en,
        pro_price,
        pro_old_price,
        pro_stock,
        pro_size,
        pro_priority,
      } = data;
      this.form = {
        ...this.form,
        pro_key,
        pro_no,
        pro_name,
        pro_color,
        pro_name_en,
        pro_price,
        pro_old_price,
        pro_stock,
        pro_size,
        pro_priority,
      };
      this.category_nav = this.target.category.split("/")[0];
      this.category_sub = this.target.category.split("/")[1];
    },
    handleSubmit() {
      this.confirmLoading = true;
      this.form.validateFields((error, values) => {
        console.log(error);
        console.log(values);
        if (!error) {
          console.log(111);
          console.log("Received values of form:", values);
          // value.key = this.proList.length + 1;
          // value.pro_no = this.proList.length + 1;
          if (values.category_sub) {
            values.pro_category =
              values.category_nav + "/" + values.category_sub;
          } else {
            values.pro_category = values.category_nav;
          }
          values.pro_color = this.colorOptions[values.pro_color - 1].name;
          values.pro_size = this.sizeOptions[values.pro_size - 1].name;
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
            this.form.resetFields();
          }, 1000);
        }
      });
    },
    hanldeUpdate() {
      this.confirmLoading = true;

      setTimeout(() => {
        this.$notification.success({
          message: "更新成功",
          duration: 1.5,
        });
        this.confirmLoading = false;
        this.$emit("closeModal");
      }, 1000);
    },
    handleCancel() {
      this.$emit("closeModal");
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
  },
};
</script>