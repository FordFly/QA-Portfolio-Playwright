import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
});

test('Mi primer login en SauceDemo', async ({ page }) => {
  await expect(page).toHaveURL(/.*inventory.html/);
});

test('Añadir producto al carrito', async ({ page }) => {

  await page.locator('#add-to-cart-sauce-labs-backpack').click();
  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});