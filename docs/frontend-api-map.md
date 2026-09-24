# Frontend ↔ Backend API Map

> Tier-3 resource — load on demand when implementing pages.
> Auth: Cookie session (browser) unless noted.

## Global

| Method | Path | Used By | Notes |
|--------|------|---------|-------|
| GET | `/api/status` | App.js | system_name, logo, feature flags |
| GET | `/api/notice` | Home | announcement toast |
| GET | `/api/home_page_content` | Home | markdown or iframe URL |
| GET | `/api/about` | About | |
| GET | `/api/models` | utils | model list |

## Auth

| Method | Path | Used By |
|--------|------|---------|
| POST | `/api/user/login` | LoginForm |
| POST | `/api/user/register` | RegisterForm |
| GET | `/api/user/logout` | Sidebar, Header |
| GET | `/api/verification` | RegisterForm |
| GET | `/api/reset_password` | PasswordResetForm |
| POST | `/api/user/reset` | PasswordResetConfirm |
| GET | `/api/oauth/state` | OAuth utils |
| GET | `/api/oauth/github` | GitHubOAuth |
| GET | `/api/oauth/lark` | LarkOAuth |

## User

| Method | Path | Role | Used By |
|--------|------|------|---------|
| GET/PUT/DELETE | `/api/user/self` | User+ | EditUser, TopUp, PersonalSetting |
| GET/POST/PUT | `/api/user/` | Admin | UsersTable, AddUser |
| GET/DELETE | `/api/user/:id` | Admin | EditUser |
| GET | `/api/user/search` | Admin | UsersTable |
| POST | `/api/user/manage` | Admin | UsersTable, User |
| GET | `/api/user/dashboard` | User+ | Dashboard |
| POST | `/api/user/topup` | User+ | TopUp |
| GET | `/api/user/token` | User+ | PersonalSetting |
| GET | `/api/user/aff` | User+ | PersonalSetting |
| GET | `/api/user/available_models` | User+ | EditToken |
| GET | `/api/group/` | Admin | EditUser, EditChannel |

## Token

| Method | Path | Used By |
|--------|------|---------|
| GET/POST/PUT/DELETE | `/api/token/` | TokensTable, EditToken |
| GET | `/api/token/:id` | EditToken |
| GET | `/api/token/search` | TokensTable |
| Query | `?status_only=true`, `?copy=true` | status toggle, copy key |

## Channel (Admin)

| Method | Path | Used By |
|--------|------|---------|
| GET/POST/PUT/DELETE | `/api/channel/` | ChannelsTable, EditChannel |
| GET | `/api/channel/:id` | EditChannel |
| GET | `/api/channel/search` | ChannelsTable |
| GET | `/api/channel/test`, `/api/channel/test/:id` | test |
| GET | `/api/channel/update_balance` | balance refresh |
| GET | `/api/channel/models` | EditChannel |
| DELETE | `/api/channel/disabled` | bulk delete disabled |

## Redemption (Admin)

| Method | Path | Used By |
|--------|------|---------|
| GET/POST/PUT/DELETE | `/api/redemption/` | RedemptionsTable, EditRedemption |
| GET | `/api/redemption/:id` | EditRedemption |
| GET | `/api/redemption/search` | RedemptionsTable |

## Log

| Method | Path | Role | Used By |
|--------|------|------|---------|
| GET | `/api/log/self`, `/api/log/self/search` | User+ | LogsTable |
| GET | `/api/log/`, `/api/log/search` | Admin | LogsTable |
| GET | `/api/log/stat`, `/api/log/self/stat` | Admin/User | stats |
| DELETE | `/api/log/` | Admin | OperationSetting |

## Settings (Root)

| Method | Path | Used By |
|--------|------|---------|
| GET/PUT | `/api/option/` | SystemSetting, OperationSetting, OtherSetting |

## Admin TopUp

| Method | Path | Used By |
|--------|------|---------|
| POST | `/api/topup` | admin recharge |

## Response Shape

```json
{ "success": true, "message": "...", "data": {} }
```
