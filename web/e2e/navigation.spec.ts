import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/RGS/);
});

test('get to settings page', async ({ page }) => {
	await page.goto('/');
	await new Promise((r) => setTimeout(r, 1000));
	const settingLink = page.locator('a[href="/settings"]');
	await settingLink.click();
	await expect(page).toHaveURL(/\/settings$/);
});
