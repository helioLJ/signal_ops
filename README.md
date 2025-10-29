# Signal Ops

A modern observability platform built with NestJS backend and open-source observability stack (Grafana LGTM + OpenTelemetry).

## Architecture

This project follows a **monorepo** structure:

```
/backend         → Main API (NestJS + OTEL)
/observability   → Prometheus, Loki, Tempo, Grafana, OTEL Collector configs
docker-compose.yml → Orchestrates all services
```

## Tech Stack

- **Backend**: NestJS with TypeScript (ES2022)
- **Observability**: 
  - Prometheus (metrics)
  - Loki (logs)
  - Tempo (traces)
  - Grafana (visualization)
  - OpenTelemetry (instrumentation)

## Development

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/helioLJ/signal_ops.git
cd signal_ops
```

2. Start the full observability stack:
```bash
docker compose up -d
```

3. Access services:
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Backend API: http://localhost:3001

### Development Workflow

- **Branching**: `main` (production), `dev` (development), `feature/*` (features)
- **Commits**: Follow [Conventional Commits](https://conventionalcommits.org/)
- **Testing**: `npm run test` (in backend directory)

## Project Structure

```
signal_ops/
├── backend/           # NestJS API
│   ├── src/
│   ├── test/
│   └── package.json
├── observability/     # Grafana, Prometheus, Loki, Tempo configs
│   ├── grafana/
│   ├── prometheus/
│   └── otel-collector/
├── docker-compose.yml
└── README.md
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm run test`
4. Commit with conventional format: `feat: add new feature`
5. Push and create a Pull Request

## License

MIT License - see LICENSE file for details.
