/**
 * DeepSeek 结构化输出示例
 * 
 * 使用 LangChain 的 withStructuredOutput 方法，配合 Zod 定义输出格式
 * 从个人介绍文本中提取结构化信息：{ name, age, gender, skills }
 */

import { ChatDeepSeek } from '@langchain/deepseek';
import { z } from 'zod';
import 'dotenv/config';

// 定义输出结构
const PersonSchema = z.object({
  name: z.string().describe('人物姓名'),
  age: z.number().describe('年龄'),
  gender: z.enum(['男', '女', '未知']).describe('性别'),
  skills: z.array(z.string()).describe('技能列表')
});

// 初始化模型
const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.1,
});

// 添加结构化输出能力
const structuredModel = model.withStructuredOutput(PersonSchema);

// 示例输入：个人介绍文本
const personalIntroduction = `
我叫张三，今年30岁，男性。
我是一名全栈开发者，拥有5年工作经验。
精通 JavaScript、TypeScript、Python 和 Go 编程语言。
熟悉 React、Node.js、Vue 等框架。
还掌握 Docker、Kubernetes 等容器技术。
`;

async function main() {
  console.log('=== 输入文本 ===');
  console.log(personalIntroduction);
  console.log('\n=== 结构化输出 ===');

  const result = await structuredModel.invoke(personalIntroduction);

  console.log(JSON.stringify(result, null, 2));
  console.log('\n=== 执行完成 ===');
}

main().catch(console.error);
