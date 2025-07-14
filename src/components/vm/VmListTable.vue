<template>
  <div class="vm-list-table">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      :row-key="(record: VmInstanceList) => record.id"
      :scroll="{ x: 1200 }"
      size="middle"
      :custom-row="customRow"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'powerState'">
          <a-tag :color="getPowerStatusColor(record.powerState)">
            {{ record.powerState }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'flavor'">
          <div class="flavor-info">
            <div class="flavor-name">{{ record.flavor?.name }}</div>
            <div class="flavor-description">
              {{ record.flavor?.description }}
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
/* ==========================================================================
   Imports
   ========================================================================== */
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { TableColumnType } from "ant-design-vue";
import { getPowerStatusColor } from "@/types/vm.converter";
import type { VmInstanceList } from "@/types/vm";

/* ==========================================================================
   Props
   ========================================================================== */
interface VmListTableProps {
  dataSource: VmInstanceList[];
  loading?: boolean;
}

withDefaults(defineProps<VmListTableProps>(), {
  loading: false,
});

/* ==========================================================================
   Composables
   ========================================================================== */
const router = useRouter();
const { t } = useI18n();

/* ==========================================================================
   Table Configuration
   ========================================================================== */
const columns = computed<TableColumnType[]>(() => [
  {
    title: t("message.vm.instance.table-header-id"),
    dataIndex: "id",
    key: "id",
    width: 80,
    fixed: "left",
  },
  {
    title: t("message.vm.instance.table-header-name"),
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: t("message.vm.instance.table-header-description"),
    dataIndex: "description",
    key: "description",
    width: 200,
  },
  {
    title: t("message.vm.instance.table-header-alias"),
    dataIndex: "alias",
    key: "alias",
    width: 150,
  },
  {
    title: t("message.vm.instance.table-header-power-state"),
    dataIndex: "powerState",
    key: "powerState",
    width: 120,
    align: "center",
  },
  {
    title: t("message.vm.instance.table-header-host"),
    dataIndex: "host",
    key: "host",
    width: 150,
  },
  {
    title: t("message.vm.instance.table-header-source"),
    dataIndex: "source",
    key: "source",
    width: 150,
    customRender: ({ record }) => record.source?.name || "-",
  },
  {
    title: t("message.vm.instance.table-header-flavor"),
    dataIndex: "flavor",
    key: "flavor",
    width: 200,
  },
]);

/* ==========================================================================
   Event Handlers
   ========================================================================== */
const onRowClick = (record: VmInstanceList) => {
  router.push(`/servers/instances/${record.id}`);
};

const customRow = (record: VmInstanceList) => {
  return {
    onClick: () => onRowClick(record),
    style: { cursor: "pointer" },
  };
};
</script>

<style scoped>
/* ==========================================================================
   VM List Table Styles
   ========================================================================== */
.vm-list-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.vm-list-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 600;
}

.vm-list-table :deep(.ant-table-tbody > tr) {
  cursor: pointer;
  transition: background-color 0.2s;
}

.vm-list-table :deep(.ant-table-tbody > tr:hover) {
  background-color: #f5f5f5;
}

.vm-list-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.flavor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.flavor-name {
  font-weight: 500;
  color: #262626;
}

.flavor-description {
  font-size: 12px;
  color: #8c8c8c;
}

/* ==========================================================================
   Responsive Design
   ========================================================================== */
@media (max-width: 768px) {
  .vm-list-table :deep(.ant-table-tbody > tr > td) {
    padding: 8px 12px;
    font-size: 14px;
  }

  .flavor-info {
    gap: 1px;
  }

  .flavor-name {
    font-size: 13px;
  }

  .flavor-description {
    font-size: 11px;
  }
}
</style>
