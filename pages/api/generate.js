import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "A chave da API da OpenAI API não está configurada, por favor siga as instruções no README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor insira um animal válido",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Erro com a requisição da API da OpenAI: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'Um erro ocorreu durante a sua requisição.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Sugira três nomes para um animal que é um superherói.

Animal: Gato
Names: Bichano, Super Gato, Poderoso Felino
Animal: Cachorro
Names: Rex o Protetor, Canino Maravilhoso, Au Ataque
Animal: ${capitalizedAnimal}
Names:`;
}
