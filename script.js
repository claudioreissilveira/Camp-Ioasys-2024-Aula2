const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
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

const getMessageAPI = async (message) => {
  try {
    const response = await client.getCompletions(
      process.env.GPT_MODEL,
      message,
      {
        temperature: 0,
        maxTokens: 80,
      }
    );

    response.choices[0].text.trim();
    return response.choices[0].text.trim();
  } catch (error) {
    console.error(error);
    return "Ocorreu um erro , tente novamente";
  }
};

const askQuestionChatBot = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
};

(async () => {
  console.log("Seja bem vindo ao BoTChatIA");
  console.log('Digite "sair" para encerrar o chat.');

  try {
    while (true) {
      const userMessage = await askQuestionChatBot("User:");

      if (userMessage.toLowerCase() === "sair") {
        console.log("Ate logo !");
        rl.close();
        break;
      }
      const botResponse = await getMessageAPI(userMessage);
      console.log(`BoTChatIA: ${botResponse}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    rl.close();
    process.exit(1);
  }
})();
