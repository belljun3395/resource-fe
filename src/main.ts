import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import App from "./App.vue";
import router from "./router";
import { messages } from "./locales";

const app = createApp(App);
const pinia = createPinia();

const i18n = createI18n({
  legacy: false,
  locale: "ko",
  fallbackLocale: "en",
  messages,
});

app.use(pinia);
app.use(i18n);
app.use(Antd);
app.use(router);

app.mount("#root");
