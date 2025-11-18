const EMAIL_FIELD_SELECTORS = [
	'form.checkout input[name="billing_email"]',
	'form.woocommerce-checkout input[name="billing_email"]',
	'form[name="checkout"] input[type="email"]',
	'form.checkout input[type="email"]',
	'form[id*="checkout"] input[type="email"]',
	'form[class*="checkout"] input[type="email"]',
	'input#billing_email',
	'input[type="email"]'
];

(function () {

	const findEmailInput = () => {
		for (const field of EMAIL_FIELD_SELECTORS) {
			let emailField = document.querySelector(field);
			if (emailField) return emailField;
		}

		return null;
	}

	const handleAction = () => {

		const data = new FormData();
		data.append('action', hostinger_reach_email_capture_data.action);
		data.append('nonce', hostinger_reach_email_capture_data.nonce);

		let email = findEmailInput();
		if (!email) {
			return;
		}

		data.append('email', email.value);

		fetch(hostinger_reach_email_capture_data.ajaxurl, {
			method: 'POST',
			body: data
		});
	}

	const init = () => {

		const emailInput = findEmailInput();

		if (!hostinger_reach_email_capture_data || !emailInput) {
			return;
		}

		emailInput.addEventListener('change', handleAction, {passive: true});
		emailInput.addEventListener('blur', handleAction, {passive: true});
	}

	document.addEventListener('DOMContentLoaded', init);
})();
