import type { FinanceGoal, FinanceTransaction } from './finance';

export interface DemoData {
  receitas: FinanceTransaction[];
  despesas: FinanceTransaction[];
  metas: FinanceGoal[];
}

export const DEMO_STORAGE_KEY = 'finance-demo-data-v1';

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateInMonth(date: Date, monthOffset: number, day: number): string {
  return formatLocalDate(new Date(date.getFullYear(), date.getMonth() + monthOffset, day));
}

export function createDemoData(today = new Date()): DemoData {
  const receitas: FinanceTransaction[] = [];
  const despesas: FinanceTransaction[] = [];

  for (let monthOffset = -5; monthOffset <= 0; monthOffset += 1) {
    const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    receitas.push({
      id: `demo-salary-${monthKey}`,
      descricao: 'Salário',
      valor: 4800 + (monthOffset + 5) * 100,
      categoria: 'Salário',
      data: dateInMonth(today, monthOffset, 5),
    });

    despesas.push(
      {
        id: `demo-rent-${monthKey}`,
        descricao: 'Aluguel',
        valor: 1450,
        categoria: 'Moradia',
        data: dateInMonth(today, monthOffset, 8),
      },
      {
        id: `demo-food-${monthKey}`,
        descricao: 'Mercado e alimentação',
        valor: 620 + (monthOffset + 5) * 15,
        categoria: 'Alimentação',
        data: dateInMonth(today, monthOffset, 12),
      },
      {
        id: `demo-transport-${monthKey}`,
        descricao: 'Transporte',
        valor: 230,
        categoria: 'Transporte',
        data: dateInMonth(today, monthOffset, 16),
      },
    );
  }

  receitas.push({
    id: 'demo-freelance',
    descricao: 'Projeto freelance',
    valor: 750,
    categoria: 'Freelance',
    data: dateInMonth(today, 0, 10),
  });
  despesas.push({
    id: 'demo-health',
    descricao: 'Farmácia',
    valor: 95,
    categoria: 'Saúde',
    data: dateInMonth(today, 0, 18),
  });

  return {
    receitas,
    despesas,
    metas: [
      {
        id: 'demo-trip',
        descricao: 'Viagem de férias',
        valor_alvo: 5000,
        valor_atual: 1850,
        prazo: dateInMonth(today, 5, 15),
      },
      {
        id: 'demo-emergency-fund',
        descricao: 'Reserva de emergência',
        valor_alvo: 10000,
        valor_atual: 4200,
        prazo: dateInMonth(today, 11, 15),
      },
    ],
  };
}

function isTransaction(value: unknown): value is FinanceTransaction {
  if (typeof value !== 'object' || value === null) return false;
  const transaction = value as Record<string, unknown>;
  return (
    typeof transaction.id === 'string' &&
    typeof transaction.descricao === 'string' &&
    typeof transaction.valor === 'number' &&
    typeof transaction.categoria === 'string' &&
    typeof transaction.data === 'string'
  );
}

function isGoal(value: unknown): value is FinanceGoal {
  if (typeof value !== 'object' || value === null) return false;
  const goal = value as Record<string, unknown>;
  return (
    typeof goal.id === 'string' &&
    typeof goal.descricao === 'string' &&
    typeof goal.valor_alvo === 'number' &&
    typeof goal.valor_atual === 'number' &&
    typeof goal.prazo === 'string'
  );
}

export function parseDemoData(serialized: string | null): DemoData | null {
  if (serialized === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    throw new Error('Os dados da demonstração estão inválidos. Inicie uma nova demonstração.');
  }

  if (typeof value !== 'object' || value === null) {
    throw new Error('Os dados da demonstração estão inválidos. Inicie uma nova demonstração.');
  }

  const data = value as Record<string, unknown>;
  if (
    !Array.isArray(data.receitas) ||
    !data.receitas.every(isTransaction) ||
    !Array.isArray(data.despesas) ||
    !data.despesas.every(isTransaction) ||
    !Array.isArray(data.metas) ||
    !data.metas.every(isGoal)
  ) {
    throw new Error('Os dados da demonstração estão inválidos. Inicie uma nova demonstração.');
  }

  return {
    receitas: data.receitas,
    despesas: data.despesas,
    metas: data.metas,
  };
}
