import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const modal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temprature: 0.7,
});

async function commaSeperatedParserTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "provide 5 ingridients of the following product: {word}",
  );

  const commaSeperatedParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(modal).pipe(commaSeperatedParser);
  const response = await chain.invoke({ word: "egg" });
  console.log(response);
}
// commaSeperatedParserTemplate();

async function stringParserTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "write a short description for a follwing product: {product_name}",
  );

  const stringParser = new StringOutputParser();

  const chain = prompt.pipe(modal).pipe(stringParser);
  const response = await chain.invoke({ product_name: "car" });
  console.log(response);
}
// stringParserTemplate();

async function structureParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    `extract infor from:
        phrase: {phrase}
        format_insctuction:{format_instructions},
    `,
  );

  const structuredParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    likes: "what the person liked",
  });

  const chain = prompt.pipe(modal).pipe(structuredParser);
  const response = await chain.invoke({
    format_instructions: structuredParser.getFormatInstructions(),
    phrase: "turkan likes pineapple",
  });
  console.log(response);

  
}
structureParser();
