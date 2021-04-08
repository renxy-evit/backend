<template>
  <a-modal
    :title="!isEdit ? '新增颜色信息' : '编辑颜色信息'"
    :visible="visible"
    :target="target"
    :confirm-loading="confirmLoading"
    @ok="!isEdit ? handleAddOk() : handleUpdateOK()"
    @cancel="handleCancel"
  >
    <a-form :form="form" layout="horizontal">
      <a-form-item label="颜色名称">
        <a-input
          autocomplete="off"
          placeholder="颜色名称"
          v-decorator="[
            'color_cn',
            {
              rules: [{ required: true, message: '请填写颜色名称' }],
              initialValue: isEdit ? target.color_cn : '',
            },
          ]"
        ></a-input>
      </a-form-item>
      <a-form-item label="颜色英文">
        <a-input
          autocomplete="off"
          placeholder="英文名称"
          v-decorator="[
            'color_en',
            {
              rules: [{ required: false }],
              initialValue: isEdit ? target.color_en : '',
            },
          ]"
        ></a-input>
      </a-form-item>
      <a-form-item label="颜色代码">
        <template>
          <color-picker
            v-model="target.pick_color"
            @change="handleChooseColor"
          ></color-picker>
        </template>
        <div
          style="margin-left: 10px; font-size: 15px; display: inline-block"
          v-decorator="[
            'pick_color',
            {
              rules: [{ required: true, message: '请输入颜色代码' }],
              initialValue: isEdit ? target.pick_color : '',
            },
          ]"
        >
          {{ target.pick_color }}
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
    },
    isEdit: {
      type: Boolean,
    },
    target: Object,
  },
  data() {
    return {
      color: "#000000",
      confirmLoading: false,
    };
  },
  created() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleAddOk() {
      this.form.validateFields((err, value) => {
        if (!err && value) {
          this.confirmLoading = true;
          console.log("Received values of form:", value);
          value["color_code"] = value.pick_color;
          this.$emit("getSubmitInfo", value);
          setTimeout(() => {
            this.$notification.success({
              message: "提交成功",
              duration: 1.5,
            });
            this.confirmLoading = false;
            this.form.resetFields();
          }, 1000);
        }
      });
    },
    handleUpdateOK() {
      this.form.validateFields((err, value) => {
        if (!err && value) {
          this.confirmLoading = true;
          console.log("Received values of form:", value);
          value["color_code"] = value.pick_color;
          this.$emit("getSubmitInfo", value);
          setTimeout(() => {
            this.$notification.success({
              message: "更新成功",
              duration: 1.5,
            });
            this.confirmLoading = false;
            this.form.resetFields();
          }, 1000);
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.$emit("closeModal");
    },
    handleChooseColor(val) {
      console.log(val);
      this.form.setFieldsValue({
        pick_color: val,
      });
      // this.color = val;
      if (!Object.keys(this.target).includes("color_code")) {
        this.target["pick_color"] = val;
      } else {
        this.target.pick_color = val;
      }
    },
  },
};
</script>