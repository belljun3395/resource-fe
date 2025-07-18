<template>
  <div class="instance-list-view">
    <a-page-header class="instance-page-header">
      <template #breadcrumb>
        <a-breadcrumb>
          <a-breadcrumb-item>{{
            t("message.vm.instance.breadcrumb-server")
          }}</a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link to="/servers/instances">{{
              t("message.vm.instance.breadcrumb-instance")
            }}</router-link>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </template>

      <template #title>
        <div class="page-title-section">
          <h1 class="page-title">{{ t("message.vm.instance.page-title") }}</h1>
          <span class="page-subtitle">{{
            t("message.vm.instance.page-subtitle-count", { count: totalCount })
          }}</span>
        </div>
      </template>

      <template #extra>
        <a-button type="text" size="large" @click="onRefresh">
          <ReloadOutlined />
        </a-button>
        <a-button type="primary" size="large" @click="onCreateInstance">
          {{ t("message.vm.instance.button-create") }}
        </a-button>
      </template>
    </a-page-header>

    <div class="list-content-wrapper">
      <div class="table-container">
        <VmListTable :data-source="vmInstances" :loading="isLoading" />

        <div class="pagination-container">
          <a-pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="totalCount"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :show-total="showTotal"
            :page-size-options="pageSizeOptions"
            @change="onPageChange"
            @show-size-change="onPageSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ==========================================================================
   Imports
   ========================================================================== */
import { ref, computed, onMounted } from "vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { VmInstanceList } from "@/types/vm";
import { createVmInstanceFromListApi } from "@/types/vm.converter";
import type { VmListRequest } from "@/api/vm/dto";
import { getVmApi } from "@/api/vm";
import VmListTable from "@/components/vm/VmListTable.vue";

/* ==========================================================================
   Composables
   ========================================================================== */
const { t } = useI18n();
const router = useRouter();

/* ==========================================================================
   Reactive State
   ========================================================================== */
const vmInstances = ref<VmInstanceList[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(0);

/* ==========================================================================
   Computed Properties
   ========================================================================== */
// TODO: refactor to const.ts
const pageSizeOptions = computed(() => ["10", "20", "50", "100"]);

/* ==========================================================================
   Utility Functions
   ========================================================================== */
const showTotal = (total: number, range: [number, number]) => {
  return t("message.vm.instance.pagination-total", {
    start: range[0],
    end: range[1],
    total: total,
  });
};

/* ==========================================================================
   API Functions
   ========================================================================== */
const loadVmInstances = async () => {
  try {
    isLoading.value = true;

    const requestParams: VmListRequest = {
      page: currentPage.value - 1,
      size: pageSize.value,
    };

    const vmApi = await getVmApi();
    const response = await vmApi.getInstanceList(requestParams);

    vmInstances.value = response.data.map(createVmInstanceFromListApi);

    totalCount.value = response.totalCount;
    totalPages.value = response.totalPageCount;
  } catch (error) {
    console.error("Failed to load VM instances:", error);
    message.error(t("message.vm.instance.message-load-error"));
  } finally {
    isLoading.value = false;
  }
};

/* ==========================================================================
   Event Handlers
   ========================================================================== */

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadVmInstances();
};

const onPageSizeChange = (_current: number, size: number) => {
  currentPage.value = 1;
  pageSize.value = size;
  loadVmInstances();
};

const onRefresh = () => {
  loadVmInstances();
};

const onCreateInstance = () => {
  router.push("/servers/instances/create");
};

/* ==========================================================================
   Lifecycle Hooks
   ========================================================================== */
onMounted(() => {
  loadVmInstances();
});
</script>

<style scoped>
/* ==========================================================================
   Instance List View - Main Layout
   ========================================================================== */
.instance-list-view {
  min-height: calc(100vh - 64px);
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* ==========================================================================
   Page Header Customization
   ========================================================================== */
.instance-page-header {
  padding: 20px 24px 16px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.instance-page-header :deep(.ant-page-header-heading) {
  padding-bottom: 0;
}

.instance-page-header :deep(.ant-page-header-content) {
  padding-top: 0;
}

.page-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 400;
}

.instance-page-header :deep(.ant-page-header-heading-extra) {
  margin-top: 0;
}

.instance-page-header :deep(.ant-breadcrumb) {
  margin-bottom: 12px;
}

.instance-page-header :deep(.ant-breadcrumb-link) {
  color: #595959;
  font-size: 13px;
}

/* ==========================================================================
   Content Area Layout
   ========================================================================== */
.list-content-wrapper {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ==========================================================================
   Responsive Design
   ========================================================================== */
@media (max-width: 768px) {
  .list-content-wrapper {
    padding: 16px;
    gap: 12px;
  }

  .instance-page-header {
    padding: 16px 16px 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .pagination-container {
    padding: 12px;
  }
}

@media (max-width: 576px) {
  .list-content-wrapper {
    padding: 12px;
  }

  .instance-page-header {
    padding: 12px 12px 8px;
  }

  .page-title {
    font-size: 18px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .pagination-container {
    padding: 8px;
  }

  .instance-page-header :deep(.ant-page-header-heading) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
