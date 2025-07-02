<template>
  <div class="detail-section">
    <a-descriptions :column="1" bordered>
      <a-descriptions-item :label="t('message.vm.instance.label-name')">{{
        instanceDetails.name
      }}</a-descriptions-item>
      <a-descriptions-item :label="t('message.vm.instance.label-id')">
        {{ instanceDetails.id }}
        <a-button
          type="text"
          size="small"
          class="copy-btn"
          @click="
            copyToClipboard(
              instanceDetails.id,
              t('message.vm.instance.label-id')
            )
          "
        >
          <CopyOutlined />
        </a-button>
      </a-descriptions-item>
      <a-descriptions-item :label="t('message.vm.instance.label-power-state')">
        <a-tag color="green">{{ instanceDetails.powerState }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item :label="t('message.vm.instance.label-alias')">
        {{ instanceDetails.alias }}
        <a-button
          type="text"
          size="small"
          class="copy-btn"
          @click="
            copyToClipboard(
              instanceDetails.alias,
              t('message.vm.instance.label-alias')
            )
          "
        >
          <CopyOutlined />
        </a-button>
      </a-descriptions-item>
      <a-descriptions-item :label="t('message.vm.instance.label-host')">{{
        instanceDetails.host
      }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script setup lang="ts">
/* ==========================================================================
   Imports
   ========================================================================== */
import { CopyOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import type { VmInstance } from "@/types/vm";

/* ==========================================================================
   Props
   ========================================================================== */
interface VmInstanceDetailsProps {
  instanceDetails: VmInstance;
}
defineProps<VmInstanceDetailsProps>();

/* ==========================================================================
   I18n
   ========================================================================== */
const { t } = useI18n();

/* ==========================================================================
   Message Configuration
   ========================================================================== */
/* 메시지 설정 - 겹치지 않도록 최대 1개만 표시 */
message.config({
  maxCount: 1,
  duration: 2,
});

/* ==========================================================================
   Utility Functions
   ========================================================================== */
/* 텍스트를 클립보드에 복사하는 함수 */
const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success({
        content: t("message.vm.instance.copy-success", { label }),
        style: {
          marginTop: "100px",
        },
      });
    })
    .catch((err) => {
      message.error({
        content: t("message.vm.instance.copy-error", { error: err }),
        style: {
          marginTop: "100px",
        },
      });
    });
};
</script>

<style scoped>
/* ==========================================================================
   Detail Section Styling
   ========================================================================== */

/* 개별 섹션 컨테이너 */
.detail-section {
  margin-bottom: 32px; /* 섹션 간 여백 */
}

/* 마지막 섹션은 하단 여백 제거 */
.detail-section:last-child {
  margin-bottom: 0;
}

/* ==========================================================================
   Descriptions Component Customization
   ========================================================================== */

/* 라벨 영역 스타일 - 좌측 컬럼 */
:deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
  width: 20% !important;
  background-color: #fafafa !important;
  font-weight: 500 !important;
  color: rgba(0, 0, 0, 0.85) !important;
  padding: 12px 16px !important;
}

/* 값 영역 스타일 - 우측 컬럼 */
:deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  width: 80% !important;
  padding: 12px 16px !important;
  display: flex !important;
  align-items: center !important;
  background-color: white !important;
}

/* ==========================================================================
   Copy Button Styling
   ========================================================================== */

/* 복사 버튼 기본 스타일 */
.copy-btn {
  margin-left: 8px; /* 텍스트와의 간격 */
  padding: 4px; /* 내부 여백 */
  width: 24px; /* 버튼 너비 */
  height: 24px; /* 버튼 높이 */
  min-width: 24px; /* 최소 너비 */
  border: none; /* 테두리 제거 */
  box-shadow: none; /* 그림자 제거 */
  border-radius: 4px; /* 모서리 둥글게 */
  display: inline-flex; /* 인라인 플렉스 */
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  transition: all 0.2s ease; /* 부드러운 전환 효과 */
}

/* 복사 버튼 호버 스타일 */
.copy-btn:hover {
  background-color: #f0f0f0; /* 호버 배경색 */
  transform: scale(1.1); /* 약간 확대 */
}

/* 복사 버튼 아이콘 스타일 */
.copy-btn .anticon {
  font-size: 14px; /* 아이콘 크기 */
  color: #1890ff; /* 아이콘 색상 */
}

/* 복사 버튼 포커스 스타일 (접근성) */
.copy-btn:focus {
  outline: 2px solid #1890ff; /* 포커스 테두리 */
  outline-offset: 2px; /* 테두리 간격 */
}
</style>
