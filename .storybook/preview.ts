// @ts-nocheck
import type { Preview } from "@storybook/vue3-vite";
import { setup } from "@storybook/vue3-vite";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createI18n } from "vue-i18n";
import { messages } from "../src/locales";

setup((app) => {
  const i18n = createI18n({
    legacy: false,
    locale: "ko",
    fallbackLocale: "en",
    messages,
  });
  app.use(i18n);
  app.use(Antd);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: "<story />",
    }),
  ],
};

export default preview;
