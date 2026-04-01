import { ChatOpenAI } from "@langchain/openai";

const modal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temprature: 0.8,
  maxTokens: 700,
  verbose: true,
});

async function runModal() {
  // const input = await modal.invoke("Give me 4 good books to read");
  // console.log(input.content);
//   const input = await modal.batch([
//     "hello",
//     "give me 3 author that worth to read",
//   ]);
    //   console.log(input);
    
    const input = await modal.stream("give me 3 author that worth to read");
    for await (const chunk of input)
        console.log(chunk.content);
        
}

runModal();
