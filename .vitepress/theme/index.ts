// https://vitepress.dev/guide/custom-theme
import DefaultTheme from "vitepress/theme";
import "./custom.css";
import "./style.css";
import LightBoxImg from "../components/LightBoxImg.vue";

const theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    ctx.app.component("LightBoxImg", LightBoxImg);
  },
};

export default theme;
