<template>
  <a-card>
    <a-modal
      :visible="addSizeFormVisible"
      :confirm-loading="confirmLoading"
      @ok="handleAddOk"
      @ccancel="handleAddCancel"
    >
      <a-form :form="addSizeForm" layout="horizontal">
        <a-form-item label="规格名称">
          <a-input
            placeholder="规格名称"
            v-decorator="[
              'size_name',
              { rules: [{ required: true, message: '请填写规格名称' }] },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="规格编号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="规格名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input-number style="width: 100%" placeholder="请输入" />
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
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button @click="handleDeleteAll">批量删除</a-button>
      </a-space>
      <standard-table
        :columns="columns"
        :dataSource="sizeShowList"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
      >
        <template
          v-for="(col, index) in ['size_no', 'size_name']"
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
        <div slot="size_action" slot-scope="{ record }">
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
        <!-- <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template> -->
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "规格编号",
    dataIndex: "size_no",
  },
  {
    title: "规格名称",
    dataIndex: "size_name",
    scopedSlots: { customRender: "size_name" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "size_action" },
  },
];

const sizeList = [
  {
    key: 1,
    size_no: 1,
    size_name: "规格1",
  },
  {
    key: 2,
    size_no: 2,
    size_name: "规格2",
  },
];

export default {
  name: "size",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      sizeList,
      sizeShowList: sizeList,
      selectedRows: [],
      editingKey: "",
      addSizeFormVisible: false,
      confirmLoading: false,
    };
  },
  // authorize: {
  //   deleteRecord: "delete",
  // },
  beforeCreate() {
    this.addSizeForm = this.$form.createForm(this);
  },
  created() {
    sizeList.forEach((item) => {
      item["editable"] = false;
    });
  },
  methods: {
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
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
    addNew() {
      this.addSizeFormVisible = true;
    },
    handleDeleteAll() {
      this.sizeList = this.sizeList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.selectedRows = [];
    },
    handleInfoChange(value, key, col) {
      const newData = [...this.sizeList];
      const target = newData.filter((item) => item.key === key)[0];
      if (target) {
        target[col] = value;
        this.sizeList = newData;
      }
    },
    handleInfoEdit(key) {
      const newData = [...this.sizeList];
      const target = newData.filter((item) => item.key === key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.sizeList = newData;
      }
    },
    handleInfoSave(key) {
      const newData = [...this.sizeList];
      const newShowData = [...this.sizeShowList];
      const target = newData.filter((item) => key === item.key)[0];
      const targetShow = newShowData.filter((item) => key === item.key)[0];
      if (target && targetShow) {
        target.editable = false;
        this.sizeList = newData;
        Object.assign(targetShow, target);
        this.sizeShowList = newShowData;
      }
      this.editingKey = "";
    },
    handleInfoCancel(key) {
      const newData = [...this.sizeList];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        Object.assign(
          target,
          this.sizeList.filter((item) => item.key === key)[0]
        );
      }
      target.editable = false;
      this.editingKey = "";
      this.sizeList = newData;
    },
    handleInfoDelete(key) {
      this.sizeList = this.sizeList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    //新增
    handleAddOk() {
      this.addSizeForm.validateFields((err, value) => {
        if (!err) {
          value.key = this.sizeList.length + 1;
          value.size_no = this.sizeList.length + 1;
          this.sizeList.splice(this.sizeList.length, 1, value);
        }
      });
      this.confirmLoading = true;
      setTimeout(() => {
        this.addSizeFormVisible = false;
        this.confirmLoading = false;
        this.addSizeForm.resetFields();
      }, 2000);
    },
    handleAddCancel() {
      this.addSizeFormVisible = false;
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
