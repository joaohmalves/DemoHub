export interface DemoScenario {
  title: string;
  objective: string;
  prompt: string;
  expectedBehavior: string;
}

export interface DemoUrls {
  chat?: string;
  voice?: string;
  multimodal?: string;
}

export interface Agent {
  id: string;
  name: string;
  industry: string;
  description: string;
  shortDescription: string;
  tags: string[];
  image: string;
  flowImage?: string;

  capabilities: {
    chat: boolean;
    voice: boolean;
    multimodal?: boolean;
  };

  demoUrls?: DemoUrls;

  cognigy?: {
    chatEndpoint?: string;
    voiceEndpoint?: string;
  };

  demoScript: {
    introduction: string;
    suggestedQuestions: string[];
    scenarios: DemoScenario[];
  };
}