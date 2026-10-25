# What If Lab

**Learn science by predicting first, then experimenting.**

What If Lab is a web platform where users learn physics through interactive experiments. Instead of reading an explanation, you commit to a prediction, change the parameters, run a 2D simulation, and see whether you were right.

Built for the **Appwrite Databases Hackathon** with **Appwrite TablesDB**.

<!-- TODO: add before submitting -->
<!-- Demo video -->
<!-- Live demo -->
<!-- Screenshot -->

## Why What If Lab

Most science tools either show you a simulation with no context or explain a concept with no interaction. What If Lab combines them in one loop where the question comes first:

```
Question → Prediction → Simulation → Explanation → Points
```

Making a prediction before touching the simulation is the core idea. A wrong guess followed by a visible result is where the learning happens.

For example, in a projectile experiment you can change mass, gravity, initial velocity and launch angle, then discover how each one affects the trajectory.

## How it uses Appwrite TablesDB

TablesDB is use to store experiments, their parameters, questions and scores.

**Relational structure.** Each `experiment_parameter` and `experiment_question` row points to its experiment through `experimentId`. This lets one experiment define its own set of sliders and questions, so new experiments need no new code for their parameters.

**Parameter-driven simulations.** The parameters stored in TablesDB (name, type, default, min, max, unit) are what generate the controls the user sees. Changing a row changes the interface.

**Publishing workflow.** Experiments have a `status` of `draft`, `pending` or `published`. So, as an admin you can create an experiment and not published it instantly.

**Leaderboard.** `user_score` holds one total per user. The leaderboard is a query on `score`, sorted from highest to lowest.

## Database Schema: what-if-db

### Tables

#### experiment
**Row Security:** Disabled

##### Columns

| Column | Type | Required | Default | Size | Format | Description |
|--------|------|----------|---------|------|--------|------------|
| `title` | varchar | Yes | - | 255 | - | - |
| `description` | text | No | - | - | - | - |
| `status` | string | No | `draft` | - | enum | - |

---

#### experiment_parameter
**Row Security:** Disabled

##### Columns

| Column | Type | Required | Default | Size | Format | Description |
|--------|------|----------|---------|------|--------|------------|
| `name` | varchar | Yes | - | 255 | - | - |
| `type` | string | No | `number` | - | enum | - |
| `default` | varchar | Yes | - | 255 | - | - |
| `min` | varchar | Yes | - | 255 | - | - |
| `max` | varchar | Yes | - | 255 | - | - |
| `unit` | varchar | Yes | - | 255 | - | - |
| `experimentId` | relationship | No | - | - | - | Relation to `6adc68480002677e9d9d` (manyToOne) |

---

#### experiment_question
**Row Security:** Disabled

##### Columns

| Column | Type | Required | Default | Size | Format | Description |
|--------|------|----------|---------|------|--------|------------|
| `question` | varchar | Yes | - | 255 | - | - |
| `correctAnswer` | varchar | Yes | - | 255 | - | - |
| `explanation` | text | Yes | - | - | - | - |
| `points` | integer | Yes | - | - | - | - |
| `experimentId` | relationship | No | - | - | - | Relation to `6adc68480002677e9d9d` (manyToOne) |

---

#### user_score
**Row Security:** Enabled

##### Columns

| Column | Type | Required | Default | Size | Format | Description |
|--------|------|----------|---------|------|--------|------------|
| `userId` | varchar | Yes | - | 255 | - | - |
| `score` | integer | No | `0` | - | - | - |

---


## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js |
| Language | React, TypeScript |
| Backend | Appwrite (Auth, TablesDB) |
| Validation | Zod |
| Styling | Tailwind CSS |
| Simulations | Canvas / SVG with custom physics calculations |

## Getting started

### Prerequisites

- Node.js (a version supported by your Next.js release)
- An Appwrite project (Cloud or self-hosted)

### 1. Clone and install

```bash
git clone https://github.com/Mael-Roulette/what-if-lab.git
cd what-if-lab
npm install
```

### 2. Set up Appwrite

1. Create a project in the Appwrite console and add a **Web platform** for `localhost`.
2. Enable **Email/Password** authentication.
3. Create a **database** with TablesDB.
4. Create the four tables above with the columns listed (`experiment`, `experiment_parameter`, `experiment_question`, `user_score`).
5. Set table permissions so that guests can read published experiments and signed-in users can read and write their own data.
6. Create an **API key** with access to the database.

### 3. Environment variables

Create a `.env.local` file in the project root:

```env
# Appwrite project
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=
NEXT_PUBLIC_APPWRITE_ENDPOINT=

# Appwrite IDs
NEXT_PUBLIC_DATABASE_ID=
NEXT_PUBLIC_EXPERIMENT_TABLE_ID=
NEXT_PUBLIC_PARAMETER_TABLE_ID=

# Server-side only
APPWRITE_API_KEY=
```

`APPWRITE_API_KEY` has no `NEXT_PUBLIC_` prefix on purpose. Keep it on the server, never commit it, and never expose it to the browser. The app throws an error at startup if the database or table IDs are missing.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src
├── app
│   ├── (authenticated)      # Dashboard, experiments, profile (requires login)
│   ├── [...appwrite]        # Appwrite route handler
│   ├── admin-*              # Admin area, including experiment creation
│   ├── auth                 # Sign in / sign up
│   └── guest                # Guest experience
├── components
│   ├── experiments
│   │   ├── form             # Experiment creation form
│   │   └── simulations      # Simulation canvases and parameter controls
│   └── form                 # Shared form components
├── lib
│   ├── appwrite             # Appwrite client, auth and TablesDB queries
│   ├── physics              # Physics calculations
│   └── validations          # Zod schemas
└── types                    # Shared TypeScript types
```

## License

This project is licensed under the [MIT License](LICENSE).