<template>
  <div class="['upload-container','clearfix']">
    <a-upload
      :action="action"
      :headers="headers"
      list-type="picture-card"
      :multiple="true"
      :before-upload="beforeUpload"
      :remove="onRemove"
      @change="handleChange"
      @preview="handlePreview"
      :showUploadList="false"
    >
      <div>
        <a-icon type="plus" />
        <div class="ant-upload-text">上传图片</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { checkAuthorization } from "@/utils/request.js";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  data() {
    return {
      action: `https://www.mocky.io/v2/5cc8019d300000980a055e76`,
      previewVisible: false,
      previewImage: "",
    };
  },
  computed: {
    headers() {
      return {
        Authorization: checkAuthorization(`bearer`),
      };
    },
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ file }) {
      if (file && file.status === "done") {
        // this.fileList.push(file.response);
        // console.log(file);
        this.$emit("handleChange", file.response);
      } else if (file.status === "error") {
        this.$message.error(file.name + "图片上传失败!");
      }
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const isJPG = file.name.endsWith(".jpg");
        const isJPEG = file.name.endsWith(".jpeg");
        const isPNG = file.name.endsWith(".png");
        if (!(isJPG || isJPEG || isPNG)) {
          this.$message.error("只能上传.jpg/.jpeg/.png格式的文件");
          return reject(false);
        }
        return resolve(true);
      });
    },
    onRemove() {
      this.$message.success("图片删除成功");
      this.$emit("onRemove");
    },
  },
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>