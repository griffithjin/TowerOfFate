# 数据库表关系与字段定义

## 数据库: toweroffate.db

---

## 1. 用户表 (users)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| user_id | INTEGER | 用户ID | PRIMARY KEY |
| phone | VARCHAR(20) | 手机号 | UNIQUE, NULLABLE |
| email | VARCHAR(100) | 邮箱 | UNIQUE, NULLABLE |
| password_hash | VARCHAR(256) | 密码哈希 | NOT NULL |
| nickname | VARCHAR(50) | 昵称 | NOT NULL |
| avatar | VARCHAR(200) | 头像URL | DEFAULT '' |
| gold | INTEGER | 金币余额 | DEFAULT 0 |
| diamond | INTEGER | 钻石余额 | DEFAULT 0 |
| points | INTEGER | 排位积分 | DEFAULT 0 |
| vip_level | INTEGER | VIP等级 | DEFAULT 0 |
| vip_expire | DATETIME | VIP过期时间 | NULLABLE |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP |
| last_login | DATETIME | 最后登录 | NULLABLE |
| status | INTEGER | 状态(0正常1冻结) | DEFAULT 0 |

**索引：**
- idx_phone: phone
- idx_email: email
- idx_status: status

---

## 2. 用户道具表 (user_items)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| item_id | INTEGER | 记录ID | PRIMARY KEY |
| user_id | INTEGER | 用户ID | FOREIGN KEY(users.user_id) |
| product_id | VARCHAR(50) | 商品ID | NOT NULL |
| product_type | VARCHAR(20) | 商品类型 | NOT NULL |
| equipped | BOOLEAN | 是否装备 | DEFAULT FALSE |
| obtained_at | DATETIME | 获得时间 | DEFAULT CURRENT_TIMESTAMP |
| expire_at | DATETIME | 过期时间 | NULLABLE |

**索引：**
- idx_user_id: user_id
- idx_product_id: product_id

---

## 3. 订单表 (orders)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| order_id | INTEGER | 订单ID | PRIMARY KEY |
| order_no | VARCHAR(32) | 订单号 | UNIQUE |
| user_id | INTEGER | 用户ID | FOREIGN KEY(users.user_id) |
| product_id | VARCHAR(50) | 商品ID | NOT NULL |
| product_type | VARCHAR(20) | 商品类型 | NOT NULL |
| amount | DECIMAL(10,2) | 支付金额(元) | NOT NULL |
| currency | VARCHAR(10) | 货币类型 | NOT NULL |
| quantity | INTEGER | 数量 | DEFAULT 1 |
| pay_channel | VARCHAR(20) | 支付渠道 | NOT NULL |
| pay_status | INTEGER | 支付状态 | DEFAULT 0 |
| pay_time | DATETIME | 支付时间 | NULLABLE |
| third_party_no | VARCHAR(64) | 第三方订单号 | NULLABLE |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

**支付状态：**
- 0: 待支付
- 1: 已支付
- 2: 已取消
- 3: 已退款

**索引：**
- idx_order_no: order_no
- idx_user_id: user_id
- idx_pay_status: pay_status
- idx_created_at: created_at

---

## 4. 交易流水表 (transactions)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| trans_id | INTEGER | 流水ID | PRIMARY KEY |
| user_id | INTEGER | 用户ID | FOREIGN KEY(users.user_id) |
| trans_type | VARCHAR(20) | 交易类型 | NOT NULL |
| currency_type | VARCHAR(10) | 货币类型 | NOT NULL |
| amount | INTEGER | 变动金额(分) | NOT NULL |
| balance_before | INTEGER | 变动前余额 | NOT NULL |
| balance_after | INTEGER | 变动后余额 | NOT NULL |
| related_id | VARCHAR(64) | 关联ID | NULLABLE |
| related_type | VARCHAR(20) | 关联类型 | NULLABLE |
| remark | VARCHAR(200) | 备注 | NULLABLE |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

**交易类型：**
- recharge: 充值
- consume: 消费
- reward: 奖励
- refund: 退款
- transfer: 转账

**索引：**
- idx_user_id: user_id
- idx_trans_type: trans_type
- idx_created_at: created_at

---

## 5. 游戏记录表 (game_records)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| game_id | INTEGER | 游戏ID | PRIMARY KEY |
| game_no | VARCHAR(32) | 游戏编号 | UNIQUE |
| user_id | INTEGER | 用户ID | FOREIGN KEY(users.user_id) |
| game_mode | VARCHAR(20) | 游戏模式 | NOT NULL |
| result | VARCHAR(10) | 结果(win/lose/draw) | NOT NULL |
| max_level | VARCHAR(5) | 最高层数 | NOT NULL |
| is_first_ascender | BOOLEAN | 是否首登者 | DEFAULT FALSE |
| cards_played | INTEGER | 出牌数 | DEFAULT 0 |
| provoke_matched | INTEGER | 激怒匹配数 | DEFAULT 0 |
| base_score | INTEGER | 基础分 | DEFAULT 0 |
| level_score | INTEGER | 楼层分 | DEFAULT 0 |
| bonus_score | INTEGER | 奖励分 | DEFAULT 0 |
| total_score | INTEGER | 总积分 | DEFAULT 0 |
| gold_reward | INTEGER | 金币奖励 | DEFAULT 0 |
| points_reward | INTEGER | 积分奖励 | DEFAULT 0 |
| started_at | DATETIME | 开始时间 | NOT NULL |
| ended_at | DATETIME | 结束时间 | NOT NULL |
| duration | INTEGER | 时长(秒) | NOT NULL |

**游戏模式：**
- solo: 单人模式
- team_2v2: 2v2团队
- team_3v3: 3v3团队
- team_4v4: 4v4团队
- tournament: 锦标赛

**索引：**
- idx_game_no: game_no
- idx_user_id: user_id
- idx_game_mode: game_mode
- idx_result: result
- idx_ended_at: ended_at

---

## 6. 锦标赛表 (tournaments)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| tournament_id | INTEGER | 锦标赛ID | PRIMARY KEY |
| tournament_no | VARCHAR(32) | 锦标赛编号 | UNIQUE |
| name | VARCHAR(100) | 名称 | NOT NULL |
| type | VARCHAR(20) | 类型 | NOT NULL |
| entry_fee | INTEGER | 报名费(金币) | NOT NULL |
| prize_pool | INTEGER | 奖池(金币) | NOT NULL |
| max_players | INTEGER | 最大人数 | NOT NULL |
| current_players | INTEGER | 当前人数 | DEFAULT 0 |
| status | INTEGER | 状态 | DEFAULT 0 |
| start_time | DATETIME | 开始时间 | NOT NULL |
| end_time | DATETIME | 结束时间 | NOT NULL |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

**锦标赛类型：**
- daily: 每日赛
- weekend: 周末赛
- monthly: 月度赛
- streak: 连胜赛

**状态：**
- 0: 报名中
- 1: 进行中
- 2: 已结束

**索引：**
- idx_tournament_no: tournament_no
- idx_type: type
- idx_status: status
- idx_start_time: start_time

---

## 7. 锦标赛参与表 (tournament_players)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | INTEGER | 记录ID | PRIMARY KEY |
| tournament_id | INTEGER | 锦标赛ID | FOREIGN KEY(tournaments.tournament_id) |
| user_id | INTEGER | 用户ID | FOREIGN KEY(users.user_id) |
| rank | INTEGER | 排名 | NULLABLE |
| score | INTEGER | 得分 | DEFAULT 0 |
| joined_at | DATETIME | 报名时间 | DEFAULT CURRENT_TIMESTAMP |
| prize_claimed | BOOLEAN | 是否领奖 | DEFAULT FALSE |

**索引：**
- idx_tournament_user: (tournament_id, user_id)
- idx_rank: rank

---

## 8. 管理员表 (admins)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| admin_id | INTEGER | 管理员ID | PRIMARY KEY |
| username | VARCHAR(50) | 用户名 | UNIQUE |
| password_hash | VARCHAR(256) | 密码哈希 | NOT NULL |
| role | VARCHAR(20) | 角色 | NOT NULL |
| permissions | TEXT | 权限JSON | NOT NULL |
| last_login | DATETIME | 最后登录 | NULLABLE |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| status | INTEGER | 状态 | DEFAULT 0 |

**角色：**
- super_admin: 超级管理员
- operator: 运营管理员
- customer_service: 客服
- finance: 财务

**索引：**
- idx_username: username
- idx_role: role

---

## 9. 操作日志表 (operation_logs)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| log_id | INTEGER | 日志ID | PRIMARY KEY |
| operator_id | INTEGER | 操作者ID | FOREIGN KEY(admins.admin_id) |
| operator_type | VARCHAR(20) | 操作者类型 | NOT NULL |
| action | VARCHAR(50) | 操作类型 | NOT NULL |
| target_type | VARCHAR(50) | 目标类型 | NOT NULL |
| target_id | VARCHAR(64) | 目标ID | NOT NULL |
| old_value | TEXT | 旧值 | NULLABLE |
| new_value | TEXT | 新值 | NULLABLE |
| ip_address | VARCHAR(50) | IP地址 | NULLABLE |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

**索引：**
- idx_operator: operator_id
- idx_target: (target_type, target_id)
- idx_created_at: created_at

---

## 10. 配置表 (configs)

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| config_id | INTEGER | 配置ID | PRIMARY KEY |
| config_key | VARCHAR(50) | 配置键 | UNIQUE |
| config_value | TEXT | 配置值 | NOT NULL |
| config_type | VARCHAR(20) | 值类型 | DEFAULT 'string' |
| description | VARCHAR(200) | 描述 | NULLABLE |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

**索引：**
- idx_config_key: config_key

---

## 表关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                           users                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ user_id (PK)                                            │   │
│  │ phone, email, password_hash                             │   │
│  │ gold, diamond, points, vip_level                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│       │              │              │              │             │
│       ▼              ▼              ▼              ▼             │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │user_    │  │ orders   │  │game_     │  │tournament│         │
│  │items    │  │          │  │records   │  │_players  │         │
│  └─────────┘  └──────────┘  └──────────┘  └──────────┘         │
│       │              │              │              │             │
│       ▼              ▼              ▼              ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    transactions                         │   │
│  │              (用户所有交易流水)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      管理后台表                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   admins    │  │ operation_   │  │   configs    │           │
│  │             │  │    logs      │  │              │           │
│  └─────────────┘  └──────────────┘  └──────────────┘           │
│       │                   │                                     │
│       └───────────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 核心关系说明

1. **users → user_items**: 1对多，一个用户可拥有多个道具
2. **users → orders**: 1对多，一个用户可有多笔订单
3. **users → game_records**: 1对多，一个用户可有多条游戏记录
4. **users → tournament_players**: 1对多，一个用户可参加多个锦标赛
5. **users → transactions**: 1对多，记录所有货币变动
6. **tournaments → tournament_players**: 1对多，一个锦标赛可有多个参与者
7. **admins → operation_logs**: 1对多，记录管理员操作

---
版本：v1.0
更新时间：2026-03-05
