"use strict";

(() => {
    //Register submit event:
    const gptForm = document.getElementById("gptForm");
    gptForm.addEventListener("submit", async args => {
        try {
            args.preventDefault();
            await handleUserRequest();
        }
        catch (err) {
            alert(err.message);
        }
    });

    // Handle current request:
    async function handleUserRequest() {
        const loadingElement = document.getElementById("loading");
        loadingElement.style.display = "block";

        // Get page elements:
        const languageBox = document.getElementById("languageBox");
        const levelBox = document.getElementById("levelBox");
        const numberBox = document.getElementById("numberBox");

        // Extract page values:
        const language = languageBox.value;
        const level = levelBox.value;
        const number = +numberBox.value;

        try {
            // Get questions json from ChatGPT:
            const questions = await getChatGPTQuestions(language, level, number);
            // Display Questions:
            displayChatGPTData(questions);
        }
        catch(err){
            alert(err.message);
        }
        finally{
            // Hide loading element
            loadingElement.style.display="none";
        }
    }

    // Get questions from ChatGpt
    async function getChatGPTQuestions(language, level, number) {
        const prompt = createPrompt(language, level, number);

        const completion = await getCompletion(prompt);
        return completion;
    }

    // Create Prompt:
    function createPrompt(language, level, number) {
        const prompt = `
        Write me ${number} job interview questions
        in a ${level} level
        to train me in ${language} programming language
        your answer should be in a JSON format containing an array of objects.
        each object should contain the questions and answer, in the following format:
        [{"q": "question 1" , "a": "answer 1" } , {"q": "question 2" , "a": "answer 2" }]
        `;
        return prompt;
    }

    // Display questions on the page: 
    function displayChatGPTData(questions) {
        const container = document.getElementById("container");
        questions = JSON.parse(questions);
        let html = "";
        let index = 1;
        for (const qna of questions) {
            html += `
            <p class="q" id="question-${index}">Question ${index}: ${qna.q}</p>
            <p class="a" id="answer-${index}">Answer ${index}: ${qna.a}</p>
            `;
            index++;
        }
        container.innerHTML = html;

        //Add event listeners to question elements
        for (let i = 1; i < index; i++) {
            const questionElement = document.getElementById(`question-${i}`);
            questionElement.addEventListener("click", () => {
                const answerElement = document.getElementById(`answer-${i}`);
                answerElement.style.display = 'block';
            })
        }
    }




    // function showAnswer(id){
    //     const answerParagraph = document.getElementById(id);
    //     answerParagraph.style.display="block";
    // }

    async function getCompletion(prompt) {
        const apiKey = `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`;
        const url = `https://api.openai.com/v1/engines/text-davinci-003/completions`;

        const requestBody = {
            prompt: prompt,
            max_tokens: 3500,    //Completion max tokens
            // temperature: 0.7,   //Adjust as per your requirements
            // n:1,
        };

        // Fetch options
        const options = {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        };

        // Fetch data:
        const response = await fetch(url, options);

        // Extract data as json:
        const data = await response.json();

        // Extract completion:
        const completion = data.choices[0].text;
        return completion;

    };
}
)();