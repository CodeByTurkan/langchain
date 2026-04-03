import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const chatModal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

const question = "how to build a rag agent with langchain";

async function storeVector() {
  // loader
  const loader = new CheerioWebBaseLoader(
    "https://docs.langchain.com/oss/javascript/langchain/rag#expand-for-full-code-snippet",
  );
  const docs = await loader.load();

  //snippet
  const splitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 20,
    chunkSize: 200,
  });
    const splitterDoc = await splitter.splitDocuments(docs)

  //store the data
  const store = new MemoryVectorStore(new OpenAIEmbeddings());
  await store.addDocuments(splitterDoc);
  

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
    context: resultDocs,
  });
  console.log(response.content);
}

storeVector();
