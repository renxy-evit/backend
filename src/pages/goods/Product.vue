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
      :isEdit="isEdit"
      :target="target"
      :visible="submitVisible"
      @closeModal="closeModal"
      @getSubmitInfo="handleAddOk"
    />
    <prod-submit
      :isEdit="isEdit"
      :target="target"
      :visible="editVisible"
      @closeEditModal="closeEditModal"
      @getSubmitInfo="handleUpdateOk"
    />
    <prod-submit
      :isEdit="isEdit"
      :target="target"
      :visible="submitSizeVisible"
      @closeModal="closeSizeModal"
      @getSubmitInfo="handleUpdateSize"
    />
    <pic-show
      :visible="showVisible"
      :picList="showPicList"
      @closePicModal="closeShowModal"
    />
    <pic-show
      :visible="detailVisible"
      :picList="detailPicList"
      @closePicModal="closeDetailModal"
    />

    <div>
      <a-form
        layout="horizontal"
        :form="queryForm"
        @submit.prevent="handleSearch"
      >
        <div>
          <a-row>
            <a-col :md="6" :sm="24" style="margin-right: 5px">
              <a-form-item
                label="商品编号"
                v-model="listQuery.pro_no"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  allow-clear
                  v-decorator="['pro_no', { rules: [{ required: false }] }]"
                  style="width: 100%; margin-right: 5px"
                  placeholder="请输入"
                  autocomplete="off"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" style="margin-right: 5px">
              <a-form-item
                label="商品名称"
                v-model="listQuery.pro_name"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  allow-clear
                  autocomplete="off"
                  style="width: 100%,margin-right: 5px"
                  placeholder="请输入商品全名"
                  v-decorator="['pro_name', { rules: [{ required: false }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" style="margin-right: 5px">
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
                  style="margin-right: 5px"
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
            <a-col :md="3" :sm="24" style="margin-left: 50px">
              <span>
                <a-button
                  type="primary"
                  html-type="submit"
                  style="margin-top: 3px"
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px; margin-top: 3px"
                  @click="handleReset"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <a-space class="operator search">
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
    </div>
    <div>
      <standard-table
        :columns="columns"
        :dataSource="proShowList"
        :selectedRows.sync="selectedRows"
        :scroll="{ x: 1500 }"
        @clear="onClear"
        @change="onChange"
      >
        <template slot="pro_no" slot-scope="{ text, record }">
          <span v-if="!getTableSub(record.key, proList)">{{ text }}</span
          ><br />
          <span v-if="record.onSale" style="color: #ff8b8c"
            >已上架<a-icon type="pushpin"
          /></span>
          <span v-if="record.preSale" style="color: #ffcd43"
            >预售中<a-icon type="history"
          /></span>
        </template>
        <template slot="pro_name" slot-scope="{ text, record }">
          <span v-if="!getTableSub(record.key, proList)">{{ text }}</span>
        </template>
        <template slot="pro_category" slot-scope="{ text, record }">
          <span v-if="!getTableSub(record.key, proList)">{{ text }}</span>
        </template>
        <template
          v-for="col in [
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
        <template slot="pro_detail_pic" slot-scope="{ record }">
          <div>
            <img
              class="show"
              :src="record.pro_detail_pic[0].url"
              style="width: 80px; height: 50px"
              @click="handleDetailPicClick(record.key)"
            />
          </div>
        </template>
        <template slot="pro_show_pic" slot-scope="{ record }">
          <div>
            <img
              class="show"
              :src="record.pro_show_pic[0].url"
              style="width: 80px; height: 50px"
              @click="handleShowPicClick(record.key)"
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
            title="该规格所有商品都将被删除，确定要删除吗?"
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
          <a-tooltip
            placement="top"
            title="新增规格"
            v-if="!getTableSub(record.key, proList)"
          >
            <a-button
              type="dashed"
              shape="circle"
              style="color: #2353b8"
              @click="handleAddSize(record.key)"
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
import PicShow from "./components/PicShow.vue";

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
    onSale: false,
    preSale: false,
    pro_name: "运运运运运运运费费费费费",
    pro_name_en: "delivery",
    pro_category: "类别1",
    pro_price: "1",
    pro_old_price: "1.5",
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
      {
        uid: "-2",
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
      {
        uid: "-2",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
      {
        uid: "-3",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
    pro_priority: "0",
    pro_detail: "hello world!",
    children: [
      {
        key: 3,
        onSale: false,
        preSale: false,
        pro_no: "3",
        pro_name: "运运运运运运运费费费费费",
        pro_name_en: "delivery",
        pro_category: "类别1",
        pro_price: "1",
        pro_old_price: "1.5",
        pro_color: "颜色1",
        pro_size: "规格2",
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
          {
            uid: "-2",
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
          {
            uid: "-2",
            name: "image.png",
            status: "done",
            url:
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          },
          {
            uid: "-3",
            name: "image.png",
            status: "done",
            url:
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          },
        ],
        pro_priority: "0",
        pro_detail: "hello world!",
      },
    ],
  },
  {
    key: 2,
    onSale: false,
    preSale: false,
    pro_no: "2",
    pro_name: "哈哈",
    pro_name_en: "haha",
    pro_category: "类别2",
    pro_price: "10",
    pro_old_price: "15",
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
    PicShow,
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
      editVisible: false,
      submitSizeVisible: false,
      isEdit: false,
      target: {},
      listQuery: {},
      selectKey: "",
      showVisible: false,
      detailVisible: false,
      showPicList: [],
      detailPicList: [],
    };
  },
  beforeCreate() {
    this.queryForm = this.$form.createForm(this);
  },
  created() {
    this.navData = this.category.slice(0, this.category.length);
    this.handleCategory();
    this.proShowList = JSON.parse(JSON.stringify(this.proList));
  },
  methods: {
    closeShowModal() {
      this.showVisible = false;
    },
    closeDetailModal() {
      this.detailVisible = false;
    },
    handleDetailPicClick(key) {
      this.detailVisible = true;
      const newData = [...this.proList];
      const target = newData.filter((item) => item.key === key)[0];
      if (target && target.pro_detail_pic) {
        this.detailPicList = target.pro_detail_pic;
      }
    },
    handleShowPicClick(key) {
      this.showVisible = true;
      const newData = [...this.proList];
      const target = this.getTarget(key, newData);
      console.log(target);
      if (target && target.pro_show_pic) {
        this.showPicList = target.pro_show_pic;
      }
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
    getDelTarget(key, array) {
      let target = [];
      console.log(key);
      for (let i of array) {
        if (i.key !== key && !i.children) {
          target.push(i);
        } else {
          if (i.key !== key && i.children && i.children.length > 0) {
            for (let j in i.children) {
              if (i.key !== key && i.children[j].key !== key) {
                target.push(i);
              } else {
                i.key !== key && i.children[j].key === key;
              }
              {
                i.children.splice(j, 1);
                target.push(i);
              }
            }
          }
        }
      }
      console.log(target);
      return target;
    },
    getCurrentKey() {
      let count = 0;
      this.proList.forEach((item) => {
        if (item.children) {
          item.children.forEach((subitem) => {
            if (subitem.key) {
              count = count + 1;
            }
          });
        }
        count = count + 1;
      });
      return count;
    },
    getTableNav(key, array) {
      for (let i in array) {
        if (array[i].key === key) {
          return i;
        } else if (array[i].key !== key && array[i].children.length > 0) {
          for (let j in array[i].children) {
            if (array[i].children[j].key === key) {
              return i;
            }
          }
        }
      }
    },
    getTableSub(key, array) {
      for (let i in array) {
        if (array[i].key === key) {
          return;
        } else if (array[i].key !== key && array[i].children.length > 0) {
          for (let j in array[i].children) {
            if (array[i].children[j].key === key) {
              return j;
            }
          }
        }
      }
    },
    showMsg(title) {
      this.$message.success(title);
    },
    showNot(message) {
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
    closeModal() {
      this.submitVisible = false;
    },
    closeEditModal() {
      this.editVisible = false;
      this.target = {};
    },
    closeSizeModal() {
      this.target = {};
      this.submitSizeVisible = false;
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
      this.proShowList = this.getDelTarget(key, this.proShowList);
      this.proList = this.getDelTarget(key, this.proList);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
      this.$message.success("删除成功！");
    },
    remove(resolve, reject) {
      console.log(reject);
      this.proShowList = this.proShowList.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.proList = this.proShowList;
      this.selectedRows = [];
      this.showNot("批量删除成功!");
      resolve();
    },
    //批量操作
    sale(resolve, reject) {
      console.log(reject);
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.selectedRows.forEach((item) => {
          const nav = this.getTableNav(item.key, this.proShowList);
          const sub = this.getTableSub(item.key, this.proShowList);
          if (nav && sub) {
            this.proShowList[nav].children[sub].onSale = true;
          } else if (nav && !sub) {
            this.proShowList[nav].onSale = true;
          } else {
            this.$message.error("预期外错误!");
          }
        });
        this.proList = this.proShowList;
        this.showNot("批量上架成功!");
        resolve();
      } else {
        this.en("未选中数据，无法进行批量操作!");
        // reject();
      }
    },
    //批量操作
    offSale(resolve, reject) {
      console.log(reject);
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.selectedRows.forEach((item) => {
          const nav = this.getTableNav(item.key, this.proShowList);
          const sub = this.getTableSub(item.key, this.proShowList);
          if (nav && sub) {
            this.proShowList[nav].children[sub].onSale = false;
          } else if (nav && !sub) {
            this.proShowList[nav].onSale = false;
          } else {
            this.$message.error("预期外错误!");
          }
        });
        this.proList = this.proShowList;
        this.showNot("批量下架成功!");
        resolve();
      } else {
        this.en("未选中数据，无法进行批量操作!");
        // reject();
      }
    },
    //批量操作
    preSale(resolve, reject) {
      console.log(reject);
      console.log(this.selectedRows);
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.selectedRows.forEach((item) => {
          const nav = this.getTableNav(item.key, this.proShowList);
          const sub = this.getTableSub(item.key, this.proShowList);
          if (nav && sub) {
            this.proShowList[nav].children[sub].preSale = true;
          } else if (nav && !sub) {
            this.proShowList[nav].preSale = true;
          } else {
            this.$message.error("预期外错误!");
          }
        });
        this.proList = this.proShowList;
        this.showNot("批量预售成功！");
        resolve();
      } else {
        this.en("未选中数据，无法进行批量操作!");
        // reject();
      }
    },
    //批量操作
    isSale(resolve, reject) {
      console.log(reject);
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.selectedRows.forEach((item) => {
          const nav = this.getTableNav(item.key, this.proShowList);
          const sub = this.getTableSub(item.key, this.proShowList);
          if (nav && sub) {
            this.proShowList[nav].children[sub].preSale = false;
          } else if (nav && !sub) {
            this.proShowList[nav].preSale = false;
          } else {
            this.$message.error("预期外错误!");
          }
        });
        this.proList = this.proShowList;
        this.showNot("批量出售成功");
        resolve();
      } else {
        this.en("未选中数据，无法进行批量操作!");
        // reject();
      }
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
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
        console.log(values);
        const queryKey = [];
        const queryValue = [];
        if (!error && values) {
          for (let i in values) {
            if (values[i] === undefined || !values[i]) {
              continue;
            } else {
              queryKey.push(i);
              queryValue.push(values[i]);
            }
          }
          console.log(queryKey);
        }
        const { proList } = this;
        console.log(proList);
        const _info = _.cloneDeep(proList);
        const result = [];
        let count = 0;
        if (queryKey.length === 0) {
          this.$message.error("查询内容不能为空");
        } else {
          for (let i in proList) {
            for (let j in queryKey) {
              const infoA = proList[i][queryKey[j]];
              if (
                queryValue[j] !== undefined &&
                infoA.includes(queryValue[j])
              ) {
                count = count + 1;
              }
            }
            if (count === queryKey.length) {
              result.push(_info[i]);
              count = 0;
            } else if (count < queryKey.length) {
              count = 0;
            }
            this.proShowList = result;
          }
        }
        if (
          this.proShowList &&
          this.proShowList.length > 0 &&
          count === queryKey.length
        ) {
          this.showMsg("查询成功");
        } else {
          this.$message.error("查询失败，未搜索到符合条件的商品!");
        }
        console.log(this.proShowList);
      });
      // this.queryForm.resetFields();
    },
    handleReset() {
      this.queryForm.resetFields();
      console.log(this.proList);
      this.proShowList = Object.assign(this.proShowList, this.proList);
      this.showMsg("重置成功!");
    },
    handleMenuClick(e) {
      const _this = this;
      if (e.key === "delete") {
        if (this.selectedRows && this.selectedRows.length > 0) {
          this.$confirm({
            title: "批量删除",
            content: "您确定要批量删除选中的商品吗？",
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
      }
      if (e.key === "onSale") {
        return new Promise((resolve, reject) => {
          const res = _this.sale(resolve, reject);
          return res;
        });
      }
      if (e.key === "offSale") {
        return new Promise((resolve, reject) => {
          const res = _this.offSale(resolve, reject);
          return res;
        });
      }
      if (e.key === "preSale") {
        return new Promise((resolve, reject) => {
          const res = _this.preSale(resolve, reject);
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
      if (value) {
        value.key = this.getCurrentKey() + 1;
        value.pro_no = this.getCurrentKey() + 1;
        value.children = [];
        proList.push(value);
        this.proShowList = Object.assign(this.proShowList, proList);
      }
    },
    handleUpdateOk(value) {
      if (value) {
        console.log(value);
        const newData = this.getTarget(this.selectKey, this.proShowList);
        const keys = Object.keys(value);
        for (let i of keys) {
          newData[i] = value[i];
        }
        console.log(newData);
        const nav = this.getTableNav(this.selectKey, this.proList);
        const sub = this.getTableSub(this.selectKey, this.proList);
        if (nav && sub) {
          this.proList[nav].children[sub] = newData;
          this.proShowList[nav].children[sub] = newData;
        } else if (!sub && nav) {
          this.proList[nav] = newData;
          this.proShowList[nav] = newData;
        }
        console.log(this.proList);
        console.log("----------");
        console.log(this.proShowList);
        this.target = {};
      }
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
      this.selectKey = key;
      console.log(this.selectKey);
      this.isEdit = true;
      this.target = this.getTarget(key, this.proShowList);
      this.target.category_nav = this.target.pro_category.includes("/")
        ? this.target.pro_category.split("/")[0]
        : this.target.pro_category;
      this.target.category_sub = this.target.pro_category.includes("/")
        ? this.target.pro_category.split("/")[1]
        : "";
      console.log(this.target);
      console.log(this.target.parentNode);
      this.editVisible = true;
    },
    handleAddSize(key) {
      this.isEdit = false;
      this.selectKey = key;
      const newData = [...this.proShowList];
      this.target = newData.filter((item) => item.key === key)[0];
      this.target.category_nav = this.target.pro_category.includes("/")
        ? this.target.pro_category.split("/")[0]
        : this.target.pro_category;
      this.target.category_sub = this.target.pro_category.includes("/")
        ? this.target.pro_category.split("/")[1]
        : "";
      this.target.pro_color = "";
      this.target.pro_size = "";
      this.target.pro_price = "";
      this.target.pro_old_price = "";
      this.target.pro_priority = "";
      this.target.pro_stock = "";
      this.target.pro_detail = "";
      this.proShowList = this.proList;
      this.submitSizeVisible = true;
    },
    handleUpdateSize(value) {
      if (value) {
        console.log(value);
        const { proList } = this;
        value.key = this.getCurrentKey() + 1;
        value.pro_no = this.getCurrentKey() + 1;
        value.onSale = false;
        value.preSale = false;
        const nav = this.getTableNav(this.selectKey, proList);
        const child = proList[nav].children;
        child.push(value);
        this.proShowList = this.proList;
        console.log(this.proList);
      }
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
    //行操作
    handleOnSale(key) {
      const newData = [...this.proList];
      let target = this.getTarget(key, this.proList);
      if (target) {
        target.onSale = true;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.showNot("上架成功");
    },
    //行操作
    handleOffSale(key) {
      const newData = [...this.proList];
      let target = this.getTarget(key, this.proList);
      if (target) {
        target.onSale = false;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.showNot("下架成功");
    },
    //行操作
    handlePreSale(key) {
      const newData = [...this.proList];
      let target = this.getTarget(key, this.proList);
      if (target) {
        target.preSale = true;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.showNot("预售成功");
    },
    //行操作
    handleIsSale(key) {
      const newData = [...this.proList];
      let target = this.getTarget(key, this.proList);
      if (target) {
        target.preSale = false;
        this.proList = newData;
        this.proShowList = newData;
      }
      this.showNot("出售成功");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/normal.css");
.search {
  margin-top: 20px;
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
.show:hover {
  cursor: pointer;
}
</style>
