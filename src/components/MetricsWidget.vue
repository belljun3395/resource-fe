<template>
  <div class="metrics-widget">
    <div class="metrics-header">
      <h3>시스템 메트릭</h3>
      <button @click="refreshMetrics" :disabled="isLoading" class="refresh-btn">
        {{ isLoading ? "로딩중..." : "새로고침" }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="!isLoading && metrics" class="metrics-content">
      <div class="metrics-grid">
        <div class="metric-card" v-if="metrics.performance">
          <h4>성능</h4>
          <div class="metric-value">
            {{ metrics.performance.avgResponseTime?.toFixed(1) }}ms
          </div>
          <div class="metric-label">평균 응답시간</div>
        </div>

        <div class="metric-card" v-if="metrics.usage">
          <h4>사용량</h4>
          <div class="metric-value">
            {{ metrics.usage.totalConversations }}
          </div>
          <div class="metric-label">총 대화수</div>
        </div>

        <div class="metric-card" v-if="metrics.quality">
          <h4>품질</h4>
          <div class="metric-value">
            {{ metrics.quality.avgQualityScore?.toFixed(1) }}
          </div>
          <div class="metric-label">평균 품질점수</div>
        </div>
      </div>

      <div
        v-if="metrics.insights && metrics.insights.length > 0"
        class="insights-section"
      >
        <h4>인사이트</h4>
        <div class="insights-list">
          <div
            v-for="insight in metrics.insights.slice(0, 3)"
            :key="insight.title"
            class="insight-item"
            :class="insight.severity"
          >
            <div class="insight-title">{{ insight.title }}</div>
            <div class="insight-description">{{ insight.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isLoading" class="loading">메트릭을 불러오는 중...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  chatService,
  type MetricsAnalysisResponse,
} from "@/services/chatService";

const metrics = ref<MetricsAnalysisResponse | null>(null);
const isLoading = ref(false);
const error = ref("");

const refreshMetrics = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const data = await chatService.getDashboard();
    metrics.value = data;
  } catch (err) {
    error.value = "메트릭을 불러오는데 실패했습니다.";
    console.error("Metrics error:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  refreshMetrics();
});
</script>

<style scoped>
.metrics-widget {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 16px 0;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.metrics-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.refresh-btn {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.refresh-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.error-message {
  color: #ff4d4f;
  text-align: center;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  text-align: center;
}

.metric-card h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #888;
}

.insights-section {
  border-top: 1px solid #e8e8e8;
  padding-top: 16px;
}

.insights-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid;
}

.insight-item.info {
  background: #e6f7ff;
  border-left-color: #1890ff;
}

.insight-item.warning {
  background: #fff7e6;
  border-left-color: #fa8c16;
}

.insight-item.critical {
  background: #fff1f0;
  border-left-color: #ff4d4f;
}

.insight-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.insight-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}
</style>
