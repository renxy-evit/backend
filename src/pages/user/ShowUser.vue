<template>
  <a-card>
    <a-form :form="form" @submit.prevent="handleSubmit" layout="horizontal">
      <a-form-item
        label="姓名"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          allow-clear
          style="margin-bottom: 20px; width: 60%"
          autocomplete="off"
          v-decorator="[
            'user_name',
            {
              rules: [{ required: true, message: '请填写姓名' }],
              initialValue: userInfo.user_name,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="性别"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-select
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
          placeholder="请选择"
          style="margin-bottom: 20px; width: 60%"
          v-decorator="[
            'user_gender',
            {
              rules: [{ required: true, message: '请选择父类别!' }],
              initialValue: userInfo.user_gender,
            },
          ]"
        >
          <a-select-option v-for="item in ['男', '女']" :key="item">{{
            item
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="生日"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-date-picker
          style="margin-bottom: 20px; width: 60%"
          placeholder="请选择生日日期"
          valueFormat="YYYY-MM-DD"
          v-decorator="[
            'user_birth',
            { rules: [{ required: false }], initialValue: userInfo.user_birth },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="个人简介"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-textarea
          type="text"
          style="
            overflow: auto;
            vertical-align: top;
            margin-bottom: 20px;
            width: 60%;
          "
          v-decorator="[
            'user_introduction',
            {
              rules: [{ required: false }],
              initialValue: userInfo.user_introduction,
            },
          ]"
        />
      </a-form-item>
      <span>
        <a-button
          type="primary"
          html-type="submit"
          style="margin-left: -50px"
          class="center"
          >保存</a-button
        >
        <a-button style="margin-left: 50px" class="center" @click="handleReset"
          >重置</a-button
        >
      </span>
    </a-form>
  </a-card>
</template>
<script>
const userInfo = {
  user_name: "张三",
  user_gender: "男",
  user_birth: "2000-04-07",
  user_introduction: "哈哈哈",
  user_nickName: "admin",
  user_mail: "112233@163.com",
  user_oldPwd: "123321",
  user_newPwd: "",
};
export default {
  data() {
    return {
      userInfo,
    };
  },
  created() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit() {
      const { userInfo } = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values) {
            console.log(values);
            userInfo.user_name = values.user_name;
            userInfo.user_gender = values.user_gender;
            userInfo.user_birth = values.user_birth;
            userInfo.user_introduction = values.user_introduction
              ? values.user_introduction
              : "";
            this.$notification.success({
              message: "保存成功!",
              duration: 1.5,
            });
          }
        }
      });
    },
    handleReset() {
      this.form.resetFields();
      this.$notification.success({
        message: "重置成功!",
        duration: 1.5,
      });
    },
  },
};
</script>
<style>
.center {
  position: relative;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>