<template>
  <a-card>
    <a-modal
      :visible="addColorFormVisible"
      :confirm-loading="confirmLoading"
      @ok="handleAddOk"
      @cancel="handleAddCancel"
    >
      <a-form :form="addColorForm" layout="horizontal">
        <a-form-item label="颜色名称">
          <a-input
            placeholder="颜色名称"
            v-decorator="[
              'color_cn',
              { rules: [{ required: true, message: '请填写商品名称' }] },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="颜色英文">
          <a-input
            placeholder="英文名称"
            v-decorator="['color_en', { rules: [{ required: false }] }]"
          ></a-input>
        </a-form-item>
        <a-form-item label="颜色代码">
          <a-input
            setFieldsValue="color_code"
            placeholder="#000000"
            v-decorator="[
              'color_code',
              { rules: [{ required: true, message: '请输入颜色代码' }] },
            ]"
          ></a-input>
        </a-form-item>
        <!-- <a-form-item label="选择颜色">
          <colorPicker
            setFieldsValue="color_code"
            v-decorator="['color', { rules: [{ required: false }] }]"
            @Change="handleChooseColor"
          ></colorPicker>
        </a-form-item> -->
      </a-form>
    </a-modal>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="queryColorForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="颜色编号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item
                label="颜色名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="颜色英文"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="颜色代码"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新增颜色</a-button>
        <a-button @click="() => handleAllDelete()">批量删除</a-button>
      </a-space>
      <standard-table
        :columns="columns"
        :dataSource="colorList"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
      >
        <template
          v-for="(col, index) in [
            'color_no',
            'color_cn',
            'color_en',
            'color_code',
          ]"
          :slot="col"
          slot-scope="{ text, record }"
        >
          <div :key="index">
            <a-input
              v-if="record.editable"
              :value="text"
              @change="(e) => handleInfoChange(e.target.value, record.key, col)"
            />
            <span v-else>{{ text }}</span>
          </div>
        </template>
        <div slot="color_action" slot-scope="{ record }">
          <!-- <a style="margin-right: 8px"> <a-icon type="edit" />编辑 </a> -->
          <span v-if="record.editable">
            <a-button @click="() => handleInfoSave(record.key)">保存</a-button>
            <a-popconfirm
              title="确定要取消吗？"
              @confirm="() => handleInfoCancel(record.key)"
            >
              <a-button>取消</a-button>
            </a-popconfirm>
          </span>
          <a-button
            v-else
            :disabled="editingKey !== ''"
            @click="() => handleInfoEdit(record.key)"
            >编辑</a-button
          >
          <br />
          <a-button @click="handleInfoDelete(record.key)">删除 </a-button>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
// import { mapState } from "vuex";
const columns = [
  {
    title: "颜色编号",
    dataIndex: "color_no",
    sorter: true,
    align: "center",
    scopedSlots: { customRender: "color_no" },
  },
  {
    title: "颜色名称",
    dataIndex: "color_cn",
    align: "center",
    scopedSlots: { customRender: "color_cn" },
  },
  {
    title: "颜色英文",
    dataIndex: "color_en",
    // needTotal: true,
    align: "center",
    scopedSlots: { customRender: "color_en" },
  },
  {
    title: "色彩代码",
    dataIndex: "color_code",
    // needTotal: true,
    align: "center",
    scopedSlots: { customRender: "color_code" },
  },
  {
    title: "操作",
    dataIndex: "color_action",
    sorter: true,
    align: "center",
    scopedSlots: { customRender: "color_action" },
  },
];

const colorList = [
  {
    key: "1",
    color_no: "1",
    color_cn: "白色",
    color_en: "white",
    color_code: "#ffffff",
  },
  {
    key: "2",
    color_no: "2",
    color_cn: "蓝色",
    color_en: "blue",
    color_code: "#0000ff",
  },
  {
    key: "3",
    color_no: "3",
    color_cn: "红色",
    color_en: "red",
    color_code: "#ff0000",
  },
];

export default {
  name: "color",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      colorList,
      colorShowList: colorList,
      selectedRows: [],
      editingKey: "",
      addColorFormVisible: false,
      confirmLoading: false,
      color_code: "#ff0000",
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  // computed() {
  //   mapState({
  //     colorList: (state) => state.goods.colorList,
  //   });
  // },
  beforeCreate() {
    this.queryColorForm = this.$form.createForm(this);
    this.addColorForm = this.$form.createForm(this);
  },
  created() {
    this.colorList.forEach((item) => {
      item["editable"] = false;
    });
    console.log(this.$store.state.goods.colorList);
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleAllDelete() {
      this.colorList = this.colorList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.selectedRows = [];
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onStatusTitleClick() {
      this.$message.info("你点击了状态栏表头");
    },
    onChange() {
      this.$message.info("表格状态改变了");
    },

    handleInfoChange(value, key, column) {
      const newData = [...this.colorList];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.colorList = newData;
      }
    },
    handleInfoEdit(key) {
      const newData = [...this.colorList];
      const target = newData.filter((item) => item.key === key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.colorList = newData;
      }
    },
    handleInfoSave(key) {
      const newData = [...this.colorList];
      const newShowData = [...this.colorShowList];
      const target = newData.filter((item) => key === item.key)[0];
      const targetShow = newShowData.filter((item) => key === item.key)[0];
      if (target && targetShow) {
        target.editable = false;
        this.colorList = newData;
        Object.assign(targetShow, target);
        this.colorShowList = newShowData;
      }
      this.editingKey = "";
    },
    handleInfoCancel(key) {
      const newData = [...this.colorList];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        Object.assign(
          target,
          this.colorShowList.filter((item) => item.key === key)[0]
        );
      }
      target.editable = false;
      this.editingKey = "";
      this.colorList = newData;
    },
    handleInfoDelete(key) {
      this.colorList = this.colorList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    //新增颜色
    addNew() {
      this.addColorFormVisible = true;
      console.log(this.addColorForm);
    },
    handleChooseColor(e) {
      this.addColorForm.color_code = e.target.color;
    },
    handleAddOk() {
      this.addColorForm.validateFields((err, value) => {
        if (!err) {
          console.log("Received values of form:", value);
          value.key = this.colorList.length + 1;
          value.color_no = this.colorList.length + 1;
          this.colorList.splice(this.colorList.length, 1, value);
        }
      });
      this.confirmLoading = true;
      setTimeout(() => {
        this.addColorFormVisible = false;
        this.confirmLoading = false;
        this.addColorForm.resetFields();
      }, 2000);
    },
    handleAddCancel() {
      this.addColorFormVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
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
</style>
