<template>
  <a-card>
    <a-modal
      :visible="importVisible"
      @ok="handleImportOk"
      @cancel="handleImportCancel"
      :confirm-loading="import_confirmLoading"
      :fileList="uploadFileList"
      title="导入商品"
    >
      <div class="uploadModal">
        <a-upload
          name="importGoods"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :headers="import_headers"
          :beforeUpload="handleBeforeUploadXlsx"
          @change="handleImportChange"
          style="margin-right: 10px; float: left"
        >
          <a-button type="upload">导入商品</a-button>
        </a-upload>
        <a-button @click="downloadModule" style="float: left"
          >下载模板</a-button
        >
      </div>
    </a-modal>

    <prod-submit
      :is-edit="isEdit"
      :target="target"
      :visible="submitVisible"
      @closeModal="closeModal"
      @getSubmitInfo="handleAddOk"
    ></prod-submit>
    <!-- <a-modal
      :visible="addFormVisible"
      :confirm-loading="confirmLoading"
      @ok="handleAddOk"
      @cancel="handleAddCancel"
    >
      <a-form :form="addForm" layout="horizontal">
        <a-form-item label="商品名称、英文名">
          <a-input
            class="input"
            placeholder="商品名称（必填）"
            v-decorator="[
              'pro_name',
              { rules: [{ required: true, message: '请填写商品名称' }] },
            ]"
          />
          <a-input class="input" placeholder="商品英文名（选填）" />
        </a-form-item>
        <a-form-item label="商品类别" style="display: inline-block">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'category_nav',
              { rules: [{ required: true, message: '请填写商品分类' }] },
            ]"
          >
            <a-select-option
              v-for="nav in navData"
              :key="nav.id"
              :value="nav.name"
              >{{ nav.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item style="display: inline-block; margin-top: 38px">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'category_sub',
              { rules: [{ required: false, message: '请填写商品分类' }] },
            ]"
          >
            <a-select-option
              v-for="sub in subData"
              :key="sub.id"
              :value="sub.name"
              >{{ sub.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="商品颜色">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'pro_color',
              { rules: [{ required: true, message: '请填写商品颜色' }] },
            ]"
          >
            <a-select-option v-for="item in colorOptions" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品规格">
          <a-select
            class="select"
            placeholder="请选择"
            v-decorator="[
              'pro_size',
              { rules: [{ required: true, message: '请填写商品规格' }] },
            ]"
          >
            <a-select-option v-for="item in sizeOptions" :key="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品现价">
          <a-input
            class="input"
            type="text"
            placeholder="商品现价"
            v-decorator="[
              'pro_price',
              { rules: [{ required: true, message: '请填写商品现价' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="商品原价">
          <a-input
            class="input"
            type="text"
            placeholder="商品原价"
            v-decorator="['pro_old_price', (rules = [{ required: false }])]"
          />
        </a-form-item>
        <a-form-item label="商品库存">
          <a-input
            class="input"
            type="text"
            placeholder="商品库存"
            v-decorator="[
              'pro_stock',
              { rules: [{ required: true, message: '请填写商品库存' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="商品权重">
          <a-input
            class="input"
            type="text"
            setFieldsValue="0"
            v-decorator="['pro_priority', (rules = [{ required: true }])]"
          />
        </a-form-item>
        <a-form-item label="文字说明">
          <a-textarea
            type="text"
            placeholder="选填"
            style="overflow: auto; vertical-align: top; width: auto"
            v-decorator="['pro_detail', (rules = [{ required: false }])]"
          />
        </a-form-item>
      </a-form>
    </a-modal> -->

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
                  placeholder="请输入商品全名"
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
                  <a-select-option
                    v-for="item in navData"
                    :key="item.id"
                    :value="item.name"
                    >{{ item.name }}</a-select-option
                  >
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
                <a-select
                  placeholder="请选择"
                  v-decorator="['pro_color', { rules: [{ required: false }] }]"
                >
                  <a-select-option
                    v-for="item in colorOptions"
                    :key="item.id"
                    :value="item.name"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
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
                  <a-select-option
                    v-for="item in sizeOptions"
                    :key="item.id"
                    :value="item.name"
                    >{{ item.name }}</a-select-option
                  >
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
            <a-menu-item key="delete"
              ><a-icon type="delete" style="color: #f5222d" />删除</a-menu-item
            >
            <a-menu-item key="onSale"
              ><a-icon
                type="carry-out"
                style="color: #7ac35a"
              />上架</a-menu-item
            >
            <a-menu-item key="offSale"
              ><a-icon
                type="calendar"
                style="color: #ffcd43"
              />下架</a-menu-item
            >
            <a-menu-item key="preSale"
              ><a-icon type="rocket" style="color: #7ac35a" />预售</a-menu-item
            >
            <a-menu-item key="isSale"
              ><a-icon
                type="thunderbolt"
                style="color: #ffcd43"
              />出售</a-menu-item
            >
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
        <template slot="pro_no" slot-scope="{ text, record }">
          {{ text }}<br />
          <span v-if="record.onSale" style="color: #ff8b8c"
            >已上架<a-icon type="pushpin"
          /></span>
          <span v-if="record.preSale" style="color: #ffcd43"
            >预售中<a-icon type="history"
          /></span>
        </template>
        <template
          v-for="col in [
            'pro_name',
            'pro_category',
            'pro_old_price',
            'pro_price',
            'pro_color',
            'pro_size',
            'pro_stock',
          ]"
          :slot="col"
          slot-scope="{ text }"
        >
          {{ text }}
        </template>
        <template
          v-for="(item, index) in ['pro_detail_pic']"
          slot="pro_detail_pic"
          slot-scope="{ record }"
        >
          <div :key="index">
            <img
              :src="record.pro_detail_pic[index].url"
              style="width: 80px; height: 50px"
            />
          </div>
        </template>
        <template
          v-for="(item, index) in ['pro_show_pic']"
          slot="pro_show_pic"
          slot-scope="{ record }"
        >
          <div :key="index">
            <img
              :src="record.pro_show_pic[index].url"
              style="width: 80px; height: 50px"
            />
          </div>
        </template>
        <div slot="pro_action" slot-scope="{ record }">
          <a-tooltip placement="top" title="编辑">
            <a-button
              type="dashed"
              shape="circle"
              style="color: #2353b8"
              :disabled="editingKey !== ''"
              @click="() => handleEdit(record.key)"
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
          <a-tooltip placement="top" :title="!record.onSale ? '上架' : '下架'">
            <a-button
              type="dashed"
              shape="circle"
              :style="!record.onSale ? 'color: #7ac35a' : 'color:#ffcd43'"
              @click="
                !record.onSale
                  ? handleOnSale(record.key)
                  : handleOffSale(record.key)
              "
              ><a-icon :type="!record.onSale ? 'carry-out' : 'calendar'"
            /></a-button>
          </a-tooltip>
          <a-tooltip placement="top" :title="record.preSale ? '出售' : '预售'">
            <a-button
              type="dashed"
              shape="circle"
              :style="record.preSale ? 'color: #ffcd43' : 'color:#7ac35a'"
              @click="
                record.preSale
                  ? handleIsSale(record.key)
                  : handlePreSale(record.key)
              "
              ><a-icon :type="record.preSale ? 'thunderbolt' : 'rocket'"
            /></a-button>
          </a-tooltip>
          <a-tooltip placement="top" title="新增规格">
            <a-button
              type="dashed"
              shape="circle"
              style="color: #2353b8"
              @click="handleAddSize"
              ><a-icon type="file-add"
            /></a-button>
          </a-tooltip>
        </div>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
import { export_json_to_excel } from "../../plugins/Export2Excel";
import _ from "lodash";
import ProdSubmit from "./components/ProdSubmit.vue";

const columns = [
  {
    title: "编号",
    dataIndex: "pro_no",
    align: "center",
    width: "100px",
    fixed: "left",
    scopedSlots: { customRender: "pro_no" },
  },
  {
    title: "名称",
    dataIndex: "pro_name",
    align: "center",
    scopedSlots: { customRender: "pro_name" },
  },
  {
    title: "类别",
    dataIndex: "pro_category",
    width: "100px",
    align: "center",
    scopedSlots: { customRender: "pro_category" },
  },
  {
    title: "原价",
    dataIndex: "pro_old_price",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "pro_old_price" },
  },
  {
    title: "价格",
    dataIndex: "pro_price",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "pro_price" },
  },

  {
    title: "颜色",
    dataIndex: "pro_color",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "pro_color" },
  },
  {
    title: "规格",
    dataIndex: "pro_size",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "pro_size" },
  },
  {
    title: "库存",
    dataIndex: "pro_stock",
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "pro_stock" },
  },
  {
    title: "销量",
    dataIndex: "pro_sales",
    sorter: true,
    align: "center",
    width: "100px",
    scopedSlots: { customRender: "pro_sales" },
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
    fixed: "right",
    scopedSlots: { customRender: "pro_action" },
  },
];

const proList = [
  {
    key: 1,
    pro_no: "1",
    pro_name: "运运运运运运运费费费费费",
    pro_name_en: "delivery",
    pro_category: "类别1",
    pro_price: "0",
    pro_old_price: "0.01",
    pro_color: "颜色1",
    pro_size: "规格1",
    pro_stock: "999",
    pro_sales: "7",
    pro_detail_pic: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    pro_show_pic: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    pro_priority: "0",
    pro_detail: "hello world!",
  },
  {
    key: 2,
    pro_no: "2",
    pro_name: "哈哈",
    pro_name_en: "haha",
    pro_category: "类别2",
    pro_price: "0",
    pro_old_price: "0.01",
    pro_sales: "7",
    // pro_detail_pic: [require("../../assets/img/doggy.jpg")],
    pro_detail_pic: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    pro_show_pic: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    pro_color: "颜色2",
    pro_size: "规格2",
    pro_stock: "999",
    pro_priority: "0",
    pro_detail: "hello world",
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
const colorOptions = [
  {
    id: 1,
    name: "颜色1",
  },
  {
    id: 2,
    name: "颜色2",
  },
  {
    id: 3,
    name: "颜色3",
  },
];
const sizeOptions = [
  {
    id: 1,
    name: "规格1",
  },
  {
    id: 2,
    name: "规格2",
  },
  {
    id: 3,
    name: "规格3",
  },
];
export default {
  name: "product",
  components: {
    StandardTable,
    ProdSubmit,
  },
  data() {
    return {
      navData: [], //父类别数组
      subData: [], //子类别
      navId: "",
      subId: "",
      indexNum: 0,
      // previewVisible: false,
      // previewImage: "",
      fileList, //新增商品上传文件
      category,
      colorOptions,
      sizeOptions,
      advanced: true,
      columns,
      proList,
      proShowList: [],
      selectedRows: [],
      exporting: false,
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

      submitVisible: false,
      isEdit: false,
      target: {},
    };
  },
  created() {
    this.navData = this.category.slice(0, this.category.length);
    this.handleCategory();
    this.proList.forEach((item) => {
      item["onSale"] = false;
      item["preSale"] = false;
    });
    this.proShowList = JSON.parse(JSON.stringify(this.proList));
  },
  beforeCreate() {
    this.queryForm = this.$form.createForm(this);
    this.addForm = this.$form.createForm(this);
  },
  methods: {
    closeModal() {
      this.submitVisible = false;
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
    remove(resolve, reject) {
      // console.log(resolve);
      console.log(reject);
      this.proShowList = this.proShowList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.proList = this.proShowList;
      this.selectedRows = [];
      resolve();
    },
    sale(resolve, reject) {
      console.log(reject);
      this.proShowList = this.proShowList.filter((item) =>
        this.selectedRows.filter((row) => row.key === item.key)
      );
      this.proShowList.forEach((item) => {
        item.onSale = true;
      });
      this.proList = this.proShowList;
      resolve();
    },
    offSale(resolve, reject) {
      console.log(reject);
      this.proShowList = this.proShowList.filter((item) =>
        this.selectedRows.filter((row) => row.key === item.key)
      );
      this.proShowList.forEach((item) => {
        item.onSale = false;
      });
      this.proList = this.proShowList;
      resolve();
    },
    preSale(resolve, reject) {
      console.log(reject);
      this.proShowList = this.proShowList.filter((item) =>
        this.selectedRows.filter((row) => row.key === item.key)
      );
      this.proShowList.forEach((item) => {
        item.preSale = true;
      });
      this.proList = this.proShowList;
      resolve();
    },
    isSale(resolve, reject) {
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.proShowList = this.proShowList.filter((item) =>
          this.selectedRows.filter((row) => row.key === item.key)
        );
        this.proShowList.forEach((item) => {
          item.preSale = false;
        });
        this.proList = this.proShowList;
        this.$message.success("批量出售成功");
        resolve();
      } else {
        this.$message.error("未选中数据，无法进行批量操作!");
        reject();
      }
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
      this.submitVisible = true;
      this.isEdit = false;
    },
    handleSearch(e) {
      e.preventDefault();
      this.queryForm.validateFields((error, values) => {
        const queryKey = [];
        const queryValue = [];
        if (!error) {
          for (let i in values) {
            if (values[i] === undefined) {
              continue;
            } else {
              queryKey.push(i);
              queryValue.push(values[i]);
            }
          }
        }

        const { proList } = this;
        const _info = _.cloneDeep(proList);
        const result = [];
        if (queryKey.length === 0) {
          this.proShowList = _info;
        } else {
          for (let i in proList) {
            for (let j in queryKey) {
              let count = 0;
              const infoA = proList[i][queryKey[j]];
              if (
                queryValue[j] !== undefined &&
                infoA.indexOf(queryValue[j]) >= 0
              ) {
                count = count + 1;
                if (count === queryKey.length) {
                  result.push(_info[i]);
                }
              }
            }
            this.proShowList = result;
          }
        }
        this.$message.success("查询成功");
      });
      this.queryForm.resetFields();
    },
    handleReset() {
      this.queryForm.resetFields();
    },
    handleMenuClick(e) {
      const _this = this;
      if (e.key === "delete") {
        this.$confirm({
          title: "批量删除",
          content: "你确定要批量删除选中的商品吗？",
          onOk() {
            return new Promise((resolve, reject) => {
              const res = _this.remove(resolve, reject);
              _this.$message.success("批量删除成功");
              return res;
            }).catch(() => console.log("Oops errors!"));
          },
          onCancel() {},
        });
      }
      if (e.key === "onSale") {
        return new Promise((resolve, reject) => {
          const res = _this.sale(resolve, reject);
          _this.$message.success("批量上架成功");
          return res;
        });
      }
      if (e.key === "offSale") {
        return new Promise((resolve, reject) => {
          const res = _this.offSale(resolve, reject);
          _this.$message.success("批量下架成功");
          return res;
        });
      }
      if (e.key === "preSale") {
        return new Promise((resolve, reject) => {
          const res = _this.preSale(resolve, reject);
          _this.$message.success("批量预售成功");
          return res;
        });
      }
      if (e.key === "isSale") {
        return new Promise((resolve, reject) => {
          const res = _this.isSale(resolve, reject);

          return res;
        });
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
    handleAddOk(value) {
      const { proList } = this;
      value.key = proList.length + 1;
      value.pro_no = proList.length + 1;
      proList.push(value);
      console.log(this.proList);
      this.proShowList = Object.assign(this.proShowList, proList);
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
        this.uploadData = info.file.response.data;
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
    ToggleTarget(key, k) {
      const newData = [...this.proList];
      const target = newData.filter((item) => item.key === key)[0];
      if (target) {
        target.k = !target[k];
        (this.proList = newData), (this.proShowList = newData);
      }
      console.log(target);
    },
    handleEdit(key) {
      this.isEdit = true;
      const newData = [...this.proList];
      this.target = newData.filter((item) => item.key === key)[0];
      console.log(this.target);
      this.submitVisible = true;
    },
    handleAddSize(key) {
      const newData = [...this.proList];
      this.target = newData.filter((item) => item.key === key)[0];
      console.log(this.target);
      this.submitVisible = true;
    },
    handleBeforeUploadXlsx(file) {
      return new Promise((resolve, reject) => {
        const isXlsx = file.name.endsWith(".xlsx");
        const isXlx = file.name.endsWith(".xlx");
        if (!(isXlsx || isXlx)) {
          this.$message.error("只能上传xlx和xlsx格式的文件");
          return reject(false);
        }
        return resolve(true);
      });
    },
    handleOnSale(key) {
      const newData = [...this.proList];
      const target = [...this.proList].filter((item) => item.key === key)[0];
      if (target) {
        target.onSale = true;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.$notification.success({
        message: "上架成功",
        duration: 1.5,
      });
    },
    handleOffSale(key) {
      const newData = [...this.proList];
      const target = [...this.proList].filter((item) => item.key === key)[0];
      if (target) {
        target.onSale = false;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.$notification.success({
        message: "下架成功",
        duration: 1.5,
      });
    },
    handlePreSale(key) {
      const newData = [...this.proList];
      const target = [...this.proList].filter((item) => item.key === key)[0];
      if (target) {
        target.preSale = true;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.$notification.success({
        message: "预售成功",
        duration: 1.5,
      });
    },
    handleIsSale(key) {
      const newData = [...this.proList];
      const target = [...this.proList].filter((item) => item.key === key)[0];
      if (target) {
        target.preSale = false;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.$notification.success({
        message: "出售成功",
        duration: 1.5,
      });
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
showuploadlist {
  showremoveicon: false;
}
.uploadModal {
  height: 30px;
}
</style>
