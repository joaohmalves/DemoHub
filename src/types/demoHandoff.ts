export interface DemoHandoffOptions {
  /**
   * URL base da demo que será aberta.
   */
  baseUrl: string;

  /**
   * Parâmetros adicionais que a demo pode precisar receber.
   * Exemplo: tenant, idioma, ambiente etc.
   */
  params?: Record<string, string>;
}

export interface DemoHandoffResult {
  url: string;
  code: string;
  expiresAt?: string;
}

export interface DemoHandoff {
  create(options: DemoHandoffOptions): Promise<DemoHandoffResult>;
}