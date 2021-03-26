<template>
  <colorPicker v-model="color" v-on:change="headleChangeColor()" />
</template>
<script>
export default {
  name: "colorPicker",
  data() {
    return {
      color: "#ff0000",
    };
  },
  methods: {
    headleChangeColor() {
      console.log(this.color);
      this.$emit("ChangeColor", this.color);
    },
  },
};
</script>