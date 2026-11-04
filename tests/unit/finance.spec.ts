import { describe, expect, it } from 'vitest';

import { filterByMonth, formatCurrency, getDashboardMetrics, type FinanceTransaction } from '../../src/domain/finance';

const transaction = (id: string, valor: number, categoria: string, data: string) => ({
  id,
  descricao: id,
  valor,
  categoria,
  data,
});

describe('finance calculations', () => {
  it('filters transactions by selected calendar month', () => {
    const transactions: FinanceTransaction[] = [
      transaction('a', 100, 'Salário', '2026-04-10'),
      transaction('b', 50, 'Freelance', '2026-05-01'),
    ];

    expect(filterByMonth(transactions, '2026-04')).toEqual([transactions[0]]);
  });

  it('calculates balances, transaction count, expense ratio, and largest category', () => {
    const metrics = getDashboardMetrics(
      [transaction('salary', 5000, 'Salário', '2026-04-01')],
      [
        transaction('food-1', 300, 'Alimentação', '2026-04-02'),
        transaction('food-2', 250, 'Alimentação', '2026-04-04'),
        transaction('transport', 200, 'Transporte', '2026-04-06'),
      ],
    );

    expect(metrics).toEqual({
      totalReceitas: 5000,
      totalDespesas: 750,
      saldo: 4250,
      quantidadeLancamentos: 4,
      percentualDespesas: 15,
      maiorCategoria: { nome: 'Alimentação', valor: 550 },
    });
  });

  it('marks the expense ratio as unavailable when there is no income', () => {
    expect(getDashboardMetrics([], [transaction('rent', 100, 'Moradia', '2026-04-01')])).toMatchObject({
      percentualDespesas: null,
      saldo: -100,
    });
  });

  it('formats values as Brazilian reais', () => {
    expect(formatCurrency(1234.5)).toBe('R$\u00a01.234,50');
  });
});
