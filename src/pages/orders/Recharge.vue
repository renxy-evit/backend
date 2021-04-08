<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form
        layout="horizontal"
        :form="queryForm"
        @submit.prevent="handleSearch"
      >
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="订单号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  allow-clear
                  autocomplete="off"
                  placeholder="请输入"
                  v-decorator="['order_id', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item
                label="商品名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  allow-clear
                  autocomplete="off"
                  placeholder="请输入"
                  v-decorator="['pro_name', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="下单日期"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-date-picker
                  style="width: 100%"
                  placeholder="请输入下单日期"
                  valueFormat="YYYY-MM-DD"
                  v-decorator="[
                    'order_createTime',
                    { rules: [{ required: false }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item
                label="收货人"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  allow-clear
                  autocomplete="off"
                  placeholder="请输入"
                  v-decorator="['cust_name', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item
                label="联系电话"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  allow-clear
                  autocomplete="off"
                  placeholder="请输入"
                  v-decorator="['cust_phone', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset"
            >重置</a-button
          >
        </span>
      </a-form>
    </div>
    <a-space>
      <a-button
        @click="export2Excel"
        :loading="exporting"
        style="background-color: #eee"
        >导出Excel</a-button
      >
    </a-space>
    <div>
      <standard-table :columns="columns" :dataSource="orderShowList">
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import { export_json_to_excel } from "../../plugins/Export2Excel";
import StandardTable from "@/components/table/StandardTable";
import moment from "moment";
import "moment/locale/zh-cn";
import _ from "lodash";

const columns = [
  {
    title: "编号",
    dataIndex: "order_no",
    align: "center",
    scopedSlots: { customRender: "corder_no" },
  },
  {
    title: "订单号",
    dataIndex: "order_id",
    align: "center",
    scopedSlots: { customRender: "order_id" },
  },
  {
    title: "订单详情",
    dataIndex: "order_more",
    align: "center",
    width: "400px",
    scopedSlots: { customRender: "order_more" },
  },
  {
    title: "下单日期",
    dataIndex: "order_createTime",
    align: "center",
    scopedSlots: { customRender: "order_createTime" },
  },
];
const orderList = [
  {
    key: 1,
    order_no: "100",
    order_id: "2156321148896321",
    order_detail: [
      {
        key: 2,
        pro_no: 1,
        pro_name: "哈哈哈",
        pro_color: "白色",
        pro_size: "大号",
        pro_quantity: 2,
        pro_price: 1.99,
      },
      {
        key: 4,
        pro_no: 2,
        pro_name: "嘿嘿嘿",
        pro_color: "黑色",
        pro_size: "小号",
        pro_quantity: 1,
        pro_price: 5,
      },
    ],
    order_createTime: "2021-04-06 14:44",
    order_total_price: 8.98,
    order_discount: 0.0,
    order_receive: [
      {
        key: 3,
        cust_name: "李四",
        cust_phone: "13844226699",
        cust_address: "江苏省无锡市江阴市",
        remark: "一一二二三三四四五五六六",
      },
    ],
    order_pay: "微信",
    deliver_no: "",
    pay_no: "",
    refund_no: "",
    order_more: "会员卡充值100元",
  },
];
export default {
  name: "unPay",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns,
      orderList,
      orderShowList: orderList,
      selectedRows: [],
      moment,
      selectKey: "",
      visible: false,
      confirmLoading: false,
      //导出
      exporting: false,
    };
  },
  beforeCreate() {
    this.queryForm = this.$form.createForm(this);
    this.form = this.$form.createForm(this);
  },
  methods: {
    getTarget(key, object) {
      if (Object.keys(object).includes(key)) {
        return object[key];
      } else {
        for (let i in object.order_detail) {
          if (Object.keys(object.order_detail[i]).includes(key)) {
            return object.order_detail[i][key];
          }
        }
        for (let j in object.order_receive) {
          if (Object.keys(object.order_receive[j]).includes(key)) {
            return object.order_receive[j][key];
          }
        }
      }
    },
    handleSearch() {
      this.queryForm.validateFields((err, values) => {
        const queryKey = [];
        const queryValue = [];
        if (!err && values) {
          console.log(values);
          for (let i in values) {
            if (values[i] === undefined || !values[i]) {
              continue;
            } else {
              queryKey.push(i);
              queryValue.push(values[i]);
            }
          }
        }
        const { orderList } = this;
        console.log(orderList);
        const _info = _.cloneDeep(orderList);
        const result = [];
        let count = 0;
        if (queryKey.length === 0) {
          this.$message.error("查询内容不能为空");
        } else {
          for (let i in orderList) {
            for (let j in queryKey) {
              const infoA = orderList[i];
              const target = this.getTarget(queryKey[j], infoA);
              if (
                queryValue[j] !== undefined &&
                target.includes(queryValue[j])
              ) {
                count = count + 1;
              } else {
                continue;
              }
            }
            if (count === queryKey.length) {
              result.push(_info[i]);
              count = 0;
            } else if (count < queryKey.length) {
              count = 0;
            }
            this.orderShowList = result;
          }
          if (
            this.orderShowList &&
            this.orderShowList.length > 0 &&
            count === queryKey.length
          ) {
            this.$message.success("查询成功!");
          } else {
            this.$message.error("查询失败，未搜索到符合条件的订单!");
          }
        }
        console.log(this.orderShowList);
      });
    },
    handleReset() {
      this.queryForm.resetFields();
      this.orderShowList = this.orderList;
      this.$message.success("重置成功!");
    },
    //导出xlsx
    export2Excel() {
      this.exporting = true;
      require.ensure([], () => {
        const tHeader = [
          "编号",
          "订单号",
          "商品编号",
          "商品名称",
          "商品颜色",
          "商品规格",
          "商品数量",
          "商品单价",
          "创建时间",
          "订单总价",
          "订单折扣",
          "收货人",
          "联系电话",
          "收货地址",
          "备注",
          "支付方式",
        ];
        const filterVal = [
          "order_no",
          "order_id",
          "pro_no",
          "pro_name",
          "pro_color",
          "pro_size",
          "pro_quantity",
          "pro_price",
          "order_createTime",
          "order_total_price",
          "order_discount",
          "cust_name",
          "cust_phone",
          "cust_address",
          "remark",
          "order_pay",
        ];
        const { orderShowList } = this;
        const data = this.formatJson(filterVal, orderShowList);
        export_json_to_excel(tHeader, data, "已完成订单列表");
      });
      this.exporting = false;
    },
    formatJson(filterVal, orderShowList) {
      console.log(orderShowList.map((v) => filterVal.map((j) => v[j])));
      return orderShowList.map((v) => filterVal.map((j) => v[j]));
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 30px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.border {
  border: 2px dashed #7777ff;
}
</style>
