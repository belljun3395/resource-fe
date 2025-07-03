<template>
  <!-- VM 인스턴스 삭제 확인 모달 컴포넌트 -->
  <a-modal
    v-model:open="isVisible"
    :title="t('message.vm.instance.delete-confirm-title')"
    :confirm-loading="loading"
    :ok-text="t('message.vm.instance.delete-ok')"
    :cancel-text="t('message.vm.instance.delete-cancel')"
    ok-type="danger"
    :keyboard="true"
    :mask-closable="true"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <!-- 삭제 확인 메시지 - 인스턴스 이름을 포함한 동적 메시지 -->
    <p>
      {{
        t("message.vm.instance.delete-confirm-message", { name: instanceName })
      }}
    </p>
    <!-- 삭제 경고 메시지 - 사용자에게 위험성을 알리는 텍스트 -->
    <p class="delete-warning">{{ t("message.vm.instance.delete-warning") }}</p>
  </a-modal>
</template>

<script setup lang="ts">
/* ==========================================================================
   VM 인스턴스 삭제 확인 모달 컴포넌트
   ========================================================================== */

/* ==========================================================================
   Imports
   ========================================================================== */
import { computed } from "vue";
import { useI18n } from "vue-i18n";

/* ==========================================================================
   Component Props Interface
   ========================================================================== */
/* 부모 컴포넌트로부터 받는 props 정의 */
interface DeleteConfirmModalProps {
  open: boolean; // 모달 표시 여부 - v-model:open으로 양방향 바인딩
  instanceName: string; // 삭제할 인스턴스 이름 - 확인 메시지에 표시
  loading?: boolean; // 삭제 진행 중 로딩 상태 - 확인 버튼 로딩 표시
}

/* ==========================================================================
   Component Emits Interface
   ========================================================================== */
/* 부모 컴포넌트로 전달하는 이벤트 정의 */
interface DeleteConfirmModalEmits {
  (e: "update:open", value: boolean): void; // v-model:open 양방향 바인딩용 이벤트
  (e: "confirm"): void; // 삭제 확인 버튼 클릭 시 발생
  (e: "cancel"): void; // 취소 버튼 클릭 시 발생
}

/* ==========================================================================
   Props & Emits Setup
   ========================================================================== */
/* props 기본값 설정 - loading은 선택적이므로 기본값 false */
const props = withDefaults(defineProps<DeleteConfirmModalProps>(), {
  loading: false,
});

/* 이벤트 emit 함수 설정 */
const emit = defineEmits<DeleteConfirmModalEmits>();

/* ==========================================================================
   Composables
   ========================================================================== */
/* 다국어 지원을 위한 i18n 설정 */
const { t } = useI18n();

/* ==========================================================================
   Computed Properties
   ========================================================================== */
/* 모달 표시 상태 관리를 위한 computed property */
/* v-model:open 양방향 바인딩을 지원하기 위해 getter/setter 패턴 사용 */
const isVisible = computed({
  get: () => props.open, // 부모의 open prop 값을 반환
  set: (value: boolean) => emit("update:open", value), // 값 변경 시 부모에게 이벤트 전달
});

/* ==========================================================================
   Event Handlers
   ========================================================================== */
/* 삭제 확인 버튼 클릭 핸들러 */
const handleConfirm = () => {
  emit("confirm"); // 부모 컴포넌트의 삭제 로직 실행을 위한 이벤트 발생
};

/* 취소 버튼 클릭 핸들러 */
const handleCancel = () => {
  emit("cancel"); // 취소 이벤트 발생 (부모에서 추가 로직 필요 시 처리)
  emit("update:open", false); // 모달 닫기 위한 상태 업데이트
};
</script>

<style scoped>
/* ==========================================================================
   Delete Confirmation Modal Styling
   ========================================================================== */

/* 삭제 경고 메시지 스타일 - 사용자의 주의를 끌기 위한 위험 색상 사용 */
.delete-warning {
  color: #ff4d4f; /* Ant Design 위험 색상 (빨간색) */
  font-weight: 500; /* 중간 굵기로 강조 */
  margin-top: 8px; /* 위쪽 여백으로 일반 메시지와 구분 */
  font-size: 14px; /* 가독성을 위한 적절한 폰트 크기 */
}
</style>
