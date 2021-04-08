<template>
  <a-card>
    <div class="search">
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
                label="申请人"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  allow-clear
                  autocomplete="off"
                  placeholder="请输入"
                  v-decorator="['apply_name', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <span style="float: right; margin-top: 3px">
                <a-button type="primary" html-type="submit">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>
    <div>
      <standard-table :columns="columns" :dataSource="rebateShowList">
        <template slot="rebate_details" slot-scope="{ record }">
          <li>购买人：{{ record.details.order_name }}</li>
          <li>实付金额：{{ record.details.order_final_price }}</li>
          <li>返佣比列：{{ record.details.rebate_ratio }}</li>
          <li>返佣金额：{{ record.details.rebate_price }}</li>
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import moment from "moment";
import "moment/locale/zh-cn";
import _ from "lodash";

const columns = [
  {
    title: "订单号",
    dataIndex: "order_id",
    align: "center",
    scopedSlots: { customRender: "order_id" },
  },
  {
    title: "申请人",
    dataIndex: "apply_name",
    align: "center",
    width: "400px",
    scopedSlots: { customRender: "apply_name" },
  },
  {
    title: "返佣详情",
    dataIndex: "rebate_details",
    align: "center",
    scopedSlots: { customRender: "rebate_details" },
  },
];
const rebateList = [
  {
    key: 1,
    order_id: "100",
    apply_name: "张三",
    details: {
      order_name: "李四",
      order_final_price: 0.02,
      rebate_ratio: "2%",
      rebate_price: 0.0,
    },
    type: "0",
  },
];
export default {
  name: "unPay",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns,
      rebateList,
      rebateShowList: rebateList,
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
    handleSearch() {
      this.queryForm.validateFields((err, values) => {
        const queryKey = [];
        const queryValue = [];
        if (!err && values) {
          for (let i in values) {
            if (values[i] === undefined || !values[i]) {
              continue;
            } else {
              queryKey.push(i);
              queryValue.push(values[i]);
            }
          }
        }
        const { rebateList } = this;
        console.log(rebateList);
        const _info = _.cloneDeep(rebateList);
        const result = [];
        let count = 0;
        if (queryKey.length === 0) {
          this.$message.error("查询内容不能为空");
        } else {
          for (let i in rebateList) {
            for (let j in queryKey) {
              const infoA = rebateList[i][queryKey[j]];
              if (
                queryValue[j] !== undefined &&
                infoA.includes(queryValue[j])
              ) {
                count = count + 1;
              } else {
                continue;
              }
            }
            if (count === queryKey.length) {
              result.push(_info[i]);
              count = 0;
              this.$message.success('查询成功!')
            } else if (count < queryKey.length) {
              count = 0;
              this.$message.error("查询失败，未搜索到符合条件的返佣记录!");
            }
            this.rebateShowList = result;
          }
        }
        console.log(this.rebateShowList);
      });
    },
    handleReset() {
      this.queryForm.resetFields();
      this.rebateShowList = this.rebateList;
      this.$message.success("重置成功!");
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
