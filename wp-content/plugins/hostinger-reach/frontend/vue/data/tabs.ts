import { translate } from '@/utils/translate';

export type Tab = {
	key: string;
	label: string;
};

export const TABS_KEYS = {
	OVERVIEW_TAB_FORMS: 'forms',
	OVERVIEW_TAB_ECOMMERCE: 'ecommerce'
};

export const OVERVIEW_TABS: Tab[] = [
	{
		key: TABS_KEYS.OVERVIEW_TAB_FORMS,
		label: translate('hostinger_reach_forms_title')
	},
	{
		key: TABS_KEYS.OVERVIEW_TAB_ECOMMERCE,
		label: translate('hostinger_reach_ecommerce_title')
	}
];

export const DEFAULT_OVERVIEW_TAB: string = TABS_KEYS.OVERVIEW_TAB_FORMS;
