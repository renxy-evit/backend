<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false" title="用户信息表">
      <div slot="extra">
        <a-input-search
          style="margin-left: 16px; width: 272px"
          @search="onSearch"
        />
      </div>
      <a-list
        size="large"
        :pagination="{ ...paginationProps, current: currentPage }"
      >
        <a-list-item :key="index" v-for="(i, index) in showData">
          <div class="list-content">
            <div
              class="list-content-item"
              style="width: 10px; font-size: 22px; margin-bottom: 10px"
            >
              <p>{{ i.number }}</p>
            </div>
          </div>
          <a-list-item-meta :description="i.tel" class="list-item-meta">
            <a-avatar
              slot="avatar"
              size="large"
              shape="square"
              :src="i.avatarUrl"
            />
            <span slot="title">{{ i.name }}</span>
          </a-list-item-meta>
          <div class="list-content">
            <div class="list-content-item">
              <span>卡号</span>
              <p>{{ i.cardNum }}</p>
            </div>
            <div class="list-content-item">
              <span>余额</span>
              <p>{{ i.wallet }}</p>
            </div>
            <div class="list-content-item">
              <span>积分</span>
              <p>{{ i.integral }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import _ from "lodash";
const userInfo = [
  {
    number: "1",
    name: "张三",
    tel: "1391212221",
    avatarUrl: require("../assets/img/doggy.jpg"),
    sex: "男",
    cardNum: "135977416325",
    wallet: "0.00",
    integral: "0",
  },
  {
    number: "2",
    name: "李四",
    tel: "0510-86225544",
    avatarUrl: require("../assets/img/doggy.jpg"),
    sex: "男",
    cardNum: "13562698426",
    wallet: "9.00",
    integral: "0",
  },
];
export default {
  name: "StandardList",
  data() {
    return {
      userInfo,
      searchInfo: userInfo,
      currentPage: 1,
    };
  },
  computed: {
    paginationProps() {
      const _this = this;
      return {
        showQuickJumper: true,
        pageSize: 10,
        total: this.searchInfo.length,
        onChange(page) {
          _this.currentPage = page;
        },
      };
    },
    showData() {
      const { pageSize, total } = this.paginationProps;
      const res = [];
      const start = (this.currentPage - 1) * pageSize;
      const end =
        this.currentPage * pageSize < total
          ? this.currentPage * pageSize
          : total;
      for (let i = start; i < end; i++) {
        res.push(this.searchInfo[i]);
      }
      return res;
    },
  },
  methods: {
    onSearch(value) {
      const { userInfo } = this;
      const result = [],
        _info = _.cloneDeep(userInfo);
      for (let i = 0; i < userInfo.length; i++) {
        const infoA = userInfo[i];
        if (infoA.name && infoA.name.indexOf(value) !== -1) {
          result.push(_info[i]);
        } else if (infoA.name && infoA.name.indexOf(value) === -1) {
          result.push();
        } else if (value === "") {
          result.push(infoA);
        } else {
          this.$message.info("搜索失败，请检查用户昵称是否存在");
        }
      }
      console.log(result);
      this.searchInfo = result;
    },
  },
};
</script>

<style lang="less" scoped>
.list-content-item {
  color: @text-color-second;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-right: 40px;
  width: 150px;
  span {
    line-height: 20px;
  }
  p {
    margin: 4px 0 0;
    line-height: 22px;
  }
}
.ant-card {
  margin: 0 !important;
}
</style>
