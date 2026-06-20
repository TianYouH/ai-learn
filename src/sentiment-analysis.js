/**
 * DeepSeek 情感分析示例
 * 
 * 使用 LangChain 的 withStructuredOutput 方法，配合 Zod 定义输出格式
 * 判断一句话的情感倾向：贬义/褒义/中性
 */

import { ChatDeepSeek } from '@langchain/deepseek';
import { z } from 'zod';
import 'dotenv/config';

// 定义输出结构
const SentimentSchema = z.object({
  sentiment: z.enum(['贬义', '褒义', '中性']).describe('情感倾向'),
  confidence: z.number().min(0).max(1).describe('置信度，0-1之间'),
  reason: z.string().describe('判断理由')
});

// 初始化模型
const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.1,
});

// 添加结构化输出能力
const structuredModel = model.withStructuredOutput(SentimentSchema);

// 测试用例
const testCases = [
  '这个产品太棒了，我非常喜欢！',
  '服务态度太差了，再也不来了。',
  '今天天气不错。',
  '这家餐厅的菜品很一般，没什么特色。',
  '你的代码写得真漂亮，逻辑清晰易读！'
];

async function analyzeSentiment(text) {
  const result = await structuredModel.invoke(
    `请分析以下这句话的情感倾向：\n"${text}"`
  );
  return result;
}

async function main() {
  console.log('=== 情感分析测试 ===\n');

  for (const text of testCases) {
    console.log(`输入: "${text}"`);
    const result = await analyzeSentiment(text);
    console.log('结果:');
    console.log(`  情感: ${result.sentiment}`);
    console.log(`  置信度: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`  理由: ${result.reason}`);
    console.log('---\n');
  }

  console.log('=== 执行完成 ===');
}

main().catch(console.error);
