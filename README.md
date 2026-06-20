# DeepSeek API 示例项目

这是一个使用 Node.js 调用 DeepSeek API 的示例项目，包含多种调用方式和应用场景。

## 项目结构

```
ai-learn/
├── .env.example          # 环境变量示例文件
├── .gitignore            # Git 忽略配置
├── index.js              # 基础 API 调用示例（流式输出）
├── test.js               # Reasoner 模型测试示例
├── package.json          # 项目依赖配置
├── README.md             # 项目说明文档
├── wt.text               # 项目需求说明
├── langchain-learning/
│   └── simple-llm-app.js # LangChain 简单应用示例
└── src/
    ├── server.js              # HTTP 服务器（SSE 流式接口）
    ├── chat.html              # 聊天页面前端
    ├── few-shot-learning.js   # Few-shot Learning 示例
    ├── structure-output.js    # 结构化输出示例（Zod）
    └── sentiment-analysis.js  # 情感分析示例
```

## 文件说明

### 1. 配置文件

| 文件 | 说明 |
|------|------|
| `.env.example` | 环境变量模板，包含 DeepSeek API Key 和 URL 配置 |
| `.gitignore` | Git 忽略规则，排除 `node_modules` 和 `.env` |
| `package.json` | 项目依赖配置，包含 OpenAI、LangChain 等依赖 |

### 2. 基础示例

| 文件 | 说明 | 运行命令 |
|------|------|----------|
| `index.js` | 使用 OpenAI SDK 调用 DeepSeek Chat 模型，流式输出 | `npm start` |
| `test.js` | 使用 DeepSeek Reasoner 模型，先输出思考过程再输出答案 | `npm test` |

### 3. LangChain 学习示例

| 文件 | 说明 |
|------|------|
| `langchain-learning/simple-llm-app.js` | LangChain 框架基础应用示例 |
| `src/few-shot-learning.js` | Few-shot Learning 示例，使用示例样本引导 AI 生成代码注释 |

### 4. Web 服务

| 文件 | 说明 |
|------|------|
| `src/server.js` | Node.js 原生 HTTP 服务器，提供 `/api/chat` SSE 流式接口 |
| `src/chat.html` | 简单的聊天页面前端，支持实时消息发送和流式接收 |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=your-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

### 3. 运行示例

```bash
# 基础流式调用
npm start

# Reasoner 模型测试
npm test

# 启动 Web 服务
node src/server.js
# 访问 http://localhost:3000

# Few-shot Learning 示例
node src/few-shot-learning.js
```

## API 调用方式

### 方式一：使用 OpenAI SDK

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

// 流式调用
const stream = await openai.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true
});
```

### 方式二：使用 LangChain

```javascript
import { ChatDeepSeek } from '@langchain/deepseek';

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.7
});

const response = await model.invoke('Hello');
```

## 功能特性

- ✅ 使用 OpenAI SDK 调用 DeepSeek API
- ✅ 支持 SSE 流式输出
- ✅ Reasoner 模型推理示例
- ✅ Few-shot Learning 示例
- ✅ 结构化输出（withStructuredOutput + Zod）
- ✅ 情感分析示例
- ✅ Web 服务接口（HTTP + SSE）
- ✅ 简单的聊天界面

## 注意事项

1. 请妥善保管您的 API Key，不要提交到版本控制
2. API Key 存储在 `.env` 文件中，该文件已被 `.gitignore` 排除
3. 建议定期轮换 API Key 以保证安全
4. 注意 API 调用频率限制和费用

## 相关链接

- [DeepSeek 官方平台](https://platform.deepseek.com/)
- [DeepSeek API 文档](https://api-docs.deepseek.com/)
- [LangChain 文档](https://js.langchain.com/docs/)
