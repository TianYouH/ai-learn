/**
 * DeepSeek Reasoner 模型流式输出示例
 * 
 * 本文件演示如何使用 OpenAI SDK 访问 DeepSeek Reasoner 推理模型并实现流式输出
 * 
 * 主要功能：
 * - 使用 deepseek-reasoner 模型进行深度推理
 * - 支持流式输出（stream: true）
 * - 先打印思考过程（reasoning），再打印最终答案（content）
 * - 自动识别"总结一下"分隔符来区分思考和答案
 * 
 * 运行方式：npm test
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

async function testDeepSeekReasoner(prompt) {
  console.log('DeepSeek Reasoner 模型测试');
  console.log('=========================\n');

  console.log(`问题: ${prompt}`);
  console.log('\n思考过程 (流式输出):');
  console.log('---------------------');

  let fullResponse = '';
  const reasonStart = '**总结一下：';
  let isReasoning = true;

  try {
    const stream = await openai.chat.completions.create({
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 2048
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;

      if (isReasoning) {
        if (content.includes(reasonStart)) {
          const idx = content.indexOf(reasonStart);
          process.stdout.write(content.slice(0, idx));
          isReasoning = false;
          console.log('\n\n最终答案:');
          console.log('----------');
          process.stdout.write(content.slice(idx + reasonStart.length));
        } else {
          process.stdout.write(content);
        }
      } else {
        process.stdout.write(content);
      }
    }

    console.log('\n\n----------');
    console.log('测试完成');

  } catch (error) {
    console.error('\n调用失败:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testDeepSeekReasoner('天空为什么是蓝色的');
}

export { testDeepSeekReasoner };
