<template>
  <a-card>
    <a-modal
      :visible="!isEdit ? addSizeFormVisible : editSizeFormVisible"
      :confirm-loading="confirmLoading"
      @ok="!isEdit ? handleAddOk() : handleUpdateOk()"
      @cancel="!isEdit ? handleAddCancel() : handleEditCancel()"
    >
      <a-form :form="form" layout="horizontal">
        <a-form-item label="规格名称">
          <a-input
            allow-clear
            placeholder="规格名称"
            v-decorator="[
              'size_name',
              {
                rules: [{ required: true, message: '请填写规格名称' }],
                initialValue: target.size_name,
              },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="search">
      <div>
        <a-row>
          <a-col :md="2" :sm="24" style="margin-left: 10px">
            <div style="height: 32px; line-height: 32px">规格名称：</div>
          </a-col>
          <a-col :md="6" :sm="24">
            <div>
              <a-input
                style="width: 80%"
                v-model="query"
                placeholder="请输入"
                autocomplete="off"
              />
            </div>
          </a-col>
          <a-col :md="6" :sm="24">
            <div style="margin-left: 30px">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleReset"
                >重置</a-button
              >
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新建规格</a-button>
        <a-button @click="handleAllDelete">批量删除</a-button>
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
          slot-scope="{ text }"
        >
          <div :key="index">
            {{ text }}
          </div>
        </template>
        <div slot="size_action" slot-scope="{ record }">
          <a-tooltip placement="top" title="编辑">
            <a-button
              type="dashed"
              shape="circle"
              style="color: #2353b8"
              :disabled="editingKey !== ''"
              @click="() => handleInfoEdit(record.key)"
            >
              <a-icon type="edit" /> </a-button
          ></a-tooltip>
          <a-popconfirm
            title="确定要删除吗?"
            @confirm="() => deleteRecord(record.key)"
          >
            <a-tooltip placement="top" title="删除">
              <a-button type="dashed" shape="circle" style="color: #f5222d"
                ><a-icon type="delete"
              /></a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import _ from "lodash";
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
      editSizeFormVisible: false,
      confirmLoading: false,
      isEdit: false,
      query: "",
      target: {},
      selectKey: "",
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {
    sizeList.forEach((item) => {
      item["editable"] = false;
    });
  },
  methods: {
    sn(message) {
      this.$notification.success({
        message,
        duration: 1.5,
      });
    },
    en(message) {
      this.$notification.error({
        message,
        duration: 1.5,
      });
    },
    getTarget(key, array) {
      let target = {};
      for (let i of array) {
        if (i.key === key) {
          target = i;
        }
      }
      return target;
    },
    getIndex(key, array) {
      for (let i in array) {
        if (array[i].key === key) {
          return i;
        }
      }
    },
    deleteRecord(key) {
      this.sizeShowList = this.sizeShowList.filter((item) => item.key !== key);
      this.sizeList = this.sizeList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onChange() {
      this.$message.info("表格状态改变了");
    },
    remove(resolve, reject) {
      console.log(reject);
      this.sizeList = this.sizeList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.sizeShowList = this.sizeList;
      this.selectedRows = [];
      this.sn("批量删除成功!");
      resolve();
    },
    handleAllDelete() {
      const _this = this;
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.$confirm({
          title: "批量删除",
          content: "您确定要批量删除选中的规格吗？",
          onOk() {
            return new Promise((resolve, reject) => {
              const res = _this.remove(resolve, reject);
              return res;
            }).catch(() => console.log("Oops errors!"));
          },
          onCancel() {},
        });
      } else {
        this.en("未选中数据，无法进行批量操作!");
      }
    },

    //新增
    addNew() {
      this.isEdit = false;
      this.addSizeFormVisible = true;
    },
    handleAddOk() {
      this.form.validateFields((err, value) => {
        if (!err && value) {
          this.confirmLoading = true;
          value.key = this.sizeList.length + 1;
          value.size_no = this.sizeList.length + 1;
          this.sizeList.push(value);
          setTimeout(() => {
            this.addSizeFormVisible = false;
            this.confirmLoading = false;
            this.sn("提交成功!");
            this.form.resetFields();
          }, 1000);
        }
      });
    },
    handleAddCancel() {
      this.addSizeFormVisible = false;
    },
    //编辑
    handleInfoEdit(key) {
      this.selectKey = key;
      this.target = this.getTarget(key, this.sizeList);
      this.editSizeFormVisible = true;
      this.isEdit = true;
    },
    handleUpdateOk() {
      this.form.validateFields((err, values) => {
        if (!err && values) {
          this.confirmLoading = true;
          const { sizeList, sizeShowList } = this;
          const newData = this.getTarget(this.selectKey, sizeList);
          newData.size_name = values.size_name;
          const index = this.getIndex(this.selectKey, sizeList);
          sizeList[index] = newData;
          sizeShowList[index] = newData;
          this.target = {};
          setTimeout(() => {
            this.editSizeFormVisible = false;
            this.confirmLoading = false;
            this.sn("更新成功!");
            this.form.resetFields();
            this.selectKey = "";
          }, 1000);
        } else {
          this.$message.error("更新失败!");
        }
      });
    },
    handleEditCancel() {
      this.editSizeFormVisible = false;
      this.form.resetFields();
      this.target = {};
    },
    handleSearch(e) {
      e.preventDefault();
      const { sizeList, query } = this;
      const _info = _.cloneDeep(sizeList);
      const result = [];
      if (query) {
        for (let i in sizeList) {
          if (sizeList[i].size_name.includes(query)) {
            console.log(11111);
            result.push(_info[i]);
          }
        }
        if (result && result.length > 0) {
          this.sizeShowList = result;
          console.log(this.sizeShowList);
          this.$message.success("搜索成功!");
        } else {
          this.sizeShowList = [];
          this.$message.error("搜索失败，未找到符合条件的结果!");
        }
      } else {
        this.$message.error("搜索条件不能为空!");
      }
    },
    handleReset() {
      this.query = "";
      this.sizeShowList = this.sizeList;
      this.$message.success("重置成功!");
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 20px;
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
