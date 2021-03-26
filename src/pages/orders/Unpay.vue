<template>
  <div>
    <img-upload :file-list="fileList" @change="handleChange" />
  </div>
</template>

<script>
import ImgUpload from "../components/ImgUpload/index";
export default {
  data() {
    return {
      fileList: [
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
        {
          uid: "-4",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
        {
          uid: "-5",
          name: "image.png",
          status: "error",
        },
      ],
    };
  },
  components: {
    ImgUpload,
  },
  methods: {
    handleChange() {
      console.log(111);
    },
  },
};
</script>