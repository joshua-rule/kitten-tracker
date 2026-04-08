# Kitten Weight Tracker

A simple web application to track kitten weights over time using TimescaleDB for time-series data storage.

## Features

- Add kittens by name
- Record weight measurements with timestamps
- View each kitten's current weight and last update time

## Prerequisites

- Docker
- Docker Compose

## Quick Start

```bash
docker compose up
```

The app will be available at http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Add a kitten using the input field at the top
3. Record weights using the form in each kitten's row

## Project Structure

```
.
├── index.js           # Express server and routes
├── db.js              # Database connection and queries
├── views/index.ejs    # Frontend template
├── Dockerfile         # Container image definition
├── docker-compose.yaml
└── package.json
```

## Tech Stack

- Node.js with Express
- EJS templating
- PostgreSQL with TimescaleDB
- Docker

## License

Apache-2.0
