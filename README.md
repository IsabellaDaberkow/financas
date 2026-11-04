# Finança Clara

Aplicativo mobile-first de finanças pessoais feito com Ionic Vue, Supabase e Vue ApexCharts. Permite cadastrar e acompanhar receitas, despesas e metas financeiras, com gráficos e tema escuro.

## Requisitos

- Node.js e npm
- Projeto Supabase

## Configuração

1. Instale as dependências com `npm install`.
2. No Supabase, abra **SQL Editor**, execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql) e confirme que as tabelas `receitas`, `despesas` e `metas` foram criadas.
3. Copie `.env.example` para `.env.local` e informe a URL do projeto e a chave **anon/public** em `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Não coloque uma chave `service_role` no aplicativo.
4. Reinicie o servidor depois de alterar as variáveis de ambiente.

```sh
npm run dev
```

O cadastro e o login usam Supabase Auth. Se a confirmação de e-mail estiver ativa no projeto, confirme o endereço antes de entrar.

## Funcionalidades

- Cadastro, login e logout com Supabase Auth.
- CRUD de receitas e despesas com descrição, valor, categoria e data.
- Dashboard com receitas, despesas, saldo, maior categoria de gasto, quantidade de lançamentos e percentual gasto sobre as receitas.
- Gráficos de distribuição por categoria e de receitas/despesas ao longo dos meses.
- Filtro mensal, metas financeiras editáveis e modo escuro persistido no dispositivo.
- Políticas de Row Level Security para que cada usuário acesse somente os próprios dados.

## Verificação

```sh
npm run build
npm run test:unit
```
