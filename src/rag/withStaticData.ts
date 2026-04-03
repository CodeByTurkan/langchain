import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatModal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

const myData = [
  "My name is John",
  "My name is Katerina",
  "he like banana",
  "i like apple",
];

const question = "What do i like?";

async function storeVector() {
  //store the data
  const store = new MemoryVectorStore(new OpenAIEmbeddings());
  await store.addDocuments(
    myData.map((content) => new Document({ pageContent: content })),
  );

  //create the retrieved data
  const retrive = store.asRetriever({
    k: 2,
  });

  //get the retrieved data
  const getRetriever = await retrive._getRelevantDocuments(question);

  const resultDocs = getRetriever.map((item) => item.pageContent);

  //template
  const template = ChatPromptTemplate.fromMessages([
    ["system", "answer the users questions based on the following: {context}"],
    ["user", "{input}"],
  ]);

  //chain
  const chain = template.pipe(chatModal);
  const response = await chain.invoke({
    input: question,
    context: resultDocs
  });
  console.log(response.content);
  
}

storeVector()
