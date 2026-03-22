const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

export async function analyzeProject(subject, projectContent) {
  const prompt = `You are an AI educational assistant analyzing a student's project for ${subject} under the MATATAG curriculum.

Project Content: ${projectContent}

Please:
1. Ask 3-5 targeted questions to assess the student's understanding
2. Identify any weaknesses or gaps in knowledge
3. Provide specific micro-remediation suggestions

Format your response as JSON:
{
  "questions": ["question 1", "question 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "remediation": {
    "weakness1": "Short remediation guide",
    "weakness2": "Short remediation guide"
  }
}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      questions: [
        "Describe your methodology and approach.",
        "What challenges did you encounter?",
        "How does this relate to real-world applications?"
      ],
      weaknesses: ["Unable to analyze - please try again"],
      remediation: {}
    };
  }
}

export async function analyzeAnswers(subject, questions, answers) {
  const qaText = questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}`).join("\n\n");
  
  const prompt = `You are an AI educational assistant evaluating a student's answers for ${subject} under the MATATAG curriculum.

${qaText}

Analyze if the student is answering seriously and identify weaknesses. Detect:
- Joke answers, sarcasm, or non-serious responses
- Lack of understanding or effort
- Specific knowledge gaps

If answers are good and serious, return empty weaknesses array.

Format your response as JSON:
{
  "isSeriousAttempt": true,
  "weaknesses": [],
  "remediation": {},
  "feedback": "Great work! Your answers demonstrate solid understanding."
}

OR if there are issues:
{
  "isSeriousAttempt": false,
  "weaknesses": ["weakness 1", "weakness 2"],
  "remediation": {"weakness1": "guide"},
  "feedback": "Please review these areas."
}`;

  try {
    console.log("Calling Gemini API...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    
    if (!data.candidates || !data.candidates[0]) {
      throw new Error("No response from AI");
    }
    
    const text = data.candidates[0].content.parts[0].text;
    console.log("AI Text Response:", text);
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      console.log("Parsed result:", result);
      return result;
    }
    
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("AI Answer Analysis Error:", error);
    console.error("Error details:", error.message);
    
    // Demo fallback - check if answers look serious
    const avgLength = answers.reduce((sum, a) => sum + a.length, 0) / answers.length;
    const hasJokeWords = answers.some(a => 
      /\b(lol|haha|idk|dunno|whatever|meh)\b/i.test(a)
    );
    
    if (hasJokeWords || avgLength < 20) {
      return {
        isSeriousAttempt: false,
        weaknesses: ["Insufficient detail in answers", "Lacks academic tone"],
        remediation: {
          "detail": "Provide more comprehensive explanations",
          "tone": "Use formal academic language"
        },
        feedback: "Please provide more detailed, serious responses."
      };
    }
    
    // If answers seem good, return success
    return {
      isSeriousAttempt: true,
      weaknesses: [],
      remediation: {},
      feedback: `Great work! Your answers demonstrate solid understanding. (Note: AI analysis unavailable - ${error.message})`
    };
  }
}
