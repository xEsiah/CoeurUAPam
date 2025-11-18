import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { useToast } from '@/composables/useToast';
import { HOSTINGER_REACH_ID } from '@/data/pluginData';
import { formsRepo } from '@/data/repositories/formsRepo';
import { STORE_PERSISTENT_KEYS } from '@/types/enums';
import type { Form, Integration } from '@/types/models';
import { translate } from '@/utils/translate';

export const useIntegrationsStore = defineStore(
	'integrationsStore',
	() => {
		const { showSuccess } = useToast();

		const integrations = ref<Integration[]>([]);
		const isLoading = ref(false);
		const error = ref<string | null>(null);
		const loadingIntegrations = ref<Record<string, boolean>>({});

		const activeIntegrations = computed(() => integrations.value.filter((integration) => integration.isActive));

		const availableIntegrations = computed(() => integrations.value.filter(({ id }) => id !== HOSTINGER_REACH_ID));

		const hasAnyForms = (type: string = 'forms') =>
			integrations.value.some(
				(integration) => integration.type === type && integration.forms && integration.forms.length > 0
			);

		const fromType = (type: string = 'forms'): Integration[] =>
			integrations.value.filter((integration) => integration.type === type);

		const isIntegrationLoading = (integrationId: string) => loadingIntegrations.value[integrationId] || false;

		const mapAndFilterForms = (formsData: Form[], integration: Integration) =>
			formsData
				?.filter((form) => integration.id === form.type)
				.map((form) => ({
					...form,
					integration
				})) || [];

		const loadIntegrations = async () => {
			isLoading.value = true;
			error.value = null;

			const [integrationsData, integrationsError] = await formsRepo.getIntegrations();
			const [formsData] = await formsRepo.getForms();

			if (integrationsError) {
				error.value = integrationsError.message || 'Failed to load integrations';
				isLoading.value = false;

				return;
			}

			if (integrationsData) {
				integrations.value = Object.values(integrationsData).map((integration) => ({
					...integration,
					forms: mapAndFilterForms(formsData || [], integration)
				}));
			}

			isLoading.value = false;
		};

		const toggleIntegrationStatus = async (integrationId: string, isActive: boolean) => {
			isLoading.value = true;
			loadingIntegrations.value[integrationId] = true;

			const [, error] = await formsRepo.toggleIntegrationStatus(integrationId, isActive);
			isLoading.value = false;

			if (error) {
				loadingIntegrations.value[integrationId] = false;

				return;
			}

			const integration = integrations.value.find((i) => i.id === integrationId);

			if (integration) {
				integration.isActive = isActive;
			}

			await loadIntegrations();
			loadingIntegrations.value[integrationId] = false;

			showSuccess(
				translate(
					isActive
						? 'hostinger_reach_forms_plugin_connected_success'
						: 'hostinger_reach_forms_plugin_disconnected_success'
				)
			);
		};

		return {
			integrations,
			isLoading,
			error,
			loadingIntegrations,
			activeIntegrations,
			availableIntegrations,
			hasAnyForms,
			isIntegrationLoading,
			loadIntegrations,
			toggleIntegrationStatus,
			fromType
		};
	},
	{
		persist: { key: STORE_PERSISTENT_KEYS.INTEGRATIONS_STORE }
	}
);
