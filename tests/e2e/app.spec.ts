import { expect, test } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Entre na sua conta' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Conecte seu projeto Supabase');

  await page.getByRole('button', { name: 'Cadastre-se' }).click();
  await expect(page.getByRole('heading', { name: 'Crie sua conta' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Criar conta' })).toBeDisabled();
});
