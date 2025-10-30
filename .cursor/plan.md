# 🧠 PLANO DE APRENDIZADO: OBSERVABILIDADE PARA SOFTWARE ENGINEERS

## 🎯 Objetivo final

> Criar e instrumentar aplicações (API e microserviços) aplicando **observabilidade completa** — *métricas, logs, traces, e alertas* — usando **OpenTelemetry + Grafana Stack** e comparando com alternativas de mercado.

---

## 🧩 FASE 1 — Fundamentos & Primeira Stack Local

### 🎯 Meta: Entender a base de observabilidade e montar seu primeiro pipeline completo.

### 🧱 Projeto 1: *Task Tracker API (NestJS + PostgreSQL)*

API simples com CRUD de tarefas e algumas rotas lentas propositalmente para gerar métricas.

#### 🧰 Stack

| Categoria              | Ferramenta                        |
| ---------------------- | --------------------------------- |
| Backend                | **NestJS**                        |
| DB                     | **PostgreSQL (Docker)**           |
| Métricas               | **Prometheus**                    |
| Logs                   | **Loki**                          |
| Traces                 | **Tempo**                         |
| Visualização e alertas | **Grafana**                       |
| Instrumentação         | **OpenTelemetry SDK + Collector** |

#### 🧠 Conceitos a dominar

* O que são *metrics, logs e traces* e como se complementam.
* Estrutura do **OTEL Collector** (receivers, processors, exporters).
* Exporters OTLP → Prometheus/Loki/Tempo.
* Criação de **dashboards Grafana** com PromQL e LogQL.
* Como gerar **traces distribuídos** no NestJS com `nestjs-otel`.
* Como criar alertas no Grafana (via “Alert Rules”).

#### 🧪 Resultados esperados

* Você acessa `http://localhost:3002/api/tasks` → vê métricas expostas pelo SDK em `http://localhost:9464/metrics`.
* Grafana exibe dashboards de latência, throughput e logs de erro.
* Tempo exibe o trace da requisição completa (controller → service → DB).
* Alerta dispara se `error_rate > 5%`.

#### ▶️ Como gerar dados de sinais (metrics/logs/traces)

* Suba a stack: `docker compose up -d --build`
* Gere carga (padrões: base=http://localhost:3002, 10 workers, ~30 RPS, 3 min):
  - `node scripts/load.js`
  - Parâmetros (opcionais): `BASE_URL`, `CONCURRENCY`, `RPS`, `DURATION_SEC`
  - Exemplo: `CONCURRENCY=20 RPS=60 DURATION_SEC=300 node scripts/load.js`
* Endpoints úteis:
  - API: `http://localhost:3002` (health em `/health`, docs em `/api/docs`)
  - Métricas (Prometheus scrape): `http://localhost:9464/metrics`
  - Prometheus: `http://localhost:9090`
  - Grafana: `http://localhost:3001` (admin/admin)

### ✅ Status atual (Fase 1)

- [x] Backend NestJS com CRUD e rotas lentas (inclui `/tasks/slow` e `/tasks/error-prone`)
- [x] PostgreSQL via Docker (serviço `postgres` na Compose)
- [x] OpenTelemetry SDK integrado no backend (traces, logs, métricas)
- [x] OpenTelemetry Collector configurado (recebe OTLP e exporta para Tempo e Loki)
- [x] Prometheus configurado para scrapes do backend em `backend:9464/metrics`
- [x] Loki configurado para agregação de logs
- [x] Tempo configurado para tracing distribuído (OTLP)
- [x] Grafana disponível em `http://localhost:3001`
- [x] Docker Compose orquestrando todos os serviços
- [x] Backend exposto em `http://localhost:3002`
- [x] Script de carga disponível em `scripts/load.js`
- [ ] Alertas do Grafana configurados (pendente)
- [ ] Dashboards customizados finais no Grafana (pendente)

---

## ⚙️ FASE 2 — Integração com Grafana Cloud (Observabilidade real)

### 🎯 Meta: Aprender pipeline remoto e monitoramento “as a service”.

### 🧱 Projeto 2: *Mesma API, mas com Grafana Cloud (free tier)*

Você vai usar o **OpenTelemetry Collector** para enviar dados para o Grafana Cloud.

#### 🧰 Stack

| Categoria             | Ferramenta                               |
| --------------------- | ---------------------------------------- |
| Backend               | **NestJS (com OTEL)**                    |
| Collector             | **OTEL Collector**                       |
| Observability backend | **Grafana Cloud (Mimir + Loki + Tempo)** |

#### 🧠 Conceitos a dominar

* Autenticação com tokens do Grafana Cloud.
* OTLP Exporters para endpoints remotos.
* Como configurar **dashboards prontos** do Grafana Cloud (Node.js, PostgreSQL).
* Configuração de **alertas por e-mail, Discord, Slack**.
* Latência, erro e uso de CPU da aplicação em tempo real.

#### 🧪 Resultados esperados

* Seu Grafana Cloud exibe as métricas e traces da aplicação rodando localmente.
* Alertas configurados em canais externos (ex: “API Error Rate > 10%”).

---

## 🧵 FASE 3 — Tracing distribuído (múltiplos serviços)

### 🎯 Meta: Entender **correlação entre serviços** e como o tracing se propaga.

### 🧱 Projeto 3: *Mini-sistema de pedidos (API Gateway + Orders + Payments)*

3 microserviços NestJS comunicando-se via HTTP ou mensageria (ex: RabbitMQ ou REST).

#### 🧰 Stack

| Categoria | Ferramenta                             |
| --------- | -------------------------------------- |
| Backend   | **NestJS (3 serviços)**                |
| Traces    | **OpenTelemetry SDK + Tempo / Jaeger** |
| Métricas  | **Prometheus / Grafana Cloud**         |
| Logs      | **Loki / Grafana Cloud**               |

#### 🧠 Conceitos a dominar

* Propagação de **trace context (W3C Trace Context)**.
* Como um trace é montado de múltiplos spans entre serviços.
* Como usar `@Span()` e `@OtelMethodCounter()` no NestJS.
* Identificar gargalos no trace waterfall (Tempo UI).
* Correlacionar logs ↔ traces ↔ métricas.

#### 🧪 Resultados esperados

* Você abre um trace no Grafana Tempo e vê toda a jornada:
  `API Gateway → Orders → Payments → PostgreSQL`.
* Cada serviço tem métricas e logs próprios, mas todos estão correlacionados.

---

## 🪵 FASE 4 — Comparações e Especialização

### 🎯 Meta: Aprender o “porquê” das stacks e comparar abordagens.

#### 📊 Projeto 4: *Log Analytics com ELK Stack*

Usar o mesmo app, mas coletar apenas logs estruturados e visualizá-los via Kibana.

| Categoria     | Ferramenta              |
| ------------- | ----------------------- |
| Coleta        | **Filebeat / Logstash** |
| Armazenamento | **Elasticsearch**       |
| Visualização  | **Kibana**              |

#### 🧠 Conceitos

* Indexação, busca e filtros textuais.
* Parsing e enriquecimento de logs.
* Diferença entre logs “estruturados” e “não estruturados”.
* Vantagens/desvantagens do ELK vs Loki.

---

### ☁️ Projeto 5: *Monitoring em nuvem com AWS CloudWatch + X-Ray*

Migrar o mesmo backend para a AWS (EC2 ou Lambda) e usar as ferramentas nativas.

| Categoria | Ferramenta          |
| --------- | ------------------- |
| Métricas  | **AWS CloudWatch**  |
| Traces    | **AWS X-Ray**       |
| Logs      | **CloudWatch Logs** |

#### 🧠 Conceitos

* Diferenças entre open source e vendor-locked stacks.
* Custos, retenção e alerting na AWS.
* Integração com OTEL Collector para exportar pra fora da AWS.

---

## 💼 FASE 5 — Projeto “Engineer-Level”

### 🎯 Meta: Consolidar tudo com uma arquitetura completa e documentada.

### 🧱 Projeto 6: *Sistema Observável End-to-End*

Combine:

* API (NestJS)
* Frontend (Next.js)
* Banco (PostgreSQL)
* OTEL + Grafana Cloud
* Alertas e dashboards organizados

#### 🧠 Entregáveis

* Dashboard “Golden Signals” (latência, tráfego, erros, saturação).
* Painel de tracing end-to-end (user → request → DB).
* Alertas configurados com thresholds e rotas.
* README explicando arquitetura e stack observability.

#### 💎 Resultado final

> Um repositório completo mostrando que você domina observabilidade profissional — nível que engenheiros de Cloud e DevOps usam em produção.
