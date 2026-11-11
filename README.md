# Finança Clara

## Identificação

- **Nome:** Isabella Saberkow
- **Turma:** 3º ano de Informática para Web

## Explicação do projeto

O Finança Clara é um aplicativo mobile-first de controle financeiro pessoal. Com ele, cada pessoa pode registrar e organizar receitas e despesas, acompanhar o saldo e visualizar sua vida financeira em um dashboard.

O aplicativo oferece cadastro, login e logout; criação, consulta, edição e exclusão de receitas e despesas; e um dashboard com totais, saldo, maior categoria de gastos, quantidade de lançamentos e comparação das despesas com as receitas. Os gráficos apresentam gastos por categoria e receitas e despesas ao longo dos meses. Como funcionalidades extras, permite criar e acompanhar metas financeiras e ativar um tema escuro que fica salvo no dispositivo.

Os dados ficam armazenados no Supabase e são protegidos por políticas de segurança que limitam o acesso aos registros da própria pessoa usuária.

- Calcular os indicadores e agrupar os dados corretamente para exibir gráficos por categoria e por mês, respeitando o período selecionado.
- Adaptar os formulários, o dashboard e os gráficos a diferentes tamanhos de tela e manter o modo escuro entre visitas.
- Validar os cálculos financeiros e o fluxo de navegação com testes automatizados.

## Requisitos

- Node.js e npm
- Projeto Supabase

## Demonstração sem Supabase

Para experimentar o aplicativo sem configurar uma conta Supabase:

1. Inicie o projeto com `npm run dev`.
2. Na tela inicial, clique em **Experimentar em modo demonstração**.
3. Use o menu para abrir o dashboard, consultar e editar lançamentos, criar metas e ativar o tema escuro.

O modo demonstração usa dados fictícios e permite cadastrar, editar e excluir lançamentos e metas. As alterações ficam salvas somente no armazenamento local deste navegador; elas não são enviadas ao Supabase. Use **Sair** para retornar à tela inicial e, depois, clique novamente em **Experimentar em modo demonstração** para continuar a demonstração.

Para usar o login e salvar dados no Supabase, siga a configuração abaixo.

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
