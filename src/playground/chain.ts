import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const modal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temprature: 0.7,
});

async function createPromptWithTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "write a short description for a follwing product: {product_name}",
  );

  //for type safety
  const productName = await prompt.format({
    product_name: "car",
  });

  //creating a chain: connecting modal with the prompt
  const chain = prompt.pipe(modal);
  const response = chain.invoke({ product_name: "car" });
  console.log((await response).content);
}

// createPromptWithTemplate();

async function createPromptWithMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "write a short description for a follwing product:"],
    ["human", "{product_name}"],
  ]);

  const chain = prompt.pipe(modal);
  const response2 = await chain.invoke({
    product_name: "car",
  });
  console.log(response2.content);
}
createPromptWithMessage();
