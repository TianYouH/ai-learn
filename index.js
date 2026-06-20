/**
 * DeepSeek Chat 模型流式输出示例
 * 
 * 本文件演示如何使用 OpenAI SDK 访问 DeepSeek Chat 模型并实现流式输出
 * 
 * 主要功能：
 * - 使用 deepseek-chat 模型进行对话
 * - 支持流式输出（stream: true）
 * - 实时打印 AI 的响应内容
 * 
 * 运行方式：npm start
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';

if (!API_KEY) {
  console.error('错误：请设置 DEEPSEEK_API_KEY 环境变量');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: API_URL
});

async function callDeepSeekAPI(prompt, model = 'deepseek-chat', stream = false) {
  if (stream) {
    return openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024
    });
  } else {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.7,
      max_tokens: 1024
    });
    return response.choices[0].message.content;
  }
}

async function main() {
  console.log('DeepSeek API 示例项目 - 流式输出');
  console.log('===============================\n');

  const prompt = '请介绍一下你自己，包括你的能力和特点';

  console.log(`用户提问: ${prompt}`);
  console.log('\nDeepSeek 响应 (流式输出):');
  console.log('--------------------------');

  try {
    const stream = await callDeepSeekAPI(prompt, 'deepseek-chat', true);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }

    console.log('\n\n--------------------------');
    console.log('流式输出完成');
  } catch (error) {
    console.error('\n调用失败:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { callDeepSeekAPI };
