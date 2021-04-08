<template>
  <a-card>
    <a-form :form="form" @submit.prevent="handleSubmit" layout="horizontal">
      <a-form-item
        label="积分获得百分比"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          allow-clear
          style="margin-bottom: 20px; width: 60%"
          autocomplete="off"
          v-decorator="[
            'point_ratio',
            {
              rules: [{ required: true, message: '请填写积分获得百分比' }],
              initialValue: setting.point_ratio,
            },
          ]"
        />%(消费100元获得100积分)
      </a-form-item>
      <a-form-item
        label="推广返佣获得百分比"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-input
          allow-clear
          style="margin-bottom: 20px; width: 60%"
          autocomplete="off"
          v-decorator="[
            'rebate_ratio',
            {
              rules: [{ required: true, message: '请填写返佣获得百分比' }],
              initialValue: setting.rebate_ratio,
            },
          ]"
        />%(下级消费100元获得2.00元)
      </a-form-item>
      <a-divider></a-divider>
      <a-form-item
        label="充值优惠"
        style="display: inline-block; margin-left: 28%"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        ><span>充：</span>
        <a-input
          allow-clear
          style="width: 100%"
          autocomplete="off"
          v-decorator="[
            'recharge_offer1.pay',
            {
              rules: [{ required: false }],
              initialValue: setting.recharge_offer1.pay,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        style="display: inline-block"
      >
        实际到账：<a-input
          allow-clear
          style="width: 135%"
          autocomplete="off"
          v-decorator="[
            'recharge_offer1.get',
            {
              rules: [{ required: false }],
              initialValue: setting.recharge_offer1.get,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        style="display: inline-block; margin-left: 37.3%"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        ><span>充：</span>
        <a-input
          allow-clear
          style="width: 133%"
          autocomplete="off"
          v-decorator="[
            'recharge_offer2.pay',
            {
              rules: [{ required: false }],
              initialValue: setting.recharge_offer2.pay,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        style="display: inline-block; margin-left: -3.4%"
      >
        实际到账：<a-input
          allow-clear
          style="width: 135%"
          autocomplete="off"
          v-decorator="[
            'recharge_offer2.get',
            {
              rules: [{ required: false }],
              initialValue: setting.recharge_offer2.get,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        style="display: inline-block; margin-left: 37.3%"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        ><span>充：</span>
        <a-input
          allow-clear
          style="width: 133%"
          autocomplete="off"
          v-decorator="[
            'recharge_offer3.pay',
            {
              rules: [{ required: false }],
              initialValue: setting.recharge_offer3.pay,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        style="display: inline-block; margin-left: -3.4%"
      >
        实际到账：<a-input
          allow-clear
          style="width: 135%"
          autocomplete="off"
          v-decorator="[
            'recharge_offer3.get',
            {
              rules: [{ required: false }],
              initialValue: setting.recharge_offer3.get,
            },
          ]"
        />
      </a-form-item>

      <a-divider></a-divider>
      <a-form-item
        label="限次活动"
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
      >
        <span style="margin-right: 40px">充</span>：<a-input
          allow-clear
          style="margin-bottom: 5px; width: 37%"
          autocomplete="off"
          v-decorator="[
            'limited_recharge.pay',
            {
              rules: [{ required: false }],
              initialValue: setting.limited_recharge.pay,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label=""
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        style="margin-left: 37.3%"
        >实际到账：<a-input
          allow-clear
          style="margin-bottom: 5px; width: 60%"
          autocomplete="off"
          v-decorator="[
            'limited_recharge.get',
            {
              rules: [{ required: false }],
              initialValue: setting.limited_recharge.get,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label=""
        :labelCol="{ span: 9 }"
        :wrapperCol="{ span: 10 }"
        style="margin-left: 37.3%"
        ><span style="margin-right: 40px">限</span>：<a-input
          allow-clear
          style="margin-bottom: 20px; width: 60%"
          autocomplete="off"
          v-decorator="[
            'limited_recharge.limit',
            {
              rules: [{ required: false }],
              initialValue: setting.limited_recharge.limit,
            },
          ]"
      /></a-form-item>
      <a-divider></a-divider>
      <a-form-item
        label="重置用户参与次数"
        :labelCol="{ span: 12 }"
        :wrapperCol="{ span: 10 }"
      >
        <a-radio-group
          :options="option"
          v-decorator="[
            'isReset',
            { rules: [{ required: false }], initialValue: setting.isReset },
          ]"
        >
        </a-radio-group>
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
const setting = {
  point_ratio: "100",
  rebate_ratio: "2",
  recharge_offer1: {
    pay: "1000",
    get: "1000",
  },
  recharge_offer2: {
    pay: "2000",
    get: "2000",
  },
  recharge_offer3: {
    key: 3,
    pay: "3000",
    get: "3000",
  },
  limited_recharge: {
    pay: "1",
    get: "1",
    limit: "1",
  },
  isReset: false,
};
const option = [
  { label: "是", value: true },
  { label: "否", value: false },
];
export default {
  data() {
    return {
      setting,
      option,
    };
  },
  created() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values) {
            console.log(values);
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