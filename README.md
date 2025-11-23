<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

**Auth Demo API** is a comprehensive NestJS application demonstrating dual authentication strategies (JWT and Session-based) with Google OAuth integration. This project serves as a reference implementation for building secure authentication systems with multiple auth methods.

### Key Features

- **Dual Authentication Methods**:
  - **JWT Authentication**: Stateless token-based authentication with access/refresh token pattern
  - **Session Authentication**: Stateful cookie-based authentication with express-session

- **OAuth Integration**:
  - Google OAuth 2.0 support for both JWT and Session flows
  - Automatic user creation and account linking

- **User Management**:
  - User registration and login
  - Password hashing with bcrypt (automatic via entity hooks)
  - User profile management

- **Tasks Management**:
  - CRUD operations for user tasks
  - Composite authentication guard supporting both JWT and Session

- **API Documentation**:
  - Swagger/OpenAPI documentation at `/api`
  - Complete endpoint documentation with examples

### Architecture

The application follows a modular architecture:

```
src/
├── auth/              # Authentication module
│   ├── guards/        # Authentication guards (JWT, Session, Composite)
│   ├── strategies/    # Passport strategies (JWT, Local, OAuth, Session)
│   ├── dto/          # Data Transfer Objects
│   └── types/        # TypeScript type definitions
├── users/            # User management module
├── tasks/            # Tasks management module
├── config/           # Configuration module
└── database/         # Database configuration
```

### API Endpoints

#### Authentication Endpoints

**JWT Authentication** (`/auth/jwt`):

- `POST /auth/jwt/login` - Login with email/password, receive JWT tokens
- `POST /auth/jwt/refresh` - Refresh access token
- `GET /auth/jwt/me` - Get current user profile
- `GET /auth/jwt/google` - Initiate Google OAuth (JWT flow)
- `GET /auth/jwt/google/callback` - Google OAuth callback (returns tokens in query params)

**Session Authentication** (`/auth/session`):

- `POST /auth/session/register` - Register new user
- `POST /auth/session/login` - Login with email/password (creates session)
- `POST /auth/session/logout` - Logout and destroy session
- `GET /auth/session/me` - Get current user profile
- `GET /auth/session/google` - Initiate Google OAuth (Session flow)
- `GET /auth/session/google/callback` - Google OAuth callback (sets session cookie)

#### Protected Endpoints

**Tasks** (`/tasks`) - Supports both JWT and Session:

- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks for current user
- `GET /tasks/:id` - Get a task by ID
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

**Users** (`/users`) - Supports both JWT and Session:

- `GET /users/me` - Get current user information

## Project setup

```bash
$ pnpm install
```

## Database Setup (Docker)

Start PostgreSQL database using Docker Compose:

```bash
$ docker-compose up -d
```

This will start a PostgreSQL container with:

- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `auth_demo`

To stop the database:

```bash
$ docker-compose down
```

To stop and remove volumes (delete all data):

```bash
$ docker-compose down -v
```

## Environment Configuration

Copy `.env.example` to `.env` and fill in the required values:

```bash
$ cp .env.example .env
```

### Required Environment Variables

- `SESSION_SECRET` - Secret for express-session (generate with: `openssl rand -base64 32`)
- `JWT_ACCESS_SECRET` - Secret for JWT access tokens (generate with: `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` - Secret for JWT refresh tokens (generate with: `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_SESSION_REDIRECT_URL` - Redirect URL for session client (default: `http://localhost:3000/oauth/callback`)
- `GOOGLE_JWT_REDIRECT_URL` - Redirect URL for JWT client (default: `http://localhost:3001/oauth/callback`)

### Optional Environment Variables

- `NODE_ENV` - Environment (development, production, test) - Default: `development`
- `PORT` - Server port - Default: `8080`
- `DB_HOST` - Database host - Default: `localhost` (use `postgres` if connecting from Docker network)
- `DB_PORT` - Database port - Default: `5432`
- `DB_USERNAME` - Database username - Default: `postgres`
- `DB_PASSWORD` - Database password - Default: `postgres`
- `DB_DATABASE` - Database name - Default: `auth_demo`
- `JWT_ACCESS_EXPIRES_IN` - Access token expiration - Default: `15m`
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration - Default: `7d`
- `CORS_ORIGINS` - Comma-separated allowed origins - Default: `http://localhost:3000,http://localhost:3001`

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:8080/api
```

The Swagger UI provides:

- Complete API endpoint documentation
- Interactive API testing
- Authentication support (JWT Bearer token and Session cookie)
- Request/response examples

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js (Local, JWT, Google OAuth)
- **Session Management**: express-session
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcrypt

## Authentication Flow

### JWT Flow

1. User logs in → receives `accessToken` and `refreshToken`
2. Client stores tokens (localStorage, cookies, etc.)
3. Each request includes `Authorization: Bearer <accessToken>` header
4. When access token expires, use `refreshToken` to get new access token

### Session Flow

1. User logs in → server creates session and sets cookie
2. Browser automatically sends session cookie with each request
3. Server validates session on each request
4. User logs out → server destroys session

### Google OAuth Flow

- **JWT**: After Google authentication, tokens are returned in redirect URL query params
- **Session**: After Google authentication, session cookie is automatically set

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
