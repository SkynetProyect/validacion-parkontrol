declare module '@browserbasehq/stagehand' {
  export class CustomOpenAIClient {
    constructor(options: unknown);
    createChatCompletion<T>(options: unknown): Promise<T>;
  }
}
