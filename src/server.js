/**
 * DeepSeek Chat HTTP 服务示例
 *
 * 本文件演示如何使用 Node.js 原生 HTTP 模块创建服务器
 * 提供 /api/chat 接口，使用 SSE 协议流式返回 DeepSeek API 响应
 *
 * 运行方式：node src/server.js
 */

import http from 'node:http';
import { URL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: API_URL
});

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

async function handleChat(req, res) {
  const body = await parseRequestBody(req);
  const message = body.message || '你好';

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const stream = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: message }],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    await handleChat(req, res);
  } else if (url.pathname === '/' || url.pathname === '/chat.html') {
    const filePath = join(__dirname, 'chat.html');
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    try {
      const content = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
  console.log(`聊天页面: http://localhost:${PORT}/`);
  console.log(`接口地址: POST http://localhost:${PORT}/api/chat`);
  console.log(`请求示例: curl -X POST http://localhost:${PORT}/api/chat -H "Content-Type: application/json" -d '{"message":"你好"}'`);
});
