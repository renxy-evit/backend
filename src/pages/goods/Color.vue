<template>
  <a-card>
    <color-submit
      :isEdit="!isEdit"
      :visible="addFormVisible"
      :target="target"
      @getSubmitInfo="handleAddOk"
      @closeModal="closeAddModal"
    />
    <color-submit
      :isEdit="isEdit"
      :target="target"
      :visible="editFormVisible"
      @getSubmitInfo="handleUpdateOk"
      @closeModal="closeEditModal"
    />
    <div class="search">
      <div>
        <a-row>
          <a-col :md="2" :sm="24" style="margin-left: 10px">
            <div style="height: 32px; line-height: 32px">颜色名称：</div>
          </a-col>
          <a-col :md="6" :sm="24">
            <div>
              <a-input
                allow-clear
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
        <a-button @click="addNew" type="primary">新增颜色</a-button>
        <a-button @click="() => handleAllDelete()">批量删除</a-button>
      </a-space>
      <standard-table
        :columns="columns"
        :dataSource="colorShowList"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
      >
        <template
          v-for="(col, index) in ['color_no', 'color_cn', 'color_en']"
          :slot="col"
          slot-scope="{ text }"
        >
          <div :key="index">
            <span class="editInput">{{ text }}</span>
          </div>
        </template>
        <template slot="color_code" slot-scope="{ text, record }">
          <color-picker
            v-model="record.color_code"
            style="margin-right: 5px"
            disabled
          />
          <span class="editInput">{{ text }}</span>
        </template>
        <div slot="color_action" slot-scope="{ record }">
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
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import ColorSubmit from "./components/ColorSubmit";
import _ from "lodash";
const columns = [
  {
    title: "颜色编号",
    dataIndex: "color_no",
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
    align: "center",
    scopedSlots: { customRender: "color_action" },
  },
];

const colorList = [
  {
    key: "1",
    color_no: "1",
    color_cn: "黄色",
    color_en: "yellow",
    color_code: "#ffff00",
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
  components: { StandardTable, ColorSubmit },
  data() {
    return {
      isEdit: false,
      advanced: true,
      columns: columns,
      colorList,
      colorShowList: colorList,
      selectedRows: [],
      editingKey: "",
      addFormVisible: false,
      editFormVisible: false,
      target: { pick_color: "#000000" },
      selectKey: "",
      query: "",
    };
  },
  beforeCreate() {
    this.queryColorForm = this.$form.createForm(this);
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
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onChange() {
      this.$message.info("表格状态改变了");
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
    getColorIndex(key, array) {
      for (let i in array) {
        if (array[i].key === key) {
          return i;
        }
      }
    },
    remove(resolve, reject) {
      console.log(reject);
      this.colorList = this.colorList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.colorShowList = this.colorList;
      this.selectedRows = [];
      this.sn("批量删除成功");
      resolve();
    },
    handleAllDelete() {
      const _this = this;
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.$confirm({
          title: "批量删除",
          content: "您确定要批量删除选中的颜色吗？",
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
    //删除所选行
    deleteRecord(key) {
      this.colorList = this.colorList.filter((item) => item.key !== key);
      this.colorShowList = this.colorShowList.filter(
        (item) => item.key !== key
      );
      this.$message.success("删除成功！");
    },
    //新增颜色
    addNew() {
      this.isEdit = false;
      this.addFormVisible = true;
    },
    handleAddOk(value) {
      console.log(value);
      const { colorList } = this;
      if (value) {
        value.key = colorList.length + 1;
        value.color_no = colorList.length + 1;
        colorList.push(value);
        this.colorShowList = Object.assign(this.colorShowList, colorList);
        this.addFormVisible = false;
      } else {
        this.$message.error("上传错误!");
      }
    },
    closeAddModal() {
      this.addFormVisible = false;
    },
    //编辑颜色
    handleInfoEdit(key) {
      this.selectKey = key;
      this.isEdit = true;
      this.target = Object.assign(
        this.target,
        this.getTarget(key, this.colorList)
      );
      this.target.pick_color = this.target.color_code;
      console.log(this.colorList);
      this.editFormVisible = true;
      console.log(this.target);
    },
    handleUpdateOk(value) {
      if (value) {
        const newData = this.getTarget(this.selectKey, this.colorList);
        newData.color_cn = value.color_cn;
        newData.color_en = value.color_en;
        newData.color_code = value.color_code;
        const index = this.getColorIndex(this.selectKey, this.colorList);
        this.colorList[index] = newData;
        this.colorShowList[index] = newData;
        this.editFormVisible = false;
        this.target = {};
        this.target["pick_color"] = "#000000";
      }
    },
    closeEditModal() {
      this.editFormVisible = false;
      this.target = {};
      this.target["color_code"] = "#000000";
    },
    handleInfoDelete(key) {
      this.colorList = this.colorList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    //搜索
    handleSearch(e) {
      e.preventDefault();
      const { colorList, query } = this;
      const _info = _.cloneDeep(colorList);
      const result = [];
      if (query) {
        for (let i in _info) {
          if (colorList[i].color_cn.includes(query)) {
            console.log(11111);
            result.push(_info[i]);
          }
        }
        if (result && result.length > 0) {
          this.colorShowList = result;
          console.log(this.colorShowList);
          this.$message.success("搜索成功!");
        } else {
          this.colorShowList = [];
          this.$message.error("搜索失败，未找到符合条件的结果!");
        }
      } else {
        this.$message.error("搜索条件不能为空!");
      }
    },
    handleReset() {
      this.colorShowList = this.colorList;
      this.query = "";
      this.$message.success("重置成功!");
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 10px;
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
.editInput {
  width: 150px;
}
</style>
