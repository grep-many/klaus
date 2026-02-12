import axios from "axios";

// Simple message type for history
interface ChatHistory {
  role: "user" | "klaus";
  content: string;
}

class AIService {
  private history: ChatHistory[] = [];
  private readonly MAX_HISTORY = 6;

  private get baseUrl() {
    return process.env.LLAMA_API_URL ;
  }

  private readonly SANTA_GRAMMAR = `root ::= [a-zA-Z0-9\\s\\.\\,\\!\\?\\']{1,150}`;

  public async getChatResponse(userMessage: string): Promise<string> {
    const historyString = this.history
      .map((h) => `${h.role === "user" ? "User" : "Klaus"}: ${h.content}`)
      .join("\n");

    const prompt = `You are Klaus, a jolly and kind Santa. You are having a friendly chat.
Rules: 
- Stay in character.
- No stage directions like (laughs) or *smiles*.
- No emojis or hashtags.
- Keep it to 1-2 sentences.

${historyString}
User: ${userMessage}
Klaus:`;

    try {
      const { data } = await axios.post(this.baseUrl, {
        prompt: prompt,
        temperature: 0.6,
        stop: ["\n", "User:", "Klaus:", "(", "*"],
        grammar: this.SANTA_GRAMMAR,
        n_predict: 100,
      });

      let reply = data.content.trim();

      // 2. Clean the reply (Double safety)
      reply = reply.replace(/\([^)]*\)/g, ""); // Removes anything in (brackets)
      reply = reply.replace(/\*[^|]*\*/g, ""); // Removes anything in *asterisks*
      reply = reply.replace(/[^\x20-\x7E]/g, "").trim(); // Removes emojis/non-ASCII

      // 3. Update History
      this.history.push({ role: "user", content: userMessage });
      this.history.push({ role: "klaus", content: reply });

      // Keep history from growing too large
      if (this.history.length > this.MAX_HISTORY) {
        this.history.shift();
        this.history.shift();
      }

      return reply || "Ho ho ho! Tell me more!";
    } catch (err) {
      console.error("Santa AI Error:", err);
      return "Ho ho ho! Merry Christmas!";
    }
  }
}

export const aiService = new AIService();
