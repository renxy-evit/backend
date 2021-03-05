<template>
  <a-card>
    <a-modal
      :visible="importVisible"
      @ok="handleImportOk"
      @cancel="handleImportCancel"
      :confirm-loading="import_confirmLoading"
      :fileList="uploadFileList"
    >
      <div class="uploadModel">
        <a-upload
          name="importGoods"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :headers="import_headers"
          @change="handleImportChange"
        >
          <a-button type="upload">导入商品</a-button>
        </a-upload>
        <a-button @click="downloadModule">下载模板</a-button>
      </div>
    </a-modal>
    <a-form :form="addForm" layout="horizontal">
      <a-modal
        :visible="addFormVisible"
        :confirm-loading="confirmLoading"
        @ok="handleAddOk"
        @cancel="handleAddCancel"
      >
        <a-form-item label="商品名称、英文名">
          <a-input
            class="input"
            placeholder="商品名称（必填）"
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请填写商品名称' }] },
            ]"
          />
          <a-input class="input" placeholder="商品英文名（选填）" />
        </a-form-item>
        <!-- <a-form-item></a-form-item> -->
        <a-divider style="margin: 10px 0" />
        <a-form-item>
          <span>展示图上传</span>
          <div class="clearfix">
            <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChangePic"
              mutiple="true"
              v-decorator="['show_pic', (rules = [{ required: false }])]"
            >
              <div v-if="fileList.length < 8">
                <a-icon type="plus" />
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancelPic"
            >
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>
        <a-divider style="margin: 10px 0" />
        <a-form-item label="商品类别" style="display: inline-block">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'category_nav',
              { rules: [{ required: true, message: '请填写商品分类' }] },
            ]"
            @change="handleCateChange"
          >
            <a-select-option v-for="nav in navData" :key="nav.id">{{
              nav.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item style="display: inline-block; margin-top: 38px">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'category_sub',
              { rules: [{ required: true, message: '请填写商品分类' }] },
            ]"
          >
            <a-select-option v-for="sub in subData" :key="sub.id">{{
              sub.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品颜色">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'color',
              { rules: [{ required: true, message: '请填写商品颜色' }] },
            ]"
          >
            <a-select-option value="1">color1</a-select-option>
            <a-select-option value="2">color2</a-select-option>
            <a-select-option value="3">color3</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品规格">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'size',
              { rules: [{ required: true, message: '请填写商品规格' }] },
            ]"
          >
            <a-select-option value="1">size1</a-select-option>
            <a-select-option value="2">size2</a-select-option>
            <a-select-option value="3">size3</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品现价">
          <a-input
            class="input"
            type="text"
            placeholder="商品现价"
            v-decorator="[
              'present_price',
              { rules: [{ required: true, message: '请填写商品现价' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="商品原价">
          <a-input
            class="input"
            type="text"
            placeholder="商品原价"
            v-decorator="['previous_price', (rules = [{ required: false }])]"
          />
        </a-form-item>
        <a-form-item label="商品库存">
          <a-input
            class="input"
            type="text"
            placeholder="商品库存"
            v-decorator="[
              'stock',
              { rules: [{ required: true, message: '请填写商品库存' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="商品权重">
          <!-- <span class="add-on">商品权重</span> -->
          <a-input
            class="input"
            type="text"
            setFieldsValue="0"
            v-decorator="['priority', (rules = [{ required: true }])]"
          />
        </a-form-item>
        <a-form-item label="文字说明">
          <!-- <span class="add-on" style="margin-top: 3px">文字说明</span> -->
          <a-textarea
            type="text"
            placeholder="选填"
            style="overflow: auto; vertical-align: top; width: auto"
            v-decorator="['text_detail', (rules = [{ required: false }])]"
          />
        </a-form-item>
      </a-modal>
    </a-form>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="queryForm" @submit="handleSearch">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="商品编号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-decorator="['pro_no', { rules: [{ required: false }] }]"
                  style="width: 100%"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="商品名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  v-decorator="['pro_name', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="商品类别"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  placeholder="请选择"
                  v-decorator="[
                    'pro_category',
                    { rules: [{ required: false }] },
                  ]"
                >
                  <a-select-option value="类别1">类别1</a-select-option>
                  <a-select-option value="类别2">类别2</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item
                label="商品颜色"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  style="width: 100%"
                  placeholder="请输入"
                  v-decorator="['pro_color', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="商品规格"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  placeholder="请选择"
                  v-decorator="['pro_size', { rules: [{ required: false }] }]"
                >
                  <a-select-option value="规格1">规格1</a-select-option>
                  <a-select-option value="规格2">规格2</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset"
            >重置</a-button
          >
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新增商品</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="sale">上架</a-menu-item>
          </a-menu>
          <a-button> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
        <a-button @click="showImportModel">导入商品</a-button>
        <a-button @click="export2Excel" :loading="exporting"
          >导出Excel</a-button
        >
      </a-space>
      <standard-table
        :columns="columns"
        :dataSource="proShowList"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
      >
        <template
          v-for="col in [
            'pro_no',
            'pro_name',
            'pro_category',
            'pro_old_price',
            'pro_price',
            'pro_color',
            'pro_size',
            'pro_stock',
          ]"
          :slot="col"
          slot-scope="{ text, record }"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              :value="text"
              @change="(e) => handleChange(e.target.value, record.key, col)"
            />
            <span v-else>{{ text }}</span>
          </div>
        </template>
        <template slot="pro_detail_pic">
          <template v-for="(item, index) in proList">
            <div :key="index">
              <img
                v-for="(subItem, subIndex) in item.pro_detail_pic"
                :key="subIndex"
                style="width: 50px; heigth: 50px; margin-right: 10px"
                :src="subItem"
              />
            </div>
          </template>
          <a-upload
            name="file"
            :multiple="true"
            :heade="headers"
            @change="handleUploadDetail"
          >
            <a-button><a-icon type="plus" /></a-button>
          </a-upload>
        </template>
        <!-- <template scope="pro_detail_pic">
          <img v-for="item in pro_detail_pic" :key="item" :src="item" />
        </template> -->
        <div slot="pro_show_pic" slot-scope="{ text }">
          <img style="width: 50px; heigth: 50px" :src="text" />
        </div>
        <div slot="pro_action" slot-scope="{ record }">
          <span v-if="record.editable">
            <a-button @click="() => handleSave(record.key)">保存</a-button>
            <a-popconfirm
              title="确定要取消吗?"
              @confirm="() => handleCancel(record.key)"
            >
              <a-button>取消</a-button>
            </a-popconfirm>
            <!-- <a-button @click="() => handleCancel(record.key)">取消</a-button> -->
          </span>
          <a-button
            v-else
            :disabled="editingKey !== ''"
            @click="handleEdit(record.key)"
          >
            修改 </a-button
          ><br />
          <a-popconfirm
            title="确定要删除吗?"
            @confirm="() => deleteRecord(record.key)"
          >
            <a-button>删除</a-button><br />
          </a-popconfirm>
          <!-- <a-button style="margin-right: 8px" @click="deleteRecord(record.key)">
            删除 </a-button
          ><br /> -->
          <a-button> 上架 </a-button><br />
          <a-button> 预售 </a-button><br />
          <a-button @click="addNew"> 新增规格</a-button>
        </div>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { export_json_to_excel } from "../../plugins/Export2Excel";

const columns = [
  {
    title: "编号",
    dataIndex: "pro_no",
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "pro_name",
    scopedSlots: { customRender: "pro_name" },
    align: "center",
  },
  {
    title: "类别",
    dataIndex: "pro_category",
    scopedSlots: { customRender: "pro_category" },
    align: "center",
  },
  {
    title: "原价",
    dataIndex: "pro_old_price",
    scopedSlots: { customRender: "pro_old_price" },
    align: "center",
  },
  {
    title: "价格",
    dataIndex: "pro_price",
    scopedSlots: { customRender: "pro_price" },
    align: "center",
  },

  {
    title: "颜色",
    dataIndex: "pro_color",
    align: "center",
    scopedSlots: { customRender: "pro_color" },
  },
  {
    title: "规格",
    dataIndex: "pro_size",
    align: "center",
  },
  {
    title: "库存",
    dataIndex: "pro_stock",
    align: "center",
  },
  {
    title: "销量",
    dataIndex: "pro_sales",
    sorter: true,
    align: "center",
  },

  {
    title: "详情图",
    dataIndex: "pro_detail_pic",
    align: "center",
    scopedSlots: { customRender: "pro_detail_pic" },
  },
  {
    title: "展示图",
    dataIndex: "pro_show_pic",
    align: "center",
    scopedSlots: { customRender: "pro_show_pic" },
  },
  {
    title: "操作",
    dataIndex: "pro_action",
    align: "center",
    scopedSlots: { customRender: "pro_action" },
  },
];

const proList = [
  {
    key: "1",
    pro_no: "1",
    pro_name: "运费",
    pro_category: "用品/运费",
    pro_price: "0",
    pro_old_price: "0.01",
    pro_sales: "7",
    pro_detail_pic: [
      require("../../assets/img/logo.png"),
      require("../../assets/img/logo.png"),
    ],
    pro_show_pic: require("../../assets/img/logo.png"),
    pro_color: "red",
    pro_size: "1米",
    pro_stock: "999",
  },
  {
    key: "2",
    pro_no: "2",
    pro_name: "哈哈",
    pro_category: "用品/衣架",
    pro_price: "0",
    pro_old_price: "0.01",
    pro_sales: "7",
    pro_detail_pic: [require("../../assets/img/doggy.jpg")],
    pro_show_pic: require("../../assets/img/logo.png"),
    pro_color: "red",
    pro_size: "1米",
    pro_stock: "999",
  },
];
const fileList = [];
const category = [
  {
    id: 1,
    name: "类别1",
    sub: [
      {
        id: 3,
        name: "子类别1",
      },
      {
        id: 4,
        name: "子类别2",
      },
      {
        id: 5,
        name: "子类别3",
      },
    ],
  },
  {
    id: 2,
    name: "类别2",
    sub: [
      {
        id: 6,
        name: "子类别11",
      },
      {
        id: 7,
        name: "子类别22",
      },
    ],
  },
];
// const navData = ["父类别1", "父类别2", "父类别3"];
// const subData = {
//   父类别1: ["子类别1", "子类别2"],
//   父类别2: ["子类别1", "子类别2"],
//   父类别3: ["子类别1", "子类别2"],
// };
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  name: "QueryList",
  components: { StandardTable },
  data() {
    return {
      fileList, //新增商品上传文件
      navData: [], //父类别数组
      subData: [], //子类别
      navId: "",
      subId: "",
      indexNum: 0,
      previewVisible: false,
      previewImage: "",
      category,
      // category_nav: subData[navData[0]],
      // category_sub: subData[navData[0]][0],
      advanced: true,
      columns: columns,
      proList,
      proShowList: proList,
      queryParamter: [],
      selectedRows: [],
      showEdit: [], //显示编辑框
      showBtn: [],
      exporting: false,
      addFormVisible: false,
      importVisible: false,
      confirmLoading: false,
      import_confirmLoading: false,
      btnState: true, //是否禁用按钮
      list: [], //传给后台的列表数据
      uploadData: [], //上传的数据
      uploadFileList: [], //文件数据
      uploadUrl: "",
      import_headers: {
        authorization: "authorization-text",
      },
      uploadColumns: [
        {
          title: "编号",
          dataIndex: "pro_no",
          key: "pro_no",
        },
        {
          title: "名称",
          dataIndex: "pro_name",
          key: "pro_name",
        },
        {
          title: "类别",
          dataIndex: "pro_category",
          key: "pro_category",
        },
        {
          title: "价格",
          dataIndex: "pro_price",
          key: "pro_price",
        },
        {
          title: "原价",
          dataIndex: "pro_old_price",
          key: "pro_old_price",
        },
        {
          title: "颜色",
          dataIndex: "pro_color",
          key: "pro_color",
        },
        {
          title: "规格",
          dataIndex: "pro_size",
          key: "pro_size",
        },
        {
          title: "库存",
          dataIndex: "pro_stock",
          key: "pro_stock",
        },
      ],
      editingKey: "", //编辑行
      headers: { authorization: "authorization-text" },
    };
  },
  created() {
    proList.forEach((item) => {
      item["editable"] = false;
    });
    console.log(proList);
    this.navData = this.category.slice(0, this.category.length);
    this.handleCategory();
    console.log(this.proList[0].pro_detail_pic);
  },
  beforeCreate() {
    this.queryForm = this.$form.createForm(this);
    this.addForm = this.$form.createForm(this);
  },
  methods: {
    handleUploadDetail(info) {
      if (info.dile.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploade successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file uploade failed`);
      }
    },
    handleCategory() {
      for (let i in this.navData.length) {
        if (this.navData[i].id === this.navId) {
          this.indexNum = i;
          break;
        }
      }
      this.subData = this.navData[this.indexNum].sub;
    },
    deleteRecord(key) {
      console.log(key);
      this.proShowList = this.proShowList.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    remove() {
      this.proShowList = this.proShowList.filter(
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
    addNew() {
      this.addFormVisible = true;
    },
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log("error", error);
        console.log("Received values of form: ", values);
        if (!error) {
          this.queryParamter = {
            pro_no: values.pro_no,
            pro_name: values.pro_name,
            pro_category: values.pro_category,
            pro_color: values.pro_color,
            pro_size: values.pro_size,
          };
        }
        console.log(this.queryParamter);
      });
    },
    handleReset() {
      this.queryForm.resetFields();
    },
    editAll() {},
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    export2Excel() {
      this.exporting = true;
      require.ensure([], () => {
        const tHeader = [
          "编号",
          "名称",
          "类别",
          "价格",
          "原价",
          "销量",
          "颜色",
          "规格",
          "库存",
        ];
        const filterVal = [
          "pro_no",
          "pro_name",
          "pro_category",
          "pro_price",
          "pro_old_price",
          "pro_sales",
          "pro_color",
          "pro_size",
          "pro_stock",
        ];
        const proShowList = this.proShowList;
        const data = this.formatJson(filterVal, proShowList);
        export_json_to_excel(tHeader, data, "商品列表");
      });
      this.exporting = false;
    },
    formatJson(filterVal, proShowList) {
      return proShowList.map((v) => filterVal.map((j) => v[j]));
    },
    downloadModule() {
      require.ensure([], () => {
        // const tHeader = this.columns
        //   .slice(0, this.columns.length - 1)
        //   .map((r) => r.title);
        const tHeader = [
          "编号",
          "名称",
          "类别",
          "价格",
          "原价",
          "颜色",
          "规格",
          "库存",
        ];
        const filterVal = [
          "pro_no",
          "pro_name",
          "pro_category",
          "pro_price",
          "pro_old_price",
          "pro_color",
          "pro_size",
          "pro_stock",
        ];
        const list = [];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "商品列表模板");
      });
    },
    showImportModel() {
      this.importVisible = true;
    },
    handleImportOk() {
      this.importVisible = false;
    },
    handleImportCancel() {
      this.importVisible = false;
    },

    //新增商品
    handleAddOk() {
      this.addForm.validateFields((err, value) => {
        if (!err) {
          console.log("Received values of form:", value);
          this.proShowList.splice(this.proShowList.length, 1, value);
        }
      });
      this.confirmLoading = true;
      setTimeout(() => {
        this.addFormVisible = false;
        this.confirmLoading = false;
        this.addForm.resetFields();
      }, 2000);
    },
    handleAddCancel() {
      this.addFormVisible = false;
    },
    handleCancelPic() {
      this.previewVisible = false;
    },
    handleCateChange(value) {
      console.log(value);
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChangePic({ fileList }) {
      this.fileList = fileList;
      console.log(this.fileList);
    },
    handleNavChange(value) {
      const result = [];
      var that = this;
      that.info = that.raw_List;
      for (let i = 0; i < that.raw_List.length; i++) {
        var infoA = that.raw_List[i];
        if (infoA.category.indexOf(value.label) != -1) {
          result.push(that.info[i]);
        }
        if (value.label == "全部") {
          result.push(that.raw_List[i]);
        }
      }
      that.info = result;
    },
    handleImportChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
      if (info.file.response && info.file.response.data == null) {
        this.btnState = true;
      }
      if (info.file.response && info.file.response.data != null) {
        this.btnState = false;
        info.file.response.data.forEach((item, index) => {
          this.$set(this.uploadData, index, {
            key: index.toString(),
            pro_no: index + 1,
            pro_name: item.name,
            pro_category: item.category,
            pro_price: item.show_price,
            pro_old_price: item.pre_price,
            pro_color: item.color,
            pro_size: item.size,
            pro_stock: item.stock,
          });
        });
        this.list = info.file.response.data;
        console.log(this.uploadData);
      } else if (
        info.file.response &&
        info.file.response.message !== null &&
        this.uploadFileList.length > 0
      ) {
        console.log(info.file.response);
        const h = this.$createElement;
        this.$error({
          title: "提醒",
          content: h("div", {}, [
            h("p", `${info.file.response.message}`),
            h("p", "请确认无误后重新上传"),
          ]),
        });
      }
    },
    handleChange(value, key, column) {
      const newData = [...this.proList];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.proList = newData;
      }
    },
    handleEdit(key) {
      const newData = [...this.proList];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.proList = newData;
      }
    },
    handleSave(key) {
      const newData = [...this.proList];
      const newShowData = [...this.proShowList];
      const target = newData.filter((item) => key === item.key)[0];
      const targetShow = newShowData.filter((item) => key === item.key)[0];
      if (target && targetShow) {
        target.editable = false;
        this.proList = newData;
        Object.assign(targetShow, target);
        this.proShowList = newShowData;
      }
      this.editingKey = "";
      console.log("proList: " + this.proList);
      console.log("proShowList: " + this.proShowList);
    },
    handleCancel(key) {
      const newData = [...this.proList];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.proShowList.filter((item) => key === item.key)[0]
        );
        target.editable = false;
        this.proList = newData;
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
