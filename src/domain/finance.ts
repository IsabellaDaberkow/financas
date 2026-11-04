export interface FinanceTransaction {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

export interface FinanceGoal {
  id: string;
  descricao: string;
  valor_alvo: number;
  valor_atual: number;
  prazo: string;
}

export interface DashboardMetrics {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  quantidadeLancamentos: number;
  percentualDespesas: number | null;
  maiorCategoria: { nome: string; valor: number } | null;
}

export function filterByMonth(transactions: FinanceTransaction[], month: string): FinanceTransaction[] {
  return transactions.filter((transaction) => transaction.data.startsWith(month));
}

export function getDashboardMetrics(receitas: FinanceTransaction[], despesas: FinanceTransaction[]): DashboardMetrics {
  const totalReceitas = receitas.reduce((total, item) => total + Number(item.valor), 0);
  const totalDespesas = despesas.reduce((total, item) => total + Number(item.valor), 0);
  const gastosPorCategoria = despesas.reduce<Record<string, number>>((totals, item) => {
    totals[item.categoria] = (totals[item.categoria] ?? 0) + Number(item.valor);
    return totals;
  }, {});
  const maiorCategoria = Object.entries(gastosPorCategoria).sort(([, totalA], [, totalB]) => totalB - totalA)[0];

  return {
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    quantidadeLancamentos: receitas.length + despesas.length,
    percentualDespesas: totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : null,
    maiorCategoria: maiorCategoria ? { nome: maiorCategoria[0], valor: maiorCategoria[1] } : null,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
}
