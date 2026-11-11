import { expect, test } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Entre na sua conta' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Login real indisponível');
  await expect(page.getByLabel('E-mail')).toBeEnabled();
  await expect(page.getByLabel('Senha')).toBeEnabled();

  await page.getByRole('button', { name: 'Cadastre-se' }).click();
  await expect(page.getByRole('heading', { name: 'Crie sua conta' })).toBeVisible();
  await expect(page.getByLabel('E-mail')).toBeEnabled();

  await page.getByRole('button', { name: 'Fazer login' }).click();
  await page.getByRole('button', { name: 'Experimentar em modo demonstração' }).click();
  await expect(page.getByRole('heading', { name: 'Sua vida financeira, em equilíbrio.' })).toBeVisible();
  await expect(page.getByRole('note')).toContainText('Modo demonstração');

  await page.getByRole('button', { name: 'Novo lançamento' }).click();
  await page.getByLabel('Descrição').fill('Conta de internet');
  await page.getByLabel('Valor (R$)').fill('129.90');
  await page.getByLabel('Categoria').selectOption({ label: 'Moradia' });
  await page.getByRole('button', { name: 'Salvar lançamento' }).click();
  await expect(page.locator('.notice[role="status"]')).toContainText('Lançamento adicionado');

  await page.reload();
  await page.getByRole('button', { name: 'Experimentar em modo demonstração' }).click();
  await page.getByRole('button', { name: 'Lançamentos' }).click();
  await expect(page.getByText('Conta de internet')).toBeVisible();

  await page.getByRole('button', { name: 'Editar Conta de internet' }).click();
  await page.getByLabel('Descrição').fill('Internet residencial');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.notice[role="status"]')).toContainText('Lançamento atualizado');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Excluir Internet residencial' }).click();
  await expect(page.getByText('Internet residencial')).toHaveCount(0);

  await page.getByRole('button', { name: 'Metas financeiras' }).click();
  await expect(page.getByText('Viagem de férias')).toBeVisible();
  await page.getByRole('button', { name: 'Nova meta' }).click();
  await page.getByLabel('Nome da meta').fill('Curso de programação');
  await page.getByLabel('Valor desejado (R$)').fill('2500');
  await page.getByLabel('Prazo').fill('2027-06-30');
  await page.getByRole('button', { name: 'Criar meta' }).click();
  await expect(page.locator('.notice[role="status"]')).toContainText('Meta criada');
  await expect(page.getByText('Curso de programação')).toBeVisible();
});
