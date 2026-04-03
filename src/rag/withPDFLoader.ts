import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const chatModal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
});

const question = "what is this pdf about?";

async function storeVector() {
  // loader
  const loader = new PDFLoader("sample-local-pdf.pdf", {
    splitPages: false,
  });
  const docs = await loader.load();

  //splitter
  const splitter = new RecursiveCharacterTextSplitter({
    separators: [". \n "],
  });
  const splitterDoc = await splitter.splitDocuments(docs);

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
