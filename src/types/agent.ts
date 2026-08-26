export interface DemoScenario {
  title: string;
  objective: string;
  prompt: string;
  expectedBehavior: string;
}

export interface Agent {
  id: string;
  name: string;
  industry: string;
  description: string;
  /** Short blurb used on the catalog card; `description` holds the full text for the agent page. */
  shortDescription: string;
  tags: string[];
  image: string;
  flowImage?: string;

  capabilities: {
    chat: boolean;
    voice: boolean;
    multimodal?: boolean;
  };

  demoUrls?: {
    /** URL opened when the Chat demo is launched. */
    chat?: string;

    /** URL opened when the Voice demo is launched. */
    voice?: string;

    /** URL opened when the Voice + Multimodal demo is launched. */
    multimodal?: string;
  };

  cognigy?: {
    /** Kept for compatibility with existing agent data/components. */
    chatEndpoint?: string;

    /** Kept for compatibility with existing agent data/components. */
    voiceEndpoint?: string;
  };

  demoScript: {
    introduction: string;
    suggestedQuestions: string[];
    scenarios: DemoScenario[];
  };
}