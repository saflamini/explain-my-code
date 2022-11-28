import { Configuration, OpenAIApi } from "openai";

//get configuration from Configuration class + API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);

//can come back to this to give our users a prefix to build from... this is one of the main value adds of the entire application
const basePromptPrefix = 'Explain this ';

const generateAction = async (req, res) => {
    //run first prompt by concatenating user input from request and the base prompt prefix
    // console.log(req.body['userInput'])
    const input = JSON.parse(req.body).userInput;
    const language = JSON.parse(req.body).language.anchorKey

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-002', //the model we're using: may want to change this
        prompt: `$This is ${language} code: ${input} 
        Here I'll explain the code to like you're a freshman computer science student. The following is an explanation that will help you understand what is happening, and HOW the code works overall: `,
        temperature: 0.5, // can tune these parameters based on what the model needs
        max_tokens: 600, // can tune these parameters based on what the model needs
        top_p: 1
    });

    const basePromptOutput = baseCompletion.data.choices.pop();
    console.log(basePromptOutput)
    // //prompt 2 - using prompt chain
    // const secondPrompt = `
    // $This is ${language} code: ${input} 
    
    // Here, we'll explain it to you like you're a freshman computer science student:

    // ${basePromptOutput}

    // Can I have a better explanation that explains the most important parts?
    // `

    // const secondPromptCompletion = await openai.createCompletion({
    //     model: 'text-davinci-002',
    //     prompt: `${base}`,
    //     temperature: 0.7,
    //     max_tokens: 500,
    // })

    // const secondPromptOutput = secondPromptCompletion.data.choices.pop();
    // console.log(secondPromptOutput)
    res.status(200).json({ output: basePromptOutput })
}

export default generateAction;