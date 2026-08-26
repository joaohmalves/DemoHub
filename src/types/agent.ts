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
  };

  cognigy?: {
    /** Official Cognigy chat endpoint/URL used to initialize the webchat widget. */
    chatEndpoint?: string;
    /** Official Cognigy voice/WebRTC endpoint used to initialize the click-to-call widget. */
    voiceEndpoint?: string;
  };

  demoScript: {
    introduction: string;
    suggestedQuestions: string[];
    scenarios: DemoScenario[];
  };
}
