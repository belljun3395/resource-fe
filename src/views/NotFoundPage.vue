<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <div class="error-title">페이지를 찾을 수 없습니다</div>
      <div class="error-description">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </div>
      <div class="action-buttons">
        <a-button type="primary" size="large" @click="goHome">
          홈으로 돌아가기
        </a-button>
        <a-button size="large" @click="goBack">
          이전 페이지로
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/servers/instances");
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 50px);
  background-color: #f5f5f5;
  padding: 20px;
}

.not-found-container {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.error-description {
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 40px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .ant-btn {
    width: 200px;
  }
}
</style>
