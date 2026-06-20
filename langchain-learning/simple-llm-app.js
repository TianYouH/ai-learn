import { ChatDeepSeek } from '@langchain/deepseek'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import 'dotenv/config'

const llm = new ChatDeepSeek({
  model: 'deepseek-chat',
})

// const messages = [
//   new SystemMessage('Translate the following from English into Italian'),
//   new HumanMessage('hi, how are you?'),
// ]


// 1. 调用 prompt 生成 AI 结果
// const res = await llm.invoke(messages)
// console.log(res)

// 2. 调用 prompt 生成 AI 结果，返回流式结果
// const stream = await llm.stream(messages)
// const chunks = []
// for await (const chunk of stream) {
//   chunks.push(chunk)
//   console.log(`${chunk.content}|`)
// }

// 3. Prompt template 提示词模板 流式输出
// 定义 template
const systemTemplate = '把下面内容从英文翻译成中文 {language}'
const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', systemTemplate],
  ['user', '{text}'],
])

// 根据 template 生成 prompt 值
const promptValue = await promptTemplate.invoke({
  language: 'Chinese',
  text: 'hi, how are you?',
})

// 调用 prompt 生成 AI 结果
const res = await llm.stream(promptValue)
// console.log(`${res.content}`)
const chunks = []
for await (const chunk of res) {
  chunks.push(chunk)
  console.log(`${chunk.content}|`)
}