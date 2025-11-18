<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { Tab } from '@/data/tabs';

type TabsProps = {
	tabs: Tab[];
	defaultTab: string;
};

const props = defineProps<TabsProps>();

const route = useRoute();
const router = useRouter();

const activeKey = computed(() => route.hash?.replace('#', '') || props.defaultTab);

const isActive = (key: string): boolean => activeKey.value === key;

const setTab = (key: string): void => {
	router.push({ path: route.path, hash: `#${key}` });
};
</script>

<template>
	<div class="integration-tabs" role="tablist">
		<button
			v-for="tab in props.tabs"
			:key="tab.key"
			class="integration-tabs__tab"
			:class="{ 'is-active': isActive(tab.key) }"
			role="tab"
			@click="() => setTab(tab.key)"
		>
			{{ tab.label }}
		</button>
	</div>
</template>

<style scoped lang="scss">
.integration-tabs {
	display: flex;
	gap: 16px;
	width: 100%;
}

.integration-tabs__tab {
	border: 1px solid var(--neutral--200);
	background: var(--neutral--0);
	color: var(--neutral--500);
	border-radius: 24px;
	padding: 4px 16px;
	font-weight: bold;
	font-size: 14px;
	line-height: 20px;
	cursor: pointer;
}

.integration-tabs__tab.is-active {
	background: var(--neutral--500);
	color: var(--neutral--0);
	font-weight: normal;
}
</style>
