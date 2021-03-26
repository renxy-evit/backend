<template>
  <common-layout>
    <div class="login">
      <div class="title-container"><h3 class="title">后台通用系统</h3></div>
      <a-form @submit="onSubmit" :form="form">
        <a-alert
          type="error"
          :closable="true"
          v-show="error"
          :message="error"
          showIcon
          style="margin-bottom: 24px"
        />
        <a-form-item>
          <a-input
            autocomplete="autocomplete"
            size="large"
            placeholder="用户名"
            allow-clear
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '请输入用户名' }],
              },
            ]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-tooltip
          v-model="capsTooltip"
          title="开启大写"
          placement="right"
          trigger="mouseleave"
          :visible="toolTipVisible"
        >
          <a-form-item>
            <a-input
              size="large"
              ref="password"
              placeholder="密码"
              autocomplete="autocomplete"
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '密码不能为空',
                    },
                    {
                      max: 15,
                      message: '密码必须在4-15个字符之间',
                    },
                    {
                      min: 4,
                      message: '密码必须在4-15个字符之间',
                    },
                  ],
                },
              ]"
              :type="passwordType"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              allow-clear
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
            <span class="show-pwd" @click="showPwd">
              <a-icon
                :type="passwordType === 'password' ? 'eye' : 'eye-invisible'"
              />
            </span>
          </a-form-item>
        </a-tooltip>

        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
      <a style="float: right; right: 120px" @click="forgetPwd">忘记密码</a>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login, getRoutesConfig } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  components: { CommonLayout },

  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      capsTooltip: false,
      passwordType: "password",
      toolTipVisible: false,
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    checkCapslock(e) {
      this.toolTipVisible = true;
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    forgetPwd() {
      this.$message.error("该账号未绑定邮箱，请先联系管理员");
    },

    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const username = this.form.getFieldValue("username");
          const password = this.form.getFieldValue("password");
          login(username, password).then(this.afterLogin);
        }
      });
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code >= 0) {
        const { user, permissions, roles } = loginRes.data;
        this.setUser(user);
        this.setPermissions(permissions);
        this.setRoles(roles);
        setAuthorization({
          token: loginRes.data.token,
          expireAt: new Date(loginRes.data.expireAt),
        });
        // 获取路由配置
        getRoutesConfig().then((result) => {
          const routesConfig = result.data.data;
          loadRoutes(routesConfig);
          this.$router.push("/welcome");
          this.$message.success(loginRes.message, 3);
        });
      } else {
        // this.error = loginRes.message;
        this.$message.error(loginRes.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .login {
    width: 368px;
    margin: 50px auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: #666;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
    .show-pwd {
      position: absolute;
      right: 30px;
      font-size: 16px;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
