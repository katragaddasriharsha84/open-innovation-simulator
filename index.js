const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: functions.config().openai.key
});
const openai = new OpenAIApi(configuration);

exports.generateExplanation = functions.https.onRequest(async (req, res) => {
  try {
    const { partner, budget } = req.body;

    const prompt = `Simulate an open innovation project:
Partner Type: ${partner}
Budget Level: ${budget}
Explain Success / Partial Failure / Failure with reason.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });

    const explanation = completion.data.choices[0].message.content;

    res.status(200).send({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).send({ explanation: "⚠ Could not generate explanation. Try again." });
  }
});
