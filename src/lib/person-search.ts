import { callAnthropic } from "./anthropic";
import { buildPersonSearchPrompt } from "./prompts";

export async function searchPerson(params: {
  email?: string;
  linkedin?: string;
  company?: string;
  role?: string;
}): Promise<string> {
  const { email, linkedin, company, role } = params;

  if (!email && !linkedin && !company) {
    return "";
  }

  const prompt = buildPersonSearchPrompt(email, linkedin, company, role);
  const response = await callAnthropic(prompt);

  return response;
}
