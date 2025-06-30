// @ts-nocheck
import AppHeader from "@/components/AppHeader.vue";

export default {
  title: "Components/AppHeader",
  component: AppHeader,
};

const Template = (args: any) => ({
  components: { AppHeader },
  setup() {
    return { args };
  },
  template: `
    <div id="wrap">
      <AppHeader v-bind="args" />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  isLogin: false,
  username: "",
  email: "",
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  username: "홍길동",
  email: "hong@example.com",
  isLogin: true,
};
