<template>
  <ion-page>
    <ion-header v-if="user || demoMode" class="app-header">
      <ion-toolbar>
        <div class="topbar">
          <a class="brand" href="#" @click.prevent="currentSection = 'dashboard'">
            <span class="brand-mark"><ion-icon :icon="walletOutline" /></span>
            <span>finança<span class="brand-accent">clara</span></span>
          </a>
          <div class="topbar-actions">
            <span class="user-email">{{ demoMode ? 'Modo demonstração' : user?.email }}</span>
            <button
              class="icon-button"
              type="button"
              :aria-label="darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'"
              @click="toggleTheme"
            >
              <ion-icon :icon="darkMode ? sunnyOutline : moonOutline" />
            </button>
            <button class="icon-button" type="button" aria-label="Sair da conta" title="Sair da conta" @click="signOut">
              <ion-icon :icon="logOutOutline" />
            </button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="!user && !demoMode">
      <div v-if="noticeMessage" class="notice" :class="`notice-${noticeType}`" role="status">
        <span>{{ noticeMessage }}</span>
        <button type="button" aria-label="Fechar aviso" @click="noticeMessage = ''">×</button>
      </div>

      <div v-if="authLoading" class="loading-screen">
        <ion-spinner name="crescent" />
        <span>Preparando seu espaço financeiro...</span>
      </div>

      <main v-else-if="!user && !demoMode" class="auth-layout">
        <section class="auth-intro">
          <a class="brand brand-light" href="#">
            <span class="brand-mark"><ion-icon :icon="walletOutline" /></span>
            <span>finança<span class="brand-accent">clara</span></span>
          </a>
          <div class="auth-pitch">
            <span class="eyebrow">MAIS CLAREZA, MAIS PLANOS</span>
            <h1>Seu dinheiro,<br />no caminho certo.</h1>
            <p>Organize as contas do mês, acompanhe suas conquistas e faça seus planos acontecerem.</p>
            <div class="pitch-stat">
              <span class="stat-icon"><ion-icon :icon="trendingUpOutline" /></span>
              <span
                ><strong>Uma vida financeira mais leve</strong><small>Um passo de cada vez, no seu ritmo.</small></span
              >
            </div>
          </div>
          <span class="auth-decoration decoration-one"></span>
          <span class="auth-decoration decoration-two"></span>
        </section>

        <section class="auth-panel">
          <form class="auth-card" @submit.prevent="submitAuth">
            <span class="eyebrow">BEM-VINDA(O) DE VOLTA</span>
            <h2>{{ authMode === 'login' ? 'Entre na sua conta' : 'Crie sua conta' }}</h2>
            <p class="muted-copy">
              {{
                authMode === 'login'
                  ? 'Acompanhe suas finanças com mais tranquilidade.'
                  : 'Comece a cuidar melhor do seu dinheiro.'
              }}
            </p>

            <label class="field-label" for="auth-email">E-mail</label>
            <input
              id="auth-email"
              v-model="authForm.email"
              type="email"
              placeholder="voce@email.com"
              autocomplete="email"
              required
              :disabled="authSubmitting"
            />

            <label class="field-label" for="auth-password">Senha</label>
            <input
              id="auth-password"
              v-model="authForm.password"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              :autocomplete="authMode === 'login' ? 'current-password' : 'new-password'"
              minlength="6"
              required
              :disabled="authSubmitting"
            />

            <button class="primary-button auth-submit" type="submit" :disabled="authSubmitting">
              <ion-spinner v-if="authSubmitting" name="crescent" />
              {{ authSubmitting ? 'Aguarde...' : authMode === 'login' ? 'Entrar' : 'Criar conta' }}
            </button>

            <p class="auth-switch">
              {{ authMode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?' }}
              <button type="button" :disabled="authSubmitting" @click="toggleAuthMode">
                {{ authMode === 'login' ? 'Cadastre-se' : 'Fazer login' }}
              </button>
            </p>

            <button class="demo-button" type="button" :disabled="authSubmitting" @click="startDemo">
              <ion-icon :icon="sparklesOutline" />
              Experimentar em modo demonstração
            </button>

            <div v-if="!isSupabaseConfigured" class="setup-notice" role="alert">
              <strong>Login real indisponível neste ambiente</strong>
              <span
                >Copie <code>.env.example</code> para <code>.env.local</code>, preencha a URL e a chave anon/public do
                projeto e reinicie o servidor. Para explorar o app agora, use o modo demonstração.</span
              >
            </div>
          </form>
        </section>
      </main>

      <main v-else class="app-shell">
        <nav class="sidebar" aria-label="Navegação principal">
          <span class="sidebar-label">MENU</span>
          <button
            :class="{ active: currentSection === 'dashboard' }"
            type="button"
            @click="currentSection = 'dashboard'"
          >
            <ion-icon :icon="homeOutline" /><span>Visão geral</span>
          </button>
          <button
            :class="{ active: currentSection === 'transactions' }"
            type="button"
            @click="currentSection = 'transactions'"
          >
            <ion-icon :icon="listOutline" /><span>Lançamentos</span>
          </button>
          <button :class="{ active: currentSection === 'goals' }" type="button" @click="currentSection = 'goals'">
            <ion-icon :icon="flagOutline" /><span>Metas financeiras</span>
          </button>
          <div class="sidebar-tip">
            <span class="tip-icon"><ion-icon :icon="sparklesOutline" /></span>
            <strong>Pequenos passos contam</strong>
            <p>Consistência é o segredo de um futuro mais tranquilo.</p>
          </div>
          <button class="sidebar-theme" type="button" @click="toggleTheme">
            <ion-icon :icon="darkMode ? sunnyOutline : moonOutline" />
            <span>{{ darkMode ? 'Tema claro' : 'Modo escuro' }}</span>
          </button>
        </nav>

        <section class="main-content">
          <div v-if="demoMode" class="demo-banner" role="note">
            <ion-icon :icon="sparklesOutline" />
            <span
              ><strong>Modo demonstração.</strong> Dados fictícios salvos somente neste navegador; não são enviados ao
              Supabase.</span
            >
          </div>

          <div class="page-heading">
            <div>
              <span class="eyebrow">{{ currentMonthLabel }}</span>
              <h1>{{ sectionTitle }}</h1>
              <p>{{ sectionSubtitle }}</p>
            </div>
            <button
              v-if="currentSection !== 'goals'"
              class="primary-button heading-action"
              type="button"
              aria-label="Novo lançamento"
              @click="openNewTransaction"
            >
              <ion-icon :icon="addOutline" />
              <span>Novo lançamento</span>
            </button>
            <button
              v-else
              class="primary-button heading-action"
              type="button"
              aria-label="Nova meta"
              @click="openNewGoal"
            >
              <ion-icon :icon="addOutline" />
              <span>Nova meta</span>
            </button>
          </div>

          <div v-if="dataLoading" class="loading-inline">
            <ion-spinner name="crescent" />
            <span>Atualizando seus dados...</span>
          </div>

          <template v-else-if="currentSection === 'dashboard'">
            <section class="period-row">
              <label for="dashboard-month">Período</label>
              <input id="dashboard-month" v-model="selectedMonth" type="month" />
            </section>

            <section class="summary-grid" aria-label="Resumo financeiro do mês">
              <article class="summary-card balance-card">
                <span class="summary-icon"><ion-icon :icon="walletOutline" /></span>
                <span class="summary-label">Saldo do período</span>
                <strong>{{ formatCurrency(metrics.saldo) }}</strong>
                <small>{{
                  metrics.saldo >= 0 ? 'Você está no caminho certo' : 'As despesas passaram das receitas'
                }}</small>
              </article>
              <article class="summary-card">
                <span class="summary-icon income-icon"><ion-icon :icon="trendingUpOutline" /></span>
                <span class="summary-label">Receitas</span>
                <strong>{{ formatCurrency(metrics.totalReceitas) }}</strong>
                <small
                  >{{ filteredReceitas.length }} {{ filteredReceitas.length === 1 ? 'entrada' : 'entradas' }} no
                  período</small
                >
              </article>
              <article class="summary-card">
                <span class="summary-icon expense-icon"><ion-icon :icon="trendingDownOutline" /></span>
                <span class="summary-label">Despesas</span>
                <strong>{{ formatCurrency(metrics.totalDespesas) }}</strong>
                <small
                  >{{ filteredDespesas.length }} {{ filteredDespesas.length === 1 ? 'saída' : 'saídas' }} no
                  período</small
                >
              </article>
            </section>

            <section class="chart-grid">
              <article class="panel chart-panel">
                <div class="panel-heading">
                  <div>
                    <h2>Despesas por categoria</h2>
                    <p>Onde seu dinheiro foi neste mês</p>
                  </div>
                  <span class="panel-icon"><ion-icon :icon="pieChartOutline" /></span>
                </div>
                <div v-if="expenseChartSeries.length" class="chart-wrap">
                  <VueApexCharts
                    type="donut"
                    height="250"
                    :options="expenseChartOptions"
                    :series="expenseChartSeries"
                  />
                </div>
                <div v-else class="chart-empty">
                  <span class="empty-icon"><ion-icon :icon="pieChartOutline" /></span>
                  <strong>Nenhuma despesa por aqui</strong>
                  <span>Seus gastos por categoria aparecerão quando você registrar uma despesa.</span>
                </div>
                <div v-if="expenseCategories.length" class="category-legend">
                  <div v-for="category in expenseCategories" :key="category.name">
                    <span class="legend-dot" :style="{ backgroundColor: category.color }"></span>
                    <span>{{ category.name }}</span>
                    <strong>{{ formatCurrency(category.value) }}</strong>
                  </div>
                </div>
              </article>

              <article class="panel chart-panel">
                <div class="panel-heading">
                  <div>
                    <h2>Entradas e saídas</h2>
                    <p>Comparativo dos últimos seis meses</p>
                  </div>
                  <span class="panel-icon"><ion-icon :icon="barChartOutline" /></span>
                </div>
                <div class="chart-wrap">
                  <VueApexCharts type="bar" height="280" :options="monthlyChartOptions" :series="monthlyChartSeries" />
                </div>
                <div class="chart-legend">
                  <span><i class="legend-dot income-dot"></i> Receitas</span>
                  <span><i class="legend-dot expense-dot"></i> Despesas</span>
                </div>
              </article>
            </section>

            <section class="insight-grid">
              <article class="panel insight-card">
                <span class="insight-icon"><ion-icon :icon="pieChartOutline" /></span>
                <div>
                  <span class="summary-label">Maior categoria de gasto</span
                  ><strong>{{ metrics.maiorCategoria?.nome ?? 'Sem despesas' }}</strong
                  ><small>{{
                    metrics.maiorCategoria
                      ? formatCurrency(metrics.maiorCategoria.valor)
                      : 'Registre uma despesa para ver este indicador'
                  }}</small>
                </div>
              </article>
              <article class="panel insight-card">
                <span class="insight-icon insight-purple"><ion-icon :icon="listOutline" /></span>
                <div>
                  <span class="summary-label">Lançamentos no período</span
                  ><strong>{{ metrics.quantidadeLancamentos }}</strong
                  ><small>Receitas e despesas registradas</small>
                </div>
              </article>
              <article class="panel insight-card">
                <span class="insight-icon insight-orange"><ion-icon :icon="statsChartOutline" /></span>
                <div>
                  <span class="summary-label">Despesas sobre receitas</span
                  ><strong>{{
                    metrics.percentualDespesas === null ? '—' : `${metrics.percentualDespesas.toFixed(1)}%`
                  }}</strong
                  ><small>{{
                    metrics.percentualDespesas === null
                      ? 'Registre uma receita para comparar'
                      : 'Do total recebido no período'
                  }}</small>
                </div>
              </article>
            </section>

            <section class="panel recent-panel">
              <div class="panel-heading">
                <div>
                  <h2>Últimos lançamentos</h2>
                  <p>Movimentações do período selecionado</p>
                </div>
                <button class="text-button" type="button" @click="currentSection = 'transactions'">
                  Ver todos <span aria-hidden="true">→</span>
                </button>
              </div>
              <div v-if="recentTransactions.length" class="transaction-list">
                <article v-for="item in recentTransactions" :key="`${item.type}-${item.id}`" class="transaction-row">
                  <span class="transaction-icon" :class="item.type === 'income' ? 'income-icon' : 'expense-icon'">
                    <ion-icon :icon="item.type === 'income' ? trendingUpOutline : trendingDownOutline" />
                  </span>
                  <div class="transaction-description">
                    <strong>{{ item.descricao }}</strong
                    ><span>{{ item.categoria }} · {{ formatDate(item.data) }}</span>
                  </div>
                  <strong class="transaction-value" :class="item.type"
                    >{{ item.type === 'income' ? '+' : '−' }}{{ formatCurrency(item.valor) }}</strong
                  >
                </article>
              </div>
              <div v-else class="empty-list">Seus lançamentos deste mês aparecerão aqui.</div>
            </section>
          </template>

          <template v-else-if="currentSection === 'transactions'">
            <section class="period-row">
              <label for="transactions-month">Filtrar mês</label>
              <input id="transactions-month" v-model="selectedMonth" type="month" />
              <div class="transaction-count">{{ filteredTransactions.length }} lançamentos</div>
            </section>
            <section class="panel transactions-panel">
              <div class="panel-heading">
                <div>
                  <h2>Suas movimentações</h2>
                  <p>Edite ou remova qualquer lançamento</p>
                </div>
              </div>
              <div v-if="filteredTransactions.length" class="transaction-list">
                <article v-for="item in filteredTransactions" :key="`${item.type}-${item.id}`" class="transaction-row">
                  <span class="transaction-icon" :class="item.type === 'income' ? 'income-icon' : 'expense-icon'">
                    <ion-icon :icon="item.type === 'income' ? trendingUpOutline : trendingDownOutline" />
                  </span>
                  <div class="transaction-description">
                    <strong>{{ item.descricao }}</strong
                    ><span>{{ item.categoria }} · {{ formatDate(item.data) }}</span>
                  </div>
                  <strong class="transaction-value" :class="item.type"
                    >{{ item.type === 'income' ? '+' : '−' }}{{ formatCurrency(item.valor) }}</strong
                  >
                  <div class="row-actions">
                    <button
                      class="icon-button"
                      type="button"
                      :aria-label="`Editar ${item.descricao}`"
                      @click="editTransaction(item, item.type)"
                    >
                      <ion-icon :icon="createOutline" />
                    </button>
                    <button
                      class="icon-button delete-button"
                      type="button"
                      :aria-label="`Excluir ${item.descricao}`"
                      @click="deleteTransaction(item, item.type)"
                    >
                      <ion-icon :icon="trashOutline" />
                    </button>
                  </div>
                </article>
              </div>
              <div v-else class="empty-list">
                Nenhum lançamento encontrado para este mês. Adicione uma receita ou despesa para começar.
              </div>
            </section>
          </template>

          <template v-else>
            <section class="goals-intro">
              <span class="goals-intro-icon"><ion-icon :icon="flagOutline" /></span>
              <div>
                <strong>Seus planos merecem espaço.</strong>
                <p>Defina um objetivo, acompanhe seu progresso e celebre cada conquista.</p>
              </div>
            </section>
            <section v-if="goals.length" class="goals-grid">
              <article v-for="goal in goals" :key="goal.id" class="panel goal-card">
                <div class="goal-card-top">
                  <span class="goal-icon"><ion-icon :icon="flagOutline" /></span>
                  <div class="row-actions">
                    <button
                      class="icon-button"
                      type="button"
                      :aria-label="`Editar meta ${goal.descricao}`"
                      @click="editGoal(goal)"
                    >
                      <ion-icon :icon="createOutline" /></button
                    ><button
                      class="icon-button delete-button"
                      type="button"
                      :aria-label="`Excluir meta ${goal.descricao}`"
                      @click="deleteGoal(goal)"
                    >
                      <ion-icon :icon="trashOutline" />
                    </button>
                  </div>
                </div>
                <h2>{{ goal.descricao }}</h2>
                <p class="goal-deadline">Prazo: {{ formatDate(goal.prazo) }}</p>
                <div class="goal-amounts">
                  <strong>{{ formatCurrency(goal.valor_atual) }}</strong
                  ><span>de {{ formatCurrency(goal.valor_alvo) }}</span>
                </div>
                <div
                  class="progress-track"
                  role="progressbar"
                  :aria-valuenow="Math.min(goalProgress(goal), 100)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`Progresso da meta ${goal.descricao}`"
                >
                  <span :style="{ width: `${Math.min(goalProgress(goal), 100)}%` }"></span>
                </div>
                <div class="goal-footer">
                  <span>{{ goalProgress(goal).toFixed(0) }}% concluído</span
                  ><strong v-if="goal.valor_atual >= goal.valor_alvo" class="goal-complete">Meta alcançada!</strong
                  ><span v-else>Faltam {{ formatCurrency(Math.max(goal.valor_alvo - goal.valor_atual, 0)) }}</span>
                </div>
              </article>
            </section>
            <section v-else class="panel goals-empty">
              <span class="empty-icon"><ion-icon :icon="flagOutline" /></span>
              <h2>Qual é o seu próximo plano?</h2>
              <p>Crie sua primeira meta e acompanhe o progresso até conquistar o que deseja.</p>
              <button class="primary-button" type="button" @click="openNewGoal">
                <ion-icon :icon="addOutline" /> Criar minha primeira meta
              </button>
            </section>
          </template>
        </section>
      </main>

      <ion-modal :is-open="transactionModalOpen" @did-dismiss="closeTransactionModal">
        <div class="modal-card">
          <div class="modal-heading">
            <div>
              <span class="eyebrow">{{ editingTransactionId ? 'ATUALIZE SEU REGISTRO' : 'NOVO REGISTRO' }}</span>
              <h2>{{ editingTransactionId ? 'Editar lançamento' : 'Adicionar lançamento' }}</h2>
            </div>
            <button class="icon-button" type="button" aria-label="Fechar" @click="transactionModalOpen = false">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>
          <form class="modal-form" @submit.prevent="saveTransaction">
            <label class="field-label" for="transaction-type">Tipo</label>
            <select id="transaction-type" v-model="transactionForm.type" :disabled="Boolean(editingTransactionId)">
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
            <label class="field-label" for="transaction-description">Descrição</label>
            <input
              id="transaction-description"
              v-model="transactionForm.descricao"
              type="text"
              maxlength="100"
              placeholder="Ex.: Conta de luz"
              required
            />
            <label class="field-label" for="transaction-amount">Valor (R$)</label>
            <input
              id="transaction-amount"
              v-model="transactionForm.valor"
              type="number"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              placeholder="0,00"
              required
            />
            <label class="field-label" for="transaction-category">Categoria</label>
            <select id="transaction-category" v-model="transactionForm.categoria" required>
              <option disabled value="">Selecione uma categoria</option>
              <option v-for="category in transactionCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <label class="field-label" for="transaction-date">Data</label>
            <input id="transaction-date" v-model="transactionForm.data" type="date" required />
            <button class="primary-button modal-submit" type="submit" :disabled="formSubmitting">
              {{ formSubmitting ? 'Salvando...' : editingTransactionId ? 'Salvar alterações' : 'Salvar lançamento' }}
            </button>
          </form>
        </div>
      </ion-modal>

      <ion-modal :is-open="goalModalOpen" @did-dismiss="closeGoalModal">
        <div class="modal-card">
          <div class="modal-heading">
            <div>
              <span class="eyebrow">{{ editingGoalId ? 'ATUALIZE SEU PLANO' : 'UM NOVO PLANO' }}</span>
              <h2>{{ editingGoalId ? 'Editar meta' : 'Criar meta financeira' }}</h2>
            </div>
            <button class="icon-button" type="button" aria-label="Fechar" @click="goalModalOpen = false">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>
          <form class="modal-form" @submit.prevent="saveGoal">
            <label class="field-label" for="goal-description">Nome da meta</label>
            <input
              id="goal-description"
              v-model="goalForm.descricao"
              type="text"
              maxlength="100"
              placeholder="Ex.: Viagem de férias"
              required
            />
            <label class="field-label" for="goal-target">Valor desejado (R$)</label>
            <input
              id="goal-target"
              v-model="goalForm.valor_alvo"
              type="number"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              placeholder="0,00"
              required
            />
            <label class="field-label" for="goal-current">Valor já guardado (R$)</label>
            <input
              id="goal-current"
              v-model="goalForm.valor_atual"
              type="number"
              min="0"
              step="0.01"
              inputmode="decimal"
              placeholder="0,00"
              required
            />
            <label class="field-label" for="goal-deadline">Prazo</label>
            <input id="goal-deadline" v-model="goalForm.prazo" type="date" required />
            <button class="primary-button modal-submit" type="submit" :disabled="formSubmitting">
              {{ formSubmitting ? 'Salvando...' : editingGoalId ? 'Salvar alterações' : 'Criar meta' }}
            </button>
          </form>
        </div>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import type { User } from '@supabase/supabase-js';
import type { ApexOptions } from 'apexcharts';
import {
  addOutline,
  barChartOutline,
  closeOutline,
  createOutline,
  flagOutline,
  homeOutline,
  listOutline,
  logOutOutline,
  moonOutline,
  pieChartOutline,
  sparklesOutline,
  statsChartOutline,
  sunnyOutline,
  trashOutline,
  trendingDownOutline,
  trendingUpOutline,
  walletOutline,
} from 'ionicons/icons';
import { IonContent, IonHeader, IonIcon, IonModal, IonPage, IonSpinner, IonToolbar } from '@ionic/vue';

import {
  filterByMonth,
  formatCurrency,
  formatDate,
  getDashboardMetrics,
  type FinanceGoal,
  type FinanceTransaction,
} from '../domain/finance';
import { createDemoData, DEMO_STORAGE_KEY, parseDemoData, type DemoData } from '../domain/demo';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type TransactionType = 'income' | 'expense';
type Section = 'dashboard' | 'transactions' | 'goals';
type GoalForm = Pick<FinanceGoal, 'descricao' | 'prazo'> & { valor_alvo: string; valor_atual: string };
type TransactionForm = Pick<FinanceTransaction, 'descricao' | 'categoria' | 'data'> & {
  valor: string;
  type: TransactionType;
};

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));
const categoryColors = ['#688b78', '#e7a65a', '#8e81b8', '#5f9bb2', '#d87971', '#8b9b67', '#a88165'];
const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Outros'];
const expenseCategoryOptions = ['Alimentação', 'Transporte', 'Moradia', 'Educação', 'Lazer', 'Saúde', 'Outros'];
const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
const selectedMonth = ref(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
const user = ref<User | null>(null);
const demoMode = ref(false);
const receitas = ref<FinanceTransaction[]>([]);
const despesas = ref<FinanceTransaction[]>([]);
const goals = ref<FinanceGoal[]>([]);
const authLoading = ref(true);
const authSubmitting = ref(false);
const dataLoading = ref(false);
const formSubmitting = ref(false);
const authMode = ref<'login' | 'signup'>('login');
const currentSection = ref<Section>('dashboard');
const darkMode = ref(false);
const transactionModalOpen = ref(false);
const goalModalOpen = ref(false);
const editingTransactionId = ref<string | null>(null);
const editingGoalId = ref<string | null>(null);
const noticeMessage = ref('');
const noticeType = ref<'success' | 'error'>('success');
const authForm = reactive({ email: '', password: '' });
const transactionForm = reactive<TransactionForm>({
  type: 'expense',
  descricao: '',
  valor: '',
  categoria: '',
  data: today,
});
const goalForm = reactive<GoalForm>({
  descricao: '',
  valor_alvo: '',
  valor_atual: '0',
  prazo: '',
});
const transactionCategories = computed(() =>
  transactionForm.type === 'income' ? incomeCategories : expenseCategoryOptions,
);
let authSubscription: { unsubscribe: () => void } | undefined;

watch(
  () => transactionForm.type,
  () => {
    if (!transactionCategories.value.includes(transactionForm.categoria)) {
      transactionForm.categoria = '';
    }
  },
);

const filteredReceitas = computed(() => filterByMonth(receitas.value, selectedMonth.value));
const filteredDespesas = computed(() => filterByMonth(despesas.value, selectedMonth.value));
const metrics = computed(() => getDashboardMetrics(filteredReceitas.value, filteredDespesas.value));
const currentMonthLabel = computed(() => {
  const date = new Date(`${selectedMonth.value}-01T00:00:00`);
  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
});
const sectionTitle = computed(
  () =>
    ({
      dashboard: 'Sua vida financeira, em equilíbrio.',
      transactions: 'Todos os seus lançamentos.',
      goals: 'Planos que saem do papel.',
    })[currentSection.value],
);
const sectionSubtitle = computed(
  () =>
    ({
      dashboard: 'Um olhar simples e claro sobre o que entra e o que sai.',
      transactions: 'Receitas e despesas organizadas em um só lugar.',
      goals: 'Acompanhe cada passo até chegar onde você quer.',
    })[currentSection.value],
);
const categoryTotals = computed(() => {
  const values = filteredDespesas.value.reduce<Record<string, number>>((totals, item) => {
    totals[item.categoria] = (totals[item.categoria] ?? 0) + Number(item.valor);
    return totals;
  }, {});
  return Object.entries(values).sort(([, a], [, b]) => b - a);
});
const expenseChartSeries = computed(() => categoryTotals.value.map(([, value]) => value));
const expenseCategories = computed(() =>
  categoryTotals.value.map(([name, value], index) => ({
    name,
    value,
    color: categoryColors[index % categoryColors.length],
  })),
);
const expenseChartOptions = computed<ApexOptions>(() => ({
  chart: { background: 'transparent', fontFamily: 'inherit' },
  labels: categoryTotals.value.map(([name]) => name),
  colors: categoryTotals.value.map((_, index) => categoryColors[index % categoryColors.length]),
  legend: { show: false },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  plotOptions: { pie: { donut: { size: '72%' } } },
  tooltip: { y: { formatter: (value) => formatCurrency(Number(value)) } },
}));
const chartMonths = computed(() => {
  const [year, month] = selectedMonth.value.split('-').map(Number);
  return Array.from({ length: 6 }, (_, index) => new Date(year, month - 6 + index, 1));
});
const chartMonthLabels = computed(() =>
  chartMonths.value.map((date) => new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '')),
);
const monthlyChartSeries = computed(() => [
  {
    name: 'Receitas',
    data: chartMonths.value.map((date) => {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return receitas.value
        .filter((item) => item.data.startsWith(month))
        .reduce((total, item) => total + Number(item.valor), 0);
    }),
  },
  {
    name: 'Despesas',
    data: chartMonths.value.map((date) => {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return despesas.value
        .filter((item) => item.data.startsWith(month))
        .reduce((total, item) => total + Number(item.valor), 0);
    }),
  },
]);
const monthlyChartOptions = computed<ApexOptions>(() => ({
  chart: { type: 'bar', background: 'transparent', fontFamily: 'inherit', toolbar: { show: false } },
  colors: ['#688b78', '#e7a65a'],
  plotOptions: { bar: { borderRadius: 5, columnWidth: '43%' } },
  dataLabels: { enabled: false },
  grid: { borderColor: darkMode.value ? '#303d3a' : '#edf0ed', strokeDashArray: 4 },
  legend: { show: false },
  xaxis: {
    categories: chartMonthLabels.value,
    labels: { style: { colors: darkMode.value ? '#aab8b2' : '#7b8880' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: darkMode.value ? '#aab8b2' : '#7b8880' } } },
  tooltip: { y: { formatter: (value) => formatCurrency(Number(value)) } },
}));
const allTransactions = computed(() => [
  ...receitas.value.map((item) => ({ ...item, type: 'income' as const })),
  ...despesas.value.map((item) => ({ ...item, type: 'expense' as const })),
]);
const filteredTransactions = computed(() =>
  allTransactions.value
    .filter((item) => item.data.startsWith(selectedMonth.value))
    .sort((a, b) => b.data.localeCompare(a.data)),
);
const recentTransactions = computed(() => filteredTransactions.value.slice(0, 5));

function notify(message: string, type: 'success' | 'error' = 'success') {
  noticeType.value = type;
  noticeMessage.value = message;
}

function clearFinanceData() {
  receitas.value = [];
  despesas.value = [];
  goals.value = [];
}

async function loadFinance() {
  if (demoMode.value) {
    dataLoading.value = true;
    try {
      const data = parseDemoData(localStorage.getItem(DEMO_STORAGE_KEY));
      if (!data) throw new Error('Os dados da demonstração não foram encontrados. Inicie uma nova demonstração.');
      applyDemoData(data);
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Não foi possível carregar os dados da demonstração.', 'error');
      return false;
    } finally {
      dataLoading.value = false;
    }
  }

  const client = supabase;
  const currentUser = user.value;
  if (!client || !currentUser) return false;

  dataLoading.value = true;
  try {
    const [incomeResult, expenseResult, goalsResult] = await Promise.all([
      client.from('receitas').select('*').eq('user_id', currentUser.id).order('data', { ascending: false }),
      client.from('despesas').select('*').eq('user_id', currentUser.id).order('data', { ascending: false }),
      client.from('metas').select('*').eq('user_id', currentUser.id).order('prazo', { ascending: true }),
    ]);

    if (incomeResult.error) throw incomeResult.error;
    if (expenseResult.error) throw expenseResult.error;
    if (goalsResult.error) throw goalsResult.error;

    receitas.value = (incomeResult.data ?? []) as FinanceTransaction[];
    despesas.value = (expenseResult.data ?? []) as FinanceTransaction[];
    goals.value = (goalsResult.data ?? []) as FinanceGoal[];
    return true;
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível carregar seus dados financeiros.', 'error');
    return false;
  } finally {
    dataLoading.value = false;
  }
}

function applyDemoData(data: DemoData) {
  receitas.value = data.receitas;
  despesas.value = data.despesas;
  goals.value = data.metas;
}

function saveDemoData(data: DemoData) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
}

async function startDemo() {
  try {
    let data = parseDemoData(localStorage.getItem(DEMO_STORAGE_KEY));
    if (!data) {
      data = createDemoData();
      saveDemoData(data);
    }

    demoMode.value = true;
    user.value = null;
    currentSection.value = 'dashboard';
    const loaded = await loadFinance();
    if (loaded) notify('Demonstração iniciada. Explore os lançamentos, as metas e o tema escuro.');
    else demoMode.value = false;
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível iniciar a demonstração.', 'error');
  }
}

async function submitAuth() {
  const client = supabase;
  if (!client) {
    notify('O Supabase não está configurado. Use “Experimentar em modo demonstração” para conhecer o app.');
    return;
  }

  const email = authForm.email.trim();
  if (!email || authForm.password.length < 6) {
    notify('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.', 'error');
    return;
  }

  authSubmitting.value = true;
  try {
    const result =
      authMode.value === 'login'
        ? await client.auth.signInWithPassword({ email, password: authForm.password })
        : await client.auth.signUp({ email, password: authForm.password });

    if (result.error) {
      notify(result.error.message, 'error');
    } else if (authMode.value === 'signup' && !result.data.session) {
      notify('Conta criada. Confirme seu e-mail antes de fazer login.');
      authMode.value = 'login';
    } else {
      authForm.password = '';
      notify(authMode.value === 'signup' ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!');
    }
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível autenticar. Tente novamente.', 'error');
  } finally {
    authSubmitting.value = false;
  }
}

function toggleAuthMode() {
  authMode.value = authMode.value === 'login' ? 'signup' : 'login';
  noticeMessage.value = '';
}

async function signOut() {
  if (demoMode.value) {
    demoMode.value = false;
    clearFinanceData();
    currentSection.value = 'dashboard';
    notify('Você saiu do modo demonstração. Seus dados continuam salvos neste navegador.');
    return;
  }

  const client = supabase;
  if (!client) return;
  try {
    const { error } = await client.auth.signOut();
    if (error) notify(error.message, 'error');
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível sair da conta.', 'error');
  }
}

function toggleTheme() {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark', darkMode.value);
  document.documentElement.classList.toggle('ion-palette-dark', darkMode.value);
  try {
    localStorage.setItem('finance-dark-mode', String(darkMode.value));
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível salvar sua preferência de tema.', 'error');
  }
}

function resetTransactionForm() {
  editingTransactionId.value = null;
  Object.assign(transactionForm, {
    type: 'expense',
    descricao: '',
    valor: '',
    categoria: '',
    data: today,
  });
}

function openNewTransaction() {
  resetTransactionForm();
  transactionModalOpen.value = true;
}

function closeTransactionModal() {
  transactionModalOpen.value = false;
  resetTransactionForm();
}

function editTransaction(transaction: FinanceTransaction, type: TransactionType) {
  editingTransactionId.value = transaction.id;
  Object.assign(transactionForm, {
    type,
    descricao: transaction.descricao,
    valor: String(transaction.valor),
    categoria: transaction.categoria,
    data: transaction.data,
  });
  transactionModalOpen.value = true;
}

async function saveTransaction() {
  const client = supabase;
  const currentUser = user.value;
  const amount = Number(transactionForm.valor);
  if (!demoMode.value && (!client || !currentUser)) return;
  if (
    !transactionForm.descricao.trim() ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !transactionFormCategoriesValid() ||
    !transactionForm.data
  ) {
    notify('Confira a descrição, o valor e a data do lançamento.', 'error');
    return;
  }

  formSubmitting.value = true;
  try {
    const wasEditing = Boolean(editingTransactionId.value);
    const table = transactionForm.type === 'income' ? 'receitas' : 'despesas';
    const values = {
      descricao: transactionForm.descricao.trim(),
      valor: amount,
      categoria: transactionForm.categoria,
      data: transactionForm.data,
    };

    if (demoMode.value) {
      const data = parseDemoData(localStorage.getItem(DEMO_STORAGE_KEY));
      if (!data) throw new Error('Os dados da demonstração não foram encontrados. Inicie uma nova demonstração.');
      const transactions = data[table];
      if (editingTransactionId.value) {
        const index = transactions.findIndex((item) => item.id === editingTransactionId.value);
        if (index === -1) throw new Error('O lançamento não foi encontrado.');
        transactions[index] = { ...transactions[index], ...values };
      } else {
        transactions.push({ id: `demo-${crypto.randomUUID()}`, ...values });
      }
      saveDemoData(data);
    } else {
      if (!client || !currentUser) return;
      const result = editingTransactionId.value
        ? await client.from(table).update(values).eq('id', editingTransactionId.value).eq('user_id', currentUser.id)
        : await client.from(table).insert({ ...values, user_id: currentUser.id });
      if (result.error) throw result.error;
    }

    closeTransactionModal();
    if (await loadFinance()) notify(wasEditing ? 'Lançamento atualizado.' : 'Lançamento adicionado.');
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível salvar o lançamento.', 'error');
  } finally {
    formSubmitting.value = false;
  }
}

function transactionFormCategoriesValid(): boolean {
  return transactionCategories.value.includes(transactionForm.categoria);
}

async function deleteTransaction(transaction: FinanceTransaction, type: TransactionType) {
  const client = supabase;
  const currentUser = user.value;
  if (
    (!demoMode.value && (!client || !currentUser)) ||
    !window.confirm(`Excluir o lançamento "${transaction.descricao}"?`)
  ) {
    return;
  }

  try {
    const table = type === 'income' ? 'receitas' : 'despesas';
    if (demoMode.value) {
      const data = parseDemoData(localStorage.getItem(DEMO_STORAGE_KEY));
      if (!data) throw new Error('Os dados da demonstração não foram encontrados. Inicie uma nova demonstração.');
      data[table] = data[table].filter((item) => item.id !== transaction.id);
      saveDemoData(data);
    } else {
      if (!client || !currentUser) return;
      const { error } = await client.from(table).delete().eq('id', transaction.id).eq('user_id', currentUser.id);
      if (error) throw error;
    }

    if (await loadFinance()) notify('Lançamento excluído.');
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível excluir o lançamento.', 'error');
  }
}

function resetGoalForm() {
  editingGoalId.value = null;
  Object.assign(goalForm, { descricao: '', valor_alvo: '', valor_atual: '0', prazo: '' });
}

function openNewGoal() {
  resetGoalForm();
  goalModalOpen.value = true;
}

function closeGoalModal() {
  goalModalOpen.value = false;
  resetGoalForm();
}

function editGoal(goal: FinanceGoal) {
  editingGoalId.value = goal.id;
  Object.assign(goalForm, {
    descricao: goal.descricao,
    valor_alvo: String(goal.valor_alvo),
    valor_atual: String(goal.valor_atual),
    prazo: goal.prazo,
  });
  goalModalOpen.value = true;
}

async function saveGoal() {
  const client = supabase;
  const currentUser = user.value;
  const target = Number(goalForm.valor_alvo);
  const current = Number(goalForm.valor_atual);
  if (!demoMode.value && (!client || !currentUser)) return;
  if (
    !goalForm.descricao.trim() ||
    !Number.isFinite(target) ||
    target <= 0 ||
    !Number.isFinite(current) ||
    current < 0 ||
    !goalForm.prazo
  ) {
    notify('Confira o nome, os valores e o prazo da meta.', 'error');
    return;
  }

  formSubmitting.value = true;
  try {
    const values = {
      descricao: goalForm.descricao.trim(),
      valor_alvo: target,
      valor_atual: current,
      prazo: goalForm.prazo,
    };
    if (demoMode.value) {
      const data = parseDemoData(localStorage.getItem(DEMO_STORAGE_KEY));
      if (!data) throw new Error('Os dados da demonstração não foram encontrados. Inicie uma nova demonstração.');
      if (editingGoalId.value) {
        const index = data.metas.findIndex((item) => item.id === editingGoalId.value);
        if (index === -1) throw new Error('A meta não foi encontrada.');
        data.metas[index] = { ...data.metas[index], ...values };
      } else {
        data.metas.push({ id: `demo-${crypto.randomUUID()}`, ...values });
      }
      saveDemoData(data);
    } else {
      if (!client || !currentUser) return;
      const result = editingGoalId.value
        ? await client.from('metas').update(values).eq('id', editingGoalId.value).eq('user_id', currentUser.id)
        : await client.from('metas').insert({ ...values, user_id: currentUser.id });
      if (result.error) throw result.error;
    }
    const wasEditing = Boolean(editingGoalId.value);
    closeGoalModal();
    if (await loadFinance()) notify(wasEditing ? 'Meta atualizada.' : 'Meta criada.');
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível salvar a meta.', 'error');
  } finally {
    formSubmitting.value = false;
  }
}

async function deleteGoal(goal: FinanceGoal) {
  const client = supabase;
  const currentUser = user.value;
  if ((!demoMode.value && (!client || !currentUser)) || !window.confirm(`Excluir a meta "${goal.descricao}"?`)) {
    return;
  }

  try {
    if (demoMode.value) {
      const data = parseDemoData(localStorage.getItem(DEMO_STORAGE_KEY));
      if (!data) throw new Error('Os dados da demonstração não foram encontrados. Inicie uma nova demonstração.');
      data.metas = data.metas.filter((item) => item.id !== goal.id);
      saveDemoData(data);
    } else {
      if (!client || !currentUser) return;
      const { error } = await client.from('metas').delete().eq('id', goal.id).eq('user_id', currentUser.id);
      if (error) throw error;
    }

    if (await loadFinance()) notify('Meta excluída.');
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível excluir a meta.', 'error');
  }
}

function goalProgress(goal: FinanceGoal): number {
  return goal.valor_alvo > 0 ? (goal.valor_atual / goal.valor_alvo) * 100 : 0;
}

onMounted(async () => {
  try {
    darkMode.value = localStorage.getItem('finance-dark-mode') === 'true';
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível carregar sua preferência de tema.', 'error');
  }
  document.documentElement.classList.toggle('dark', darkMode.value);
  document.documentElement.classList.toggle('ion-palette-dark', darkMode.value);

  const client = supabase;
  if (!client) {
    authLoading.value = false;
    return;
  }

  const { data } = client.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null;
    if (!session) clearFinanceData();
    if (event === 'SIGNED_IN' && session) window.setTimeout(() => void loadFinance(), 0);
  });
  authSubscription = data.subscription;

  try {
    const { data: sessionData, error } = await client.auth.getSession();
    if (error) throw error;
    user.value = sessionData.session?.user ?? null;
    if (user.value) await loadFinance();
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Não foi possível recuperar sua sessão.', 'error');
  } finally {
    authLoading.value = false;
  }
});

onUnmounted(() => authSubscription?.unsubscribe());
</script>

<style>
:root {
  --page-bg: #f5f7f4;
  --surface: #ffffff;
  --surface-soft: #f8faf8;
  --text-primary: #24352e;
  --text-secondary: #718078;
  --border: #e8ede8;
  --green: #567d68;
  --green-dark: #3d634f;
  --green-light: #edf4ef;
  --red: #c97768;
  --purple: #897caf;
  --orange: #d99751;
  --shadow: 0 7px 26px rgb(34 53 44 / 4%);
}

html.dark {
  --page-bg: #18211e;
  --surface: #202b27;
  --surface-soft: #26332e;
  --text-primary: #edf3ee;
  --text-secondary: #a4b2aa;
  --border: #35423c;
  --green: #8db59a;
  --green-dark: #a5c9ad;
  --green-light: #293d32;
  --red: #ed9888;
  --purple: #b7a9e0;
  --orange: #edb672;
  --shadow: 0 7px 26px rgb(0 0 0 / 12%);
  color-scheme: dark;
}

body {
  color: var(--text-primary);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

ion-app,
ion-content,
ion-toolbar {
  --background: var(--page-bg);
  --color: var(--text-primary);
  color: var(--text-primary);
}

ion-header {
  box-shadow: none;
}

ion-toolbar {
  --min-height: 76px;
  --padding-start: 28px;
  --padding-end: 28px;
}

.app-header {
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.app-header ion-toolbar {
  --background: var(--surface);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  height: 76px;
  margin: 0 auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--text-primary);
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.8px;
  text-decoration: none;
}

.brand-mark,
.summary-icon,
.panel-icon,
.transaction-icon,
.insight-icon,
.goal-icon,
.stat-icon,
.empty-icon,
.tip-icon,
.goals-intro-icon {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
}

.brand-mark {
  width: 37px;
  height: 37px;
  border-radius: 12px;
  background: var(--green);
  color: #fff;
  font-size: 19px;
}

.brand-accent {
  color: var(--green);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-email {
  margin-right: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.icon-button {
  display: inline-grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 19px;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.icon-button:hover {
  background: var(--surface-soft);
  color: var(--green);
}

.delete-button:hover {
  background: #faeeec;
  color: var(--red);
}

.app-shell {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 34px;
  max-width: 1440px;
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  padding: 34px 32px 64px;
}

.sidebar {
  display: flex;
  position: sticky;
  top: 24px;
  align-self: start;
  flex-direction: column;
  gap: 8px;
  min-height: calc(100vh - 150px);
}

.sidebar-label {
  margin: 4px 0 9px 12px;
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.2px;
}

.sidebar > button {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 13px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  text-align: left;
}

.sidebar > button ion-icon {
  font-size: 18px;
}

.sidebar > button.active {
  background: var(--green-light);
  color: var(--green-dark);
  font-weight: 650;
}

.sidebar-tip {
  margin-top: auto;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
}

.tip-icon {
  width: 31px;
  height: 31px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: #fff4e7;
  color: var(--orange);
  font-size: 17px;
}

.sidebar-tip strong {
  display: block;
  font-size: 12px;
}

.sidebar-tip p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.5;
}

.sidebar > button.sidebar-theme {
  margin-top: 12px;
  border-top: 1px solid var(--border);
  border-radius: 0 0 12px 12px;
}

.main-content {
  min-width: 0;
}

.demo-banner {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 17px;
  padding: 11px 13px;
  border: 1px solid #eddfc9;
  border-radius: 11px;
  background: #fff9ef;
  color: #765d39;
  font-size: 11px;
  line-height: 1.5;
}

.demo-banner ion-icon {
  flex: 0 0 auto;
  font-size: 16px;
}

.demo-banner strong {
  font-weight: 700;
}

.dark .demo-banner {
  border-color: #66573e;
  background: #352f24;
  color: #e5cd9f;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 4px 0 23px;
}

.eyebrow {
  color: var(--green);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}

.page-heading h1 {
  margin: 8px 0 5px;
  color: var(--text-primary);
  font-size: clamp(21px, 2.4vw, 29px);
  font-weight: 700;
  letter-spacing: -0.9px;
  line-height: 1.2;
}

.page-heading p,
.panel-heading p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 11px;
  background: var(--green);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--green-dark);
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.heading-action ion-icon {
  font-size: 17px;
}

.period-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  color: var(--text-secondary);
  font-size: 12px;
}

.period-row input {
  width: auto;
  min-width: 145px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--surface);
  color: var(--text-primary);
  font: inherit;
}

.transaction-count {
  margin-left: auto;
  color: var(--text-secondary);
  font-size: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.summary-card,
.panel {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.summary-card {
  display: flex;
  min-height: 154px;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
}

.summary-icon {
  width: 35px;
  height: 35px;
  margin-bottom: 13px;
  border-radius: 11px;
  background: var(--green-light);
  color: var(--green);
  font-size: 18px;
}

.income-icon {
  background: #edf5ef;
  color: #5c946e;
}

.expense-icon {
  background: #fff3e7;
  color: #d3904e;
}

.summary-label {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 550;
}

.summary-card > strong {
  margin: 6px 0 3px;
  color: var(--text-primary);
  font-size: clamp(19px, 2vw, 24px);
  font-weight: 720;
  letter-spacing: -0.6px;
}

.summary-card small {
  color: var(--text-secondary);
  font-size: 10px;
}

.balance-card {
  border-color: transparent;
  background: #3c634f;
}

.balance-card .summary-icon {
  background: rgb(255 255 255 / 13%);
  color: #fff;
}

.balance-card .summary-label,
.balance-card small,
.balance-card > strong {
  color: #fff;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.3fr);
  gap: 15px;
  margin-top: 16px;
}

.chart-panel {
  min-width: 0;
  padding: 18px 19px 14px;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.panel-heading h2 {
  margin: 0 0 5px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 680;
}

.panel-heading p {
  font-size: 10px;
}

.panel-icon {
  width: 33px;
  height: 33px;
  border-radius: 10px;
  background: var(--surface-soft);
  color: var(--green);
  font-size: 17px;
}

.chart-wrap {
  width: 100%;
  min-height: 250px;
  margin-top: 7px;
}

.chart-empty {
  display: flex;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px;
  text-align: center;
}

.empty-icon {
  width: 46px;
  height: 46px;
  border-radius: 15px;
  background: var(--green-light);
  color: var(--green);
  font-size: 21px;
}

.chart-empty strong {
  font-size: 12px;
}

.chart-empty > span:last-child {
  max-width: 245px;
  color: var(--text-secondary);
  font-size: 10px;
  line-height: 1.5;
}

.category-legend {
  display: grid;
  gap: 9px;
  padding: 0 3px 4px;
}

.category-legend > div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 10px;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.category-legend strong {
  margin-left: auto;
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 600;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 19px;
  margin-top: -6px;
  color: var(--text-secondary);
  font-size: 10px;
}

.chart-legend > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.income-dot {
  background: #688b78;
}

.expense-dot {
  background: #e7a65a;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin-top: 16px;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 91px;
  padding: 14px;
}

.insight-icon {
  width: 37px;
  height: 37px;
  border-radius: 12px;
  background: var(--green-light);
  color: var(--green);
  font-size: 18px;
}

.insight-purple {
  background: #f0eef8;
  color: var(--purple);
}

.insight-orange {
  background: #fff3e7;
  color: var(--orange);
}

.insight-card > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.insight-card strong {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.insight-card small {
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-panel,
.transactions-panel {
  margin-top: 16px;
  padding: 18px 19px 5px;
}

.text-button {
  padding: 8px 0 8px 8px;
  border: 0;
  background: transparent;
  color: var(--green);
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.transaction-list {
  margin-top: 13px;
}

.transaction-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 65px;
  border-top: 1px solid var(--border);
}

.transaction-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  font-size: 17px;
}

.transaction-description {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.transaction-description strong {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 620;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-description > span {
  color: var(--text-secondary);
  font-size: 10px;
}

.transaction-value {
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.transaction-value.income {
  color: #568666;
}

.transaction-value.expense {
  color: var(--text-primary);
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 1px;
}

.row-actions .icon-button {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.empty-list {
  padding: 30px 12px;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 11px;
  text-align: center;
}

.goals-intro {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 17px;
  padding: 17px;
  border: 1px solid #e8eee8;
  border-radius: 15px;
  background: var(--green-light);
}

.goals-intro-icon {
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: var(--surface);
  color: var(--green);
  font-size: 20px;
}

.goals-intro strong {
  font-size: 12px;
}

.goals-intro p {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 10px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 15px;
}

.goal-card {
  padding: 17px;
}

.goal-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goal-icon {
  width: 37px;
  height: 37px;
  border-radius: 12px;
  background: var(--green-light);
  color: var(--green);
  font-size: 18px;
}

.goal-card h2 {
  margin: 16px 0 5px;
  color: var(--text-primary);
  font-size: 14px;
}

.goal-deadline {
  margin: 0;
  color: var(--text-secondary);
  font-size: 10px;
}

.goal-amounts {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-top: 22px;
}

.goal-amounts strong {
  color: var(--text-primary);
  font-size: 18px;
}

.goal-amounts span {
  color: var(--text-secondary);
  font-size: 10px;
}

.progress-track {
  overflow: hidden;
  height: 7px;
  margin-top: 10px;
  border-radius: 9px;
  background: var(--surface-soft);
}

.progress-track > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--green);
  transition: width 0.25s ease;
}

.goal-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 9px;
  color: var(--text-secondary);
  font-size: 9px;
}

.goal-complete {
  color: var(--green);
}

.goals-empty {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  text-align: center;
}

.goals-empty h2 {
  margin: 15px 0 5px;
  font-size: 15px;
}

.goals-empty p {
  max-width: 340px;
  margin: 0 0 17px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.6;
}

.loading-screen {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 13px;
  color: var(--text-secondary);
  font-size: 12px;
}

.loading-screen ion-spinner,
.loading-inline ion-spinner {
  color: var(--green);
}

.loading-inline {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 36px;
  color: var(--text-secondary);
  font-size: 12px;
}

.notice {
  display: flex;
  position: fixed;
  z-index: 20;
  top: 18px;
  right: 20px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  max-width: min(420px, calc(100vw - 32px));
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: var(--shadow);
  color: var(--text-primary);
  font-size: 11px;
}

.notice-error {
  border-color: #e7c2bb;
  color: #a94e40;
}

.notice button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 17px;
}

.auth-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  min-height: 100vh;
  background: var(--surface);
}

.auth-intro {
  display: flex;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 42px clamp(35px, 7vw, 110px);
  background: #315640;
  color: #fff;
}

.brand-light {
  position: relative;
  z-index: 1;
  color: #fff;
}

.brand-light .brand-mark {
  background: rgb(255 255 255 / 14%);
}

.brand-light .brand-accent {
  color: #b3d2b9;
}

.auth-pitch {
  position: relative;
  z-index: 1;
  max-width: 470px;
  margin: 45px auto;
}

.auth-pitch .eyebrow {
  color: #bed4c4;
}

.auth-pitch h1 {
  margin: 17px 0 14px;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 650;
  letter-spacing: -2.6px;
  line-height: 1.1;
}

.auth-pitch > p {
  max-width: 370px;
  color: #d3e2d7;
  font-size: 14px;
  line-height: 1.7;
}

.pitch-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 42px;
}

.stat-icon {
  width: 41px;
  height: 41px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 13px;
  background: rgb(255 255 255 / 8%);
  color: #d6e8d8;
  font-size: 20px;
}

.pitch-stat > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pitch-stat strong {
  font-size: 12px;
}

.pitch-stat small {
  color: #c1d5c7;
  font-size: 10px;
}

.auth-decoration {
  position: absolute;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 50%;
}

.decoration-one {
  top: 20%;
  right: -200px;
  width: 500px;
  height: 500px;
}

.decoration-two {
  top: 27%;
  right: -135px;
  width: 370px;
  height: 370px;
}

.auth-panel {
  display: grid;
  place-items: center;
  padding: 35px;
  background: var(--surface);
}

.auth-card {
  width: min(100%, 380px);
}

.auth-card h2 {
  margin: 10px 0 5px;
  font-size: 25px;
  letter-spacing: -0.8px;
}

.muted-copy {
  margin: 0 0 28px;
  color: var(--text-secondary);
  font-size: 12px;
}

.field-label {
  display: block;
  margin: 16px 0 7px;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 620;
}

.auth-card input,
.modal-form input,
.modal-form select {
  box-sizing: border-box;
  width: 100%;
  min-height: 43px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  background: var(--surface);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.auth-card input::placeholder,
.modal-form input::placeholder {
  color: #aab4ae;
}

.auth-card input:focus,
.modal-form input:focus,
.modal-form select:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgb(86 125 104 / 12%);
}

.auth-submit {
  width: 100%;
  min-height: 45px;
  margin-top: 22px;
}

.auth-submit ion-spinner {
  width: 17px;
  height: 17px;
  color: #fff;
}

.auth-switch {
  margin: 18px 0;
  color: var(--text-secondary);
  font-size: 11px;
  text-align: center;
}

.auth-switch button {
  border: 0;
  background: transparent;
  color: var(--green);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.auth-switch button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.demo-button {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  border: 1px solid var(--green);
  border-radius: 11px;
  background: transparent;
  color: var(--green-dark);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  transition: background 0.18s ease;
}

.demo-button:hover:not(:disabled) {
  background: var(--green-light);
}

.demo-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.setup-notice {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 20px;
  padding: 13px;
  border: 1px solid #eddfc9;
  border-radius: 11px;
  background: #fff9ef;
  color: #765d39;
  font-size: 10px;
  line-height: 1.5;
}

.setup-notice code {
  font-size: 10px;
}

.dark .setup-notice {
  border-color: #66573e;
  background: #352f24;
  color: #e5cd9f;
}

.modal-card {
  max-height: 90vh;
  overflow-y: auto;
  padding: 26px;
  background: var(--surface);
  color: var(--text-primary);
}

.modal-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.modal-heading h2 {
  margin: 6px 0 0;
  font-size: 20px;
  letter-spacing: -0.5px;
}

.modal-form {
  padding-top: 5px;
}

.modal-form .field-label {
  margin-top: 13px;
}

.modal-form select {
  appearance: none;
}

.modal-submit {
  width: 100%;
  margin-top: 21px;
}

ion-modal {
  --width: min(460px, calc(100% - 28px));
  --height: auto;
  --max-height: 90vh;
  --border-radius: 18px;
  --background: var(--surface);
}

@media (max-width: 1000px) {
  .app-shell {
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 22px;
    padding-right: 22px;
    padding-left: 22px;
  }

  .summary-grid,
  .insight-grid {
    gap: 10px;
  }

  .summary-card {
    padding: 15px;
  }
}

@media (max-width: 760px) {
  ion-toolbar {
    --padding-start: 15px;
    --padding-end: 15px;
  }

  .topbar {
    height: 65px;
  }

  .user-email {
    display: none;
  }

  .app-shell {
    display: flex;
    min-height: calc(100vh - 65px);
    flex-direction: column;
    gap: 17px;
    padding: 18px 15px 36px;
  }

  .sidebar {
    position: static;
    flex-direction: row;
    gap: 5px;
    min-height: auto;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .sidebar-label,
  .sidebar-tip,
  .sidebar > button.sidebar-theme {
    display: none;
  }

  .sidebar > button {
    flex: 0 0 auto;
    gap: 7px;
    min-height: 40px;
    padding: 0 10px;
    font-size: 10px;
    white-space: nowrap;
  }

  .sidebar > button ion-icon {
    font-size: 16px;
  }

  .page-heading {
    align-items: flex-start;
    margin: 0 0 16px;
  }

  .page-heading h1 {
    max-width: 420px;
    font-size: 21px;
  }

  .page-heading p {
    max-width: 370px;
    font-size: 10px;
    line-height: 1.5;
  }

  .heading-action {
    min-height: 39px;
    padding: 0 11px;
    font-size: 10px;
    white-space: nowrap;
  }

  .heading-action ion-icon {
    font-size: 16px;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-card {
    min-height: 139px;
    padding: 14px;
  }

  .summary-card:first-child {
    grid-column: span 2;
    min-height: 125px;
  }

  .summary-card > strong {
    font-size: 20px;
  }

  .chart-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 12px;
  }

  .chart-panel {
    padding: 15px;
  }

  .insight-grid {
    grid-template-columns: 1fr;
    gap: 9px;
    margin-top: 12px;
  }

  .insight-card {
    min-height: 74px;
  }

  .recent-panel,
  .transactions-panel {
    margin-top: 12px;
    padding: 15px 13px 3px;
  }

  .transaction-row {
    gap: 8px;
    min-height: 62px;
  }

  .transaction-icon {
    width: 32px;
    height: 32px;
    font-size: 15px;
  }

  .transaction-value {
    font-size: 10px;
  }

  .row-actions .icon-button {
    width: 28px;
    height: 30px;
  }

  .goals-grid {
    grid-template-columns: 1fr;
  }

  .auth-layout {
    grid-template-columns: 1fr;
  }

  .auth-intro {
    min-height: 275px;
    padding: 24px;
  }

  .auth-pitch {
    margin: 36px 0 3px;
  }

  .auth-pitch h1 {
    margin: 10px 0;
    font-size: 36px;
  }

  .auth-pitch > p {
    max-width: 350px;
    margin: 0;
    font-size: 12px;
  }

  .pitch-stat {
    display: none;
  }

  .decoration-one {
    top: -150px;
    right: -260px;
  }

  .decoration-two {
    top: -90px;
    right: -200px;
  }

  .auth-panel {
    padding: 30px 22px 45px;
  }
}

@media (max-width: 420px) {
  .heading-action span {
    display: none;
  }

  .heading-action {
    width: 39px;
    padding: 0;
  }

  .page-heading h1 {
    font-size: 18px;
  }

  .period-row {
    font-size: 10px;
  }

  .period-row input {
    min-width: 130px;
  }

  .transaction-description strong {
    max-width: 104px;
  }

  .transaction-description > span {
    font-size: 9px;
  }

  .transaction-row {
    gap: 6px;
  }
}
</style>
