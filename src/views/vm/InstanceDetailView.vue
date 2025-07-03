<template>
  <div class="instance-detail-view">
    <a-page-header
      :title="
        isLoading ? t('message.vm.instance.loading') : instanceDetails.name
      "
      @back="() => $router.go(-1)"
    >
      <template #breadcrumb>
        <a-breadcrumb>
          <a-breadcrumb-item>Server</a-breadcrumb-item>
          <a-breadcrumb-item>Instance</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <template #extra>
        <a-button key="edit" type="primary">{{
          t("message.vm.instance.button-edit")
        }}</a-button>
        <a-button key="delete" danger @click="showDeleteModal = true">{{
          t("message.vm.instance.button-delete")
        }}</a-button>
      </template>
    </a-page-header>
    <div class="detail-content-wrapper">
      <VmInstanceDetails
        :instanceDetails="instanceDetails"
        :class="{ loading: isLoading }"
      />
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      v-model:open="showDeleteModal"
      :instance-name="instanceDetails.name"
      :loading="deleteLoading"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
/* ==========================================================================
   Imports
   ========================================================================== */
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { VmInstance } from "@/types/vm";
import { getVmApi } from "@/api/vm";
import type { VmDeleteApiResponse } from "@/api/vm/dto";
import { VmInstanceDetails, DeleteConfirmModal } from "@/components/vm";

/* ==========================================================================
   Props
   ========================================================================== */
interface InstanceDetailProps {
  instanceId: string;
}
const props = defineProps<InstanceDetailProps>();

/* ==========================================================================
   Composables
   ========================================================================== */
const { t } = useI18n();
const router = useRouter();

/* ==========================================================================
   Reactive State
   ========================================================================== */
/* VM 인스턴스 정보를 관리하는 반응형 객체 */
const instanceDetails = ref<VmInstance>(
  new VmInstance({
    name: "",
    id: props.instanceId,
    powerState: "NOSTATE",
    alias: "",
    host: "",
  })
);

/* 로딩 상태 관리 */
const isLoading = ref(true);

/* 삭제 모달 및 로딩 상태 관리 */
const showDeleteModal = ref(false);
const deleteLoading = ref(false);

/* ==========================================================================
   API Functions
   ========================================================================== */
/* 서버에서 인스턴스 데이터를 가져와서 화면에 반영 */
const loadInstanceData = async () => {
  try {
    const vmApi = await getVmApi();
    const apiData = await vmApi.getInstance(props.instanceId);
    instanceDetails.value = new VmInstance({
      name: apiData.name,
      id: apiData.id.toString(),
      powerState: apiData.powerStatus,
      alias: apiData.alias,
      host: apiData.host,
    });
  } catch (error) {
    console.error("Failed to load instance data:", error);
  } finally {
    isLoading.value = false;
  }
};

/* ==========================================================================
   Lifecycle Hooks
   ========================================================================== */
/* VM 인스턴스 삭제 처리 */
const handleDelete = async () => {
  try {
    deleteLoading.value = true;
    const vmApi = await getVmApi();
    const result: VmDeleteApiResponse = await vmApi.deleteInstance(props.instanceId);

    if (result.isDeleted && result.isAccepted) {
      message.success(
        t("message.vm.instance.delete-success", {
          name: instanceDetails.value.name,
        })
      );
      // 삭제 성공 후 메인 페이지로 이동
      await router.push("/main");
    } else {
      message.error(t("message.vm.instance.delete-failed"));
    }
  } catch (error) {
    message.error(t("message.vm.instance.delete-error"));
    console.error("Failed to delete instance:", error);
  } finally {
    deleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

/* ==========================================================================
   Lifecycle Hooks
   ========================================================================== */
/* 컴포넌트 마운트 시 인스턴스 데이터 로드 */
onMounted(() => {
  loadInstanceData();
});
</script>

<style scoped>
/* ==========================================================================
   Instance Detail View - Main Layout
   ========================================================================== */

/* 최상위 컨테이너 - AppHeader 하위에 위치하는 메인 컨텐츠 영역 */
.instance-detail-view {
  min-height: calc(100vh - 64px); /* AppHeader 높이(64px) 제외 */
  background-color: #f5f5f5; /* 전체 배경색 */
  display: flex;
  flex-direction: column;
}

/* ==========================================================================
   Page Header Customization
   ========================================================================== */

/* Ant Design PageHeader 여백 조정 - 하단 패딩 제거로 컨텐츠와 간격 최소화 */
.ant-page-header {
  padding: 16px 24px 0; /* 상단/좌우 여백 유지, 하단 제거 */
  background-color: white; /* 헤더 배경색 */
}

/* 탭 네비게이션 스타일 초기화 (현재 미사용이지만 향후 확장 고려) */
.ant-page-header-footer .ant-tabs-nav {
  margin: 0;
  border-bottom: none;
}

.ant-page-header-footer .ant-tabs-nav::before {
  display: none; /* 기본 하단 테두리 제거 */
}

/* ==========================================================================
   Content Area Layout
   ========================================================================== */

/* 메인 컨텐츠 래퍼 - 페이지 헤더 하위의 실제 내용 영역 */
.detail-content-wrapper {
  padding: 24px; /* 내부 여백 */
  background-color: white; /* 컨텐츠 배경색 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  flex: 1 1 auto;
  overflow: auto;
}

/* ==========================================================================
   Detail Section Styling
   ========================================================================== */

/* 로딩 상태 스타일 */
.loading {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
</style>
