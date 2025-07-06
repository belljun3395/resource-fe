<template>
  <div class="step-panel">
    <h3>{{ t("message.vm.create.review-title") }}</h3>
    <div class="final-review">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item
          :label="t('message.vm.create.review-instance-name')"
        >
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.review-description')">
          {{
            formData.description || t("message.vm.create.review-no-description")
          }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.review-image')">
          {{ selectedImage?.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.review-flavor')">
          <div v-if="selectedFlavor">
            <div class="flavor-info">
              <div class="flavor-name">{{ selectedFlavor.name }}</div>
              <div class="flavor-specs">
                <a-tag color="blue">{{ selectedFlavor.vcpu }} vCPU</a-tag>
                <a-tag color="green">{{ selectedFlavor.memory }} MB</a-tag>
                <a-tag color="orange">{{ selectedFlavor.rootDisk }} GB</a-tag>
              </div>
              <div class="flavor-description">
                {{ selectedFlavor.description }}
              </div>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>

    <div class="step-actions">
      <a-button @click="$emit('previous')">
        {{ t("message.vm.create.button-previous") }}
      </a-button>
      <a-button type="primary" @click="$emit('create')" :loading="loading">
        {{ t("message.vm.create.button-create") }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { ImageSpec } from "@/types/image";
import type { FlavorSpec } from "@/types/flavor";
import type { VmCreateFormData } from "@/types/vm-form";

interface Props {
  formData: VmCreateFormData;
  images: ImageSpec[];
  flavors: FlavorSpec[];
  loading?: boolean;
}

interface Emits {
  (e: "previous"): void;
  (e: "create"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<Emits>();
const { t } = useI18n();

const selectedImage = computed(() =>
  props.images.find((img) => img.id === props.formData.imageId)
);

const selectedFlavor = computed(() =>
  props.flavors.find((flavor) => flavor.id === props.formData.flavorId)
);
</script>

<style scoped>
.step-panel h3 {
  margin-bottom: 32px;
  color: #262626;
  font-size: 18px;
  font-weight: 500;
}

.step-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.final-review {
  margin-top: 24px;
  padding: 16px;
  border-radius: 6px;
}

.final-review h4 {
  margin-bottom: 16px;
  color: #262626;
}

.flavor-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flavor-info .flavor-name {
  font-weight: 500;
  color: #262626;
  font-size: 14px;
}

.flavor-info .flavor-specs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.flavor-info .flavor-description {
  font-size: 12px;
  color: #666;
}
</style>
