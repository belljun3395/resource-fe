// @ts-nocheck
import LoginForm from "@/components/LoginForm.vue";

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
  template: `
    <LoginForm
      v-bind="args"
      @login="onLogin"
    />
  `,
});

export const Default = Template.bind({});
Default.args = {
  formTitle: "로그인",
  emailPlaceholder: "이메일을 입력하세요",
  namePlaceholder: "이름을 입력하세요",
  buttonLoadingText: "로그인 중...",
  buttonLoginText: "로그인",
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  formTitle: "로그인",
  emailPlaceholder: "이메일을 입력하세요",
  namePlaceholder: "이름을 입력하세요",
  buttonLoadingText: "로그인 중...",
  buttonLoginText: "로그인",
  loading: true,
};
