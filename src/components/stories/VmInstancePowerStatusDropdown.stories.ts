// @ts-nocheck
import { VmInstancePowerStatusDropdown } from "@/components/vm";
import { PowerStatus } from "@/types/vm";
import { createI18n } from "vue-i18n";
import { messages } from "@/locales";
import Antd from "ant-design-vue";

const i18n = createI18n({
  legacy: false,
  locale: "ko",
  fallbackLocale: "en",
  messages,
});

export default {
  title: "Components/VM/VmInstancePowerStatusDropdown",
  component: VmInstancePowerStatusDropdown,
  argTypes: {
    powerState: {
      control: { type: "select" },
      options: Object.keys(PowerStatus).filter((key) => isNaN(Number(key))),
    },
    instanceId: {
      control: { type: "text" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown component for controlling VM instance power states.",
      },
    },
  },
};

const Template = (args: any) => ({
  components: { VmInstancePowerStatusDropdown },
  setup() {
    const handlePowerStatusChange = (action: string) => {
      console.log("Power status change:", action);
    };

    return {
      args,
      handlePowerStatusChange,
    };
  },
  template: `
    <div style="padding: 20px; background-color: #f5f5f5;">
      <VmInstancePowerStatusDropdown 
        v-bind="args" 
        @powerStatusChange="handlePowerStatusChange"
      />
    </div>
  `,
  global: {
    plugins: [i18n, Antd],
  },
});

// Running instance - Start button disabled
export const Running = Template.bind({});
Running.args = {
  powerState: PowerStatus[PowerStatus.RUNNING],
  instanceId: "vm-001",
};
Running.parameters = {
  docs: {
    description: {
      story: "Instance is currently running. Start action is disabled.",
    },
  },
};

// Shutdown instance - Shutdown button disabled
export const Shutdown = Template.bind({});
Shutdown.args = {
  powerState: PowerStatus[PowerStatus.SHUTDOWN],
  instanceId: "vm-002",
};
Shutdown.parameters = {
  docs: {
    description: {
      story: "Instance is shutdown. Shutdown action is disabled.",
    },
  },
};

// Paused instance - Reboot and pause buttons disabled
export const Paused = Template.bind({});
Paused.args = {
  powerState: PowerStatus[PowerStatus.PAUSED],
  instanceId: "vm-003",
};
Paused.parameters = {
  docs: {
    description: {
      story: "Instance is paused. Reboot and pause actions are disabled.",
    },
  },
};

// Crashed instance - Reboot and pause buttons disabled
export const Crashed = Template.bind({});
Crashed.args = {
  powerState: PowerStatus[PowerStatus.CRASHED],
  instanceId: "vm-004",
};
Crashed.parameters = {
  docs: {
    description: {
      story: "Instance has crashed. Reboot and pause actions are disabled.",
    },
  },
};

// No state instance - Reboot and pause buttons disabled
export const NoState = Template.bind({});
NoState.args = {
  powerState: PowerStatus[PowerStatus.NOSTATE],
  instanceId: "vm-005",
};
NoState.parameters = {
  docs: {
    description: {
      story:
        "Instance has no defined state. Reboot and pause actions are disabled.",
    },
  },
};

// Suspended instance - Reboot and pause buttons disabled
export const Suspended = Template.bind({});
Suspended.args = {
  powerState: PowerStatus[PowerStatus.SUSPEN],
  instanceId: "vm-006",
};
Suspended.parameters = {
  docs: {
    description: {
      story: "Instance is suspended. Reboot and pause actions are disabled.",
    },
  },
};
