<template>
  <div class="gallery">
    <p>
      <img
        :src="src"
        :alt="alt"
        :title="title"
        :width="width"
        :height="height"
        @click="showImage"
      />
      <vue-easy-lightbox
        :visible="visible"
        :imgs="[src]"
        :index="0"
        :moveDisabled="false"
        :zoomScale="0"
        :loop="false"
        @hide="onHide"
      />
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";

interface Props {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  zoomScale?: number;
  cursor?: string;
  objectFit?: string;
  style?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: "",
  title: "",
  zoomScale: 0,
  cursor: "pointer",
  objectFit: "contain",
});

const visible = ref(false);

const showImage = () => {
  visible.value = true;
};

const onHide = () => {
  visible.value = false;
};
</script>

<style scoped>
.gallery {
  cursor: pointer;
  position: relative;
  margin: 0;
  padding: 0;
}

.gallery::before {
  content: "+ 확대";
  position: absolute;
  z-index: 1000;
  bottom: 0;
  right: 0;
  transform: translate(-50%, -50%);
  background-color: #4e4e4ec9;
  color: #fff;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 13px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

.gallery:hover::before {
  opacity: 1;
  visibility: visible;
}

.gallery::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(50, 50, 55, 0.25);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
  pointer-events: none;
}

.gallery:hover::after {
  opacity: 1;
}

.gallery img {
  transition: transform 0.3s ease;
  border: 1px solid #ddd;
  border-radius: 16px;
  background-color: #f9f9f9;
  padding: 12px;
  width: 100%;
  height: 100%;
}
</style>
