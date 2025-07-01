// @ts-nocheck
import LoginForm from "@/components/LoginForm.vue";
import { messages } from "@/locales/index";
import type { LoginMsg } from "@/types/message/loginMsg";

export default {
  title: "Components/LoginForm",
  component: LoginForm,
};

const koLoginMsg = messages.ko.message.login;
const enLoginMsg = messages.en.message.login;

const koLoginMsgObj: LoginMsg = {
  "error-email-required": koLoginMsg["error-email-required"],
  "error-email-invalid": koLoginMsg["error-email-invalid"],
  "error-name-required": koLoginMsg["error-name-required"],
  "error-name-min": koLoginMsg["error-name-min"],
  "error-name-special": koLoginMsg["error-name-special"],
};

const enLoginMsgObj: LoginMsg = {
  "error-email-required": enLoginMsg["error-email-required"],
  "error-email-invalid": enLoginMsg["error-email-invalid"],
  "error-name-required": enLoginMsg["error-name-required"],
  "error-name-min": enLoginMsg["error-name-min"],
  "error-name-special": enLoginMsg["error-name-special"],
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
  formTitle: koLoginMsg["form-title"],
  emailPlaceholder: koLoginMsg["input-email"],
  namePlaceholder: koLoginMsg["input-name"],
  buttonLoadingText: koLoginMsg["button-loading"],
  buttonLoginText: koLoginMsg["button-login"],
  loading: false,
  loginMsg: koLoginMsgObj,
};

export const Loading = Template.bind({});
Loading.args = {
  formTitle: koLoginMsg["form-title"],
  emailPlaceholder: koLoginMsg["input-email"],
  namePlaceholder: koLoginMsg["input-name"],
  buttonLoadingText: koLoginMsg["button-loading"],
  buttonLoginText: koLoginMsg["button-login"],
  loading: true,
  loginMsg: koLoginMsgObj,
};
