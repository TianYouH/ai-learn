
import { PromptTemplate, FewShotPromptTemplate } from '@langchain/core/prompts'
import { ChatDeepSeek } from '@langchain/deepseek'
import 'dotenv/config'

const examples = [
  {
    question: `
      给以下 JS 函数写注释
      function add(a, b) {{
        return a + b;
      }}`,
    answer: `
      /**
      * 两个数字相加求和
      * @param {{number}} a - 第一个数字
      * @param {{number}} b - 第二个数字
      * @returns {{number}} 两个数字的和
      */`,
  },
  {
    question: `
      给以下 JS 函数写注释
      function getUser(id) {{
        return db.findUserById(id);
      }}
    `,
    answer: `
      /**
      * 根据用户ID从数据库中获取用户信息
      * @param {{string}} id - 唯一的用户 id
      * @returns {{Object|null}} 返回用户对象，如果未找到则返回 null
      */`,
  },
]

const examplePrompt = PromptTemplate.fromTemplate(
  'Question: {question}\nAnswer: {answer}'
)

const prompt = new FewShotPromptTemplate({
  examples: examples,
  examplePrompt,
  suffix: 'Question: {input}',
  inputVariables: ['input'],
})

// 创建 system prompt
const systemPrompt = `你是一名资深的 Node.js 工程师，请为给定的函数写英文文档注释。  
格式要求：  
1. 使用 JSDoc 风格。  
2. 每个参数必须有描述。  
3. 结尾要有返回值说明。`

// 初始化 DeepSeek 模型
const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0.7,
})

// 创建完整的 prompt：system + few-shot examples + user input
const fullPrompt = PromptTemplate.fromTemplate(
  `{system}\n\n{examples}\n\n{input}`
)

async function main() {
  console.log('开始执行...\n')

  const inputCode = `
    给以下 JS 函数写注释
    function formatDate(date) {
      return date.toISOString().split('T')[0];
    }`
  const escapedInput = inputCode.replace(/\{/g, '{{').replace(/\}/g, '}}')

  // 生成 few-shot examples
  const formatted = await prompt.format({
    input: escapedInput,
  })

  // 还原花括号
  const finalExamples = formatted.replace(/{{/g, '{').replace(/}}/g, '}')

  // 组合完整的 prompt
  const completePrompt = await fullPrompt.format({
    system: systemPrompt,
    examples: finalExamples,
    input: inputCode,
  })

  console.log('=== 发送给 AI 的完整 Prompt ===\n')
  console.log(completePrompt)
  console.log('\n=== AI 响应 ===\n')

  // 调用 DeepSeek API
  const response = await model.invoke(completePrompt)
  console.log(response.content)

  console.log('\n=== 执行完成 ===')
}

main().catch(console.error)
