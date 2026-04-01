import { ChatOpenAI } from "@langchain/openai";

const modal = new ChatOpenAI({
  model: "gpt-4o-mini",
  temprature: 0.8,
  maxTokens: 700,
  verbose: true,
});

async function runModal() {
  // const input1 = await modal.invoke("Give me 4 good books to read");
  // console.log(input1.content);
//   const input2 = await modal.batch([
//     "hello",
//     "give me 3 author that worth to read",
//   ]);
    //   console.log(input2);
    
    const input3 = await modal.stream("give me 3 author that worth to read");
    for await (const chunk of input3)
        console.log(chunk.content);
        
}

runModal();
