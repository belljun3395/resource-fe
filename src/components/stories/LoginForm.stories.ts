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
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};
