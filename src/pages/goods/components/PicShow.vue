<template>
  <a-modal
    title="全部图片"
    :visible="visible"
    :picList="picList"
    @ok="handleUpdate"
    @cancel="handleCancel"
    footer=""
  >
    <div>
      <img
        v-for="(item, index) in picList"
        :src="item.url || item.thumbUrl"
        :key="index"
        style="width: 190px; height: 150px; margin: 10px"
      />
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    picList: Array,
  },
  data() {
    return {
      confirmLoading: false,
    };
  },
  methods: {
    handleUpdate() {
      this.$emit("closePicModal");
    },
    handleCancel() {
      this.$emit("closePicModal");
    },
  },
};
</script>