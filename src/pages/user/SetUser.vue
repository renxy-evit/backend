<template>
  <a-card>
    <a-form :form="form" @submit.prevent="handleSubmit" layout="horizontal">
      <a-form-item
        label="用户名"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          style="margin-bottom: 20px; width: 60%"
          allow-clear
          autocomplete="off"
          v-decorator="[
            'user_nickName',
            {
              rules: [{ required: true, message: '请填写用户名' }],
              initialValue: userInfo.user_nickName,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="用户头像"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-upload
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :before-upload="beforeUpload"
          @change="handleChange"
          v-decorator="[
            'user_avatar',
            {
              rules: [{ required: false }],
              initialValue: userInfo.user_avatar,
            },
          ]"
        >
          <img
            v-if="userInfo.user_avatar"
            :src="userInfo.user_avatar"
            alt="avatar"
            style="width: 105px; height: 105px"
          />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="电子邮箱"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          style="margin-bottom: 20px; width: 60%"
          allow-clear
          autocomplete="off"
          v-decorator="[
            'user_mail',
            {
              rules: [{ required: false }],
              initialValue: userInfo.user_mail,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="当前密码"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          style="margin-bottom: 20px; width: 60%"
          allow-clear
          autocomplete="off"
          placeholder="请输入当前密码"
          type="password"
          v-decorator="[
            'user_oldPwd',
            {
              rules: [{ required: false }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          style="margin-bottom: 20px; width: 60%"
          allow-clear
          autocomplete="off"
          placeholder="请输入新密码"
          type="password"
          v-decorator="[
            'user_newPwd',
            {
              rules: [{ required: false }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="重复新密码"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          style="margin-bottom: 20px; width: 60%"
          allow-clear
          autocomplete="off"
          placeholder="请输入再次新密码"
          type="password"
          v-decorator="[
            'user_confirmPwd',
            {
              rules: [{ required: false }, { validator: pwdValidator }],
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
  user_avatar:
    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
};
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    const pwdValidator = (rule, value, callback) => {
      const newPwd = this.form.getFieldValue("user_newPwd");
      if (newPwd !== value) {
        callback(new Error("两次输入的密码不相同!"));
      } else {
        callback();
      }
    };
    return {
      userInfo,
      pwdValidator,
      loading: false,
      imageUrl: "",
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
            userInfo.user_nickName = values.user_nickName;
            userInfo.user_mail = values.user_mail ? values.user_mail : "";
            userInfo.user_oldPwd = values.user_confirmPwd
              ? values.user_confirmPwd
              : userInfo.user_oldPwd;
            console.log(userInfo);
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
    handleChange(info) {
      console.log(info);
      if (info.file.status === "loading") {
        this.loading = true;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.userInfo.user_avatar = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("只能上传.jpg/.png格式的图片!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片不能超过2M!");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>
<style lang="stylus" scoped>
@import url('../../assets/css/normal.css');

.center {
  position: relative;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>