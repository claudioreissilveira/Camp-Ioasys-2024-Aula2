const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { resolve } = require("path");
const readline = require("readline");
require("dotenv/config");

const client = new OpenAIClient(
  process.env.GPT_ENDPOINT,
  new AzureKeyCredential(process.env.GPT_KEY)
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getMessageFromAPI = async (message) => {
  try {
    const response = await client.getCompletions(
      process.env.GPT_MODEL,
      message,
      {
        temperature: 0,
        maxTokens: 50,
      }
    );

    response.choices[0].text.trim();
    return response.choices[0].text.trim();
  } catch (error) {
    console.error(error);
    return "Ocorreu um erro, tente novamente";
  }
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

(async () => {
  console.log("Bem vindo ao Chat");
  console.log('Digite "sair" a qualquer momento para sair');

  try {
    while (true) {
      const userMessage = await askQuestion("You:");

      if (userMessage.toLowerCase() === "sair") {
        console.log("Ate breve !");
        rl.close();
        break;
      }
      const botResponse = await getMessageFromAPI(userMessage);
      console.log(`Bot: ${botResponse}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    rl.close();
    process.exit(1);
  }
})();
