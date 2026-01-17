export interface Message {
  role: 'user' | 'assistant';
  content: string;
  functionCalls?: Array<{ name: string; args: any }>;
}
