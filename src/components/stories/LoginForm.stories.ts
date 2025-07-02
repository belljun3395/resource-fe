// @ts-nocheck
import LoginForm from "@/components/LoginForm.vue";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales/index";

const i18n = createI18n({
  locale: "ko",
  fallbackLocale: "en",
  messages,
});

export default {
  title: "Components/LoginForm",
  component: LoginForm,
};

const Template = (args: any) => ({
  components: { LoginForm },
  setup() {
    const onLogin =
      args.onLogin ||
      (() => {
        if (typeof args.loading === "boolean") {
          args.loading = true;
          setTimeout(() => {
            args.loading = false;
          }, 500);
        }
      });
    return { args, onLogin };
  },
  mounted() {
    // Loading 스토리에서만 샘플 데이터 채우기
    if (args.fillSampleData) {
      setTimeout(() => {
        const emailInput = this.$el.querySelector('input[type="email"]');
        const nameInput = this.$el.querySelector('input[type="text"]');
        if (emailInput) {
          emailInput.value = "admin@company.com";
          emailInput.dispatchEvent(new Event('input'));
        }
        if (nameInput) {
          nameInput.value = "관리자";
          nameInput.dispatchEvent(new Event('input'));
        }
      }, 100);
    }
  },
  template: `
    <div style="padding: 20px; background-color: #f5f5f5; min-height: 100vh;">
      <LoginForm
        v-bind="args"
        @login="onLogin"
      />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  loading: false,
};
Default.decorators = [
  () => ({
    setup() {
      return {};
    },
    template: '<div><story /></div>',
    i18n,
  }),
];

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  fillSampleData: true,
};
Loading.decorators = [
  () => ({
    setup() {
      return {};
    },
    template: '<div><story /></div>',
    i18n,
  }),
];
