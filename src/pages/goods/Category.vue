<template>
  <a-card>
    <div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="所有类别">
          <div class="search">
            <div>
              <a-row>
                <a-col :md="2" :sm="24" style="margin-left: 10px">
                  <div style="height: 32px; line-height: 32px">
                    父类别名称：
                  </div>
                </a-col>
                <a-col :md="6" :sm="24">
                  <div>
                    <a-input
                      style="width: 80%"
                      v-model="query"
                      placeholder="请输入"
                      autocomplete="off"
                      all-clear
                    />
                  </div>
                </a-col>
                <a-col :md="6" :sm="24">
                  <div style="margin-left: 30px">
                    <a-button type="primary" @click="handleSearch"
                      >查询</a-button
                    >
                    <a-button style="margin-left: 8px" @click="handleReset"
                      >重置</a-button
                    >
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
          <a-space class="operator">
            <a-button @click="addNewSub" type="primary">新建子类别</a-button>
            <a-button @click="handleDeleteAllSub">批量删除</a-button>
          </a-space>
          <standard-table
            :columns="allColumns"
            :dataSource="cateShowList"
            :selectedRows.sync="selectedRows"
            @clear="onClear"
            @change="onChange"
          >
            <template
              v-for="(col, index) in ['cate_no', 'cate_name', 'cate_sub']"
              :slot="col"
              slot-scope="{ text }"
            >
              <div :key="index">
                <span>{{ text }}</span>
              </div>
            </template>
            <div slot="cate_action" slot-scope="{ record }">
              <a-tooltip placement="top" title="编辑">
                <a-button
                  type="dashed"
                  shape="circle"
                  style="color: #2353b8"
                  :disabled="editingKey !== ''"
                  @click="() => handleSubEdit(record.key)"
                >
                  <a-icon type="edit" /> </a-button
              ></a-tooltip>
              <a-popconfirm
                title="确定要删除吗?"
                @confirm="() => deleteSubRecord(record.key)"
              >
                <a-tooltip placement="top" title="删除">
                  <a-button type="dashed" shape="circle" style="color: #f5222d"
                    ><a-icon type="delete"
                  /></a-button>
                </a-tooltip>
              </a-popconfirm>
            </div>
          </standard-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="父类别" force-render>
          <div>
            <a-space class="operator">
              <a-button @click="addNewNav" type="primary">新建父类别</a-button>
              <a-button @click="handleDeleteAll">批量删除</a-button>
            </a-space>
            <standard-table
              :columns="columns"
              :dataSource="navList"
              :selectedRows.sync="selectedRows"
              @clear="onClear"
              @change="onChange"
            >
              <template
                v-for="(col, index) in ['cate_no', 'cate_name']"
                :slot="col"
                slot-scope="{ text }"
              >
                <div :key="index">
                  <span>{{ text }}</span>
                </div>
              </template>
              <div slot="cate_action" slot-scope="{ record }">
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
                    <a-button
                      type="dashed"
                      shape="circle"
                      style="color: #f5222d"
                      ><a-icon type="delete"
                    /></a-button>
                  </a-tooltip>
                </a-popconfirm>
              </div>
            </standard-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-modal
      :visible="!isEdit ? addNavFormVisible : editNavFormVisible"
      :confirm-loading="confirmLoading"
      @ok="!isEdit ? handleAddNavOk() : handleEditNavOk()"
      @cancel="!isEdit ? handleAddNavCancel() : handleEditNavCancel()"
    >
      <a-form :form="navForm" layout="horizontal">
        <a-form-item label="父类别名称">
          <a-input
            placeholder="父类别名称"
            v-decorator="[
              'cate_name',
              {
                rules: [{ required: true, message: '请填写父类别名称' }],
                initialValue: target.cate_name,
              },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :visible="!isSubEdit ? addSubFormVisible : editSubFormVisible"
      :confirm-loading="confirmLoading"
      @ok="!isSubEdit ? handleAddSubOk() : handleEditSubOk()"
      @cancel="!isSubEdit ? handleAddSubCancel() : handleEditSubCancel()"
    >
      <a-form :form="subForm" layout="horizontal">
        <a-form-item label="父类别名称：">
          <a-select
            :getPopupContainer="
              (triggerNode) => {
                return triggerNode.parentNode || document.body;
              }
            "
            class="select"
            placeholder="请选择"
            v-decorator="[
              'cate_nav',
              {
                rules: [{ required: true, message: '请选择父类别!' }],
                initialValue: target.cate_nav,
              },
            ]"
          >
            <a-select-option v-for="item in cateList" :key="item.key">{{
              item.cate_name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="子类别名称">
          <a-input
            class="input"
            placeholder="子类别名称"
            autocomplete="off"
            v-decorator="[
              'cate_sub',
              {
                rules: [{ required: true, message: '请填写子类别名称!' }],
                initialValue: target.cate_sub,
              },
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import _ from "lodash";

const columns = [
  {
    title: "类别编号",
    dataIndex: "cate_no",
    align: "center",
  },
  {
    title: "类别名称",
    dataIndex: "cate_name",
    align: "center",
    scopedSlots: { customRender: "cate_name" },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "cate_action" },
  },
];
const allColumns = [
  {
    title: "类别编号",
    dataIndex: "cate_no",
    align: "center",
  },
  {
    title: "父类别名称",
    dataIndex: "cate_name",
    align: "center",
    scopedSlots: { customRender: "cate_name" },
  },
  {
    title: "子类别名称",
    dataIndex: "cate_sub",
    align: "center",
    scopedSlots: { customRender: "cate_sub" },
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "cate_action" },
  },
];

const cateList = [
  {
    key: 1,
    cate_no: 1,
    cate_name: "父类别1",
    cate_sub: "子类别1",
  },
  {
    key: 2,
    cate_no: 2,
    cate_name: "父类别2",
    cate_sub: "子类别2",
  },
];

const navList = [
  {
    key: 1,
    cate_no: 1,
    cate_name: "父类别1",
  },
  {
    key: 2,
    cate_no: 2,
    cate_name: "父类别2",
  },
];

export default {
  name: "size",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      allColumns: allColumns,
      cateList,
      cateShowList: cateList,
      selectedRows: [],
      editingKey: "",
      //父类别
      isEdit: false,
      navList,
      addNavFormVisible: false,
      editNavFormVisible: false,
      //子类别
      isSubEdit: false,
      addSubFormVisible: false,
      editSubFormVisible: false,
      confirmLoading: false,
      target: {},
      query: "",

      selectKey: "",
    };
  },
  beforeCreate() {
    this.navForm = this.$form.createForm(this);
    this.subForm = this.$form.createForm(this);
  },
  methods: {
    callback() {
      console.log("callback");
    },
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
        } else {
          if (i.children && i.children.length > 0) {
            for (let j of i.children) {
              if (j.key === key) {
                target = j;
              }
            }
          }
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
    deleteSubRecord(key) {
      this.cateList = this.cateList.filter((item) => item.key !== key);
      this.cateShowList = this.cateShowList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    deleteRecord(key) {
      this.navList = this.navList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onChange() {
      this.$message.info("表格状态改变了");
    },
    addNewNav() {
      this.isEdit = false;
      this.addNavFormVisible = true;
    },
    navRemove(resolve, reject) {
      console.log(reject);
      this.navList = this.navList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.selectedRows = [];
      this.sn("批量删除成功!");
      resolve();
    },
    handleDeleteAll() {
      const _this = this;
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.$confirm({
          title: "批量删除",
          content: "您确定要批量删除选中的规格吗？",
          onOk() {
            return new Promise((resolve, reject) => {
              const res = _this.navRemove(resolve, reject);
              return res;
            }).catch(() => console.log("Oops errors!"));
          },
          onCancel() {},
        });
      } else {
        this.en("未选中数据，无法进行批量操作!");
      }
    },
    handleInfoEdit(key) {
      this.selectKey = key;
      const newData = [...this.navList];
      this.target = newData.filter((item) => item.key === key)[0];
      this.isEdit = true;
      this.editNavFormVisible = true;
    },
    //父类别新增
    handleAddNavOk() {
      this.navForm.validateFields((err, value) => {
        if (!err && value) {
          value.key = this.navList.length + 1;
          value.cate_no = this.navList.length + 1;
          this.navList.splice(this.navList.length, 1, value);
          this.confirmLoading = true;
          setTimeout(() => {
            this.addNavFormVisible = false;
            this.confirmLoading = false;
            this.navForm.resetFields();
          }, 1000);
          console.log(this.navList);
        }
      });
    },
    handleAddNavCancel() {
      this.navForm.resetFields();
      this.addNavFormVisible = false;
    },
    //父类别编辑
    handleEditNavOk() {
      const { selectKey, navList } = this;
      const target = this.getTarget(selectKey, navList);
      this.navForm.validateFields((err, value) => {
        if (!err && value) {
          this.confirmLoading = true;
          target.cate_name = value.cate_name;
          const index = this.getIndex(selectKey, navList);
          navList.splice(index, target);
          setTimeout(() => {
            this.confirmLoading = false;
            this.editNavFormVisible = false;
            this.navForm.resetFields();
            console.log(navList);
            this.sn("更新成功!");
          }, 1000);
        } else {
          this.$message.error("更新失败!");
        }
      });
    },
    handleSearch(e) {
      e.preventDefault();
      const { cateList, query } = this;
      const _info = _.cloneDeep(cateList);
      const result = [];
      if (query) {
        for (let i in _info) {
          if (cateList[i].cate_name.includes(query)) {
            console.log(11111);
            result.push(_info[i]);
          }
        }
        if (result && result.length > 0) {
          this.cateShowList = result;
          console.log(this.colorShowList);
          this.$message.success("搜索成功!");
        } else {
          this.cateShowList = [];
          this.$message.error("搜索失败，未找到符合条件的结果!");
        }
      } else {
        this.$message.error("搜索条件不能为空!");
      }
    },
    handleReset() {
      this.query = "";
      this.cateShowList = this.cateList;
      this.$message.success("重置成功!");
    },
    //新增子类别
    addNewSub() {
      this.isSubEdit = false;
      this.addSubFormVisible = true;
    },
    handleAddSubOk() {
      this.subForm.validateFields((err, value) => {
        if (!err && value) {
          this.confirmLoading = true;
          value.cate_name = this.navList[value.cate_nav - 1].cate_name;
          value.key = this.cateList.length + 1;
          value.cate_no = this.cateList.length + 1;
          console.log(value);
          this.cateList.push(value);
          this.cateShowList = this.cateList;
          setTimeout(() => {
            this.confirmLoading = false;
            this.addSubFormVisible = false;
            this.subForm.resetFields();
            this.sn("提交成功!");
          }, 1000);
        }
      });
    },
    handleAddSubCancel() {
      this.addSubFormVisible = false;
      this.subForm.resetFields();
    },
    //编辑子类别
    handleSubEdit(key) {
      this.selectKey = key;
      this.target = this.getTarget(key, cateList);
      this.target.cate_nav = this.target.cate_name;
      console.log(this.target);
      this.editSubFormVisible = true;
      this.isSubEdit = true;
    },
    handleEditSubOk() {
      const { selectKey, cateList } = this;
      const target = this.getTarget(selectKey, cateList);
      console.log(11111);
      this.subForm.validateFields((err, value) => {
        if (!err && value) {
          console.log(value);
          this.confirmLoading = true;
          if (typeof value.cate_nav === "number") {
            target.cate_name = this.navList[value.cate_nav - 1].cate_name;
          } else {
            target.cate_name = value.cate_nav;
          }
          target.cate_sub = value.cate_sub;
          const index = this.getIndex(selectKey, cateList);
          cateList.splice(index, target);
          setTimeout(() => {
            this.confirmLoading = false;
            this.editSubFormVisible = false;
            this.subForm.resetFields();
            console.log(cateList);
            this.sn("更新成功!");
          }, 1000);
        } else {
          this.en("更新失败!");
        }
      });
    },
    handleEditSubCancel() {
      this.editSubFormVisible = false;
      this.subForm.resetFields();
    },
    //批量删除
    remove(resolve, reject) {
      console.log(reject);
      this.cateList = this.cateList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.cateShowList = this.cateList;
      this.selectedRows = [];
      this.sn("批量删除成功");
      resolve();
    },
    handleDeleteAllSub() {
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
  },
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/normal.css");
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
