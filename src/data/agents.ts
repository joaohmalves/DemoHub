import type { Agent } from '../types/agent';
import { demoUrls } from '../config/demoUrls';

// Single source of truth for the demo catalog. To add a new agent:
// 1. Push a new object here with a unique `id`.
// 2. Drop its card/flow images in `src/assets/agents/<id>/`.
// 3. Fill in `cognigy.chatEndpoint` / `voiceEndpoint` once provided by the Cognigy team.
// No component needs to change.
export const agents: Agent[] = [
  {
    id: 'healthcare-assistant',
    name: 'Vertical Hospitais',
    industry: 'Healthcare',
    shortDescription: 'Agenda consultas, tira dúvidas sobre exames e triagem inicial de sintomas.',
    description:
      'Um agente conversacional desenhado para redes hospitalares e clínicas, capaz de agendar consultas, explicar preparo de exames e conduzir uma triagem inicial de sintomas antes de encaminhar o paciente a um atendente humano.',
    tags: ['Saúde', 'Agendamento', 'Triagem'],
    image: '/agents/healthcare-assistant/card.png',
    flowImage: '/agents/healthcare-assistant/flow.svg',
    capabilities: { chat: true, voice: true },
    cognigy: {
      chatEndpoint: 'https://cognigy-endpoint-na1.nicecxone.com/6c6ed53abe1f712b58f656687c9060558bff8373e39347582507ce9f8fb84678',
      voiceEndpoint: 'https://cognigy-endpoint-na1.nicecxone.com/456783c255c89fa922870608148799c4d3e0f75429720aa66d497ec4264ad97a',
    },
    demoScript: {
      introduction:
        'Use este agente em calls com hospitais e redes de clínicas. Foque em como ele reduz carga da central de agendamento.',
      suggestedQuestions: [
        'Quero marcar uma consulta com cardiologista',
        'Preciso jejuar para o exame de sangue de amanhã?',
        'Estou com dor de cabeça forte há dois dias, o que eu faço?',
      ],
      scenarios: [
        {
          title: 'Agendamento de consulta',
          objective: 'Mostrar que o agente entende especialidade + urgência sem formulário rígido.',
          prompt: 'Quero marcar uma consulta com cardiologista para essa semana',
          expectedBehavior:
            'O agente pergunta preferência de data/turno, confirma convênio e oferece horários disponíveis.',
        },
        {
          title: 'Dúvida sobre preparo de exame',
          objective: 'Demonstrar respostas factuais consistentes puxadas da base de conhecimento.',
          prompt: 'Posso comer antes do exame de sangue de amanhã?',
          expectedBehavior: 'Explica o jejum necessário e horário limite, sem inventar informação clínica.',
        },
        {
          title: 'Triagem de sintoma',
          objective: 'Mostrar o limite de segurança: o agente orienta, mas não diagnostica.',
          prompt: 'Estou com dor no peito e falta de ar',
          expectedBehavior: 'Reconhece sintoma de risco e orienta busca por atendimento de urgência imediatamente.',
        },
      ],
    },
  },
  {
    id: 'retail-concierge',
    name: 'Vertical Varejo',
    industry: 'Varejo',
    shortDescription: 'Recomendações de produto, status de pedido e trocas/devoluções.',
    description:
      'Agente de atendimento para e-commerce e varejo físico integrado, capaz de recomendar produtos, consultar status de pedido em tempo real e conduzir o fluxo de troca/devolução.',
    tags: ['Varejo', 'E-commerce', 'Pós-venda'],
    image: '/agents/retail-concierge/card.png',
    flowImage: '/agents/retail-concierge/flow.svg',
    capabilities: { chat: true, voice: false },
    cognigy: { chatEndpoint: '' },
    demoScript: {
      introduction: 'Ideal para calls com clientes de varejo focados em reduzir custo de atendimento de pós-venda.',
      suggestedQuestions: [
        'Qual o status do meu pedido #48213?',
        'Quero trocar um produto por outro tamanho',
        'Vocês têm esse tênis em outra cor?',
      ],
      scenarios: [
        {
          title: 'Consulta de pedido',
          objective: 'Mostrar integração em tempo real com o sistema de pedidos.',
          prompt: 'Qual o status do meu pedido #48213?',
          expectedBehavior: 'Retorna status atualizado e previsão de entrega sem precisar de atendente humano.',
        },
        {
          title: 'Troca guiada',
          objective: 'Demonstrar fluxo transacional completo dentro do chat.',
          prompt: 'Quero trocar o tênis que comprei por um tamanho maior',
          expectedBehavior: 'Confirma o item, verifica estoque do novo tamanho e gera o código de troca.',
        },
      ],
    },
  },
  {
    id: 'banking-support',
    name: 'Vertical Financeiro',
    industry: 'Financeiro',
    shortDescription: 'Segunda via de boleto, limite de cartão e bloqueio de cartão perdido.',
    description:
      'Agente para instituições financeiras cobrindo as solicitações de maior volume no call center: segunda via de fatura, consulta e ajuste de limite, e bloqueio emergencial de cartão.',
    tags: ['Financeiro', 'Cartões', 'Autoatendimento'],
    image: '/agents/banking-support/card.png',
    flowImage: '/agents/banking-support/flow.svg',
    capabilities: {
      chat: true,
      voice: true,
      multimodal: true,
    },
    demoUrls: demoUrls.onebank,
    demoScript: {
      introduction: 'Use com bancos e fintechs — destaque a redução de chamadas transferidas para humano (deflection).',
      suggestedQuestions: [
        'Preciso da segunda via do meu boleto',
        'Quero bloquear meu cartão, acho que perdi',
        'Consigo aumentar meu limite?',
      ],
      scenarios: [
        {
          title: 'Bloqueio de cartão',
          objective: 'Mostrar priorização de um fluxo sensível/urgente com poucas perguntas.',
          prompt: 'Perdi meu cartão, preciso bloquear agora',
          expectedBehavior: 'Confirma identidade rapidamente e bloqueia o cartão sem etapas desnecessárias.',
        },
        {
          title: 'Segunda via de boleto',
          objective: 'Fluxo de autoatendimento clássico, alto volume.',
          prompt: 'Preciso da segunda via do boleto do mês passado',
          expectedBehavior: 'Gera e envia o boleto atualizado, com nova data de vencimento se aplicável.',
        },
      ],
    },
  },
  {
    id: 'telco-care',
    name: 'Vertical Telecom',
    industry: 'Telecom',
    shortDescription: 'Suporte técnico de internet, troca de plano e faturas.',
    description:
      'Agente voltado a operadoras de telecom, cobrindo troubleshooting básico de conexão, upgrade/downgrade de plano e consulta de fatura — reduzindo volume no suporte N1.',
    tags: ['Telecom', 'Suporte técnico', 'Faturamento'],
    image: '/agents/telco-care/card.png',
    flowImage: '/agents/telco-care/flow.png',
    capabilities: { chat: true, voice: true },
    cognigy: {
      chatEndpoint: 'https://cognigy-endpoint-na1.nicecxone.com/0d438fe6eeb52c919c3bfa1d03d25007f15fad922e6dbd126a1ae0b640a72329',
      voiceEndpoint: 'https://cognigy-endpoint-na1.nicecxone.com/487d1c76c1f190243b16bb40eea735d6bbf7a89409c2eda7165433464456adac',
    },
    demoScript: {
      introduction: 'Boa demo para operadoras que querem reduzir chamadas de suporte N1 repetitivas.',
      suggestedQuestions: [
        'Minha internet está lenta, pode me ajudar?',
        'Quero mudar de plano',
        'Quanto veio minha fatura desse mês?',
      ],
      scenarios: [
        {
          title: 'Troubleshooting guiado',
          objective: 'Mostrar um fluxo de diagnóstico passo a passo antes de escalar.',
          prompt: 'Minha internet está caindo toda hora',
          expectedBehavior: 'Conduz checklist básico (reiniciar roteador, checar luzes) antes de abrir chamado técnico.',
        },
        {
          title: 'Upgrade de plano',
          objective: 'Demonstrar capacidade de upsell natural dentro da conversa.',
          prompt: 'Quero um plano com mais velocidade',
          expectedBehavior: 'Sugere opções compatíveis com o endereço do cliente e confirma a mudança.',
        },
      ],
    },
  },
  {
    id: 'insurance-support',
    name: 'Vertical Seguradora',
    industry: 'Seguros',
    shortDescription: 'Atendimento de seguros, abertura de sinistros e agendamento de serviços.',
    description:
      'Agente virtual da OneSeguros voltado ao atendimento de clientes de seguros, permitindo abertura e acompanhamento de sinistros, solicitação de serviços e agendamento de assistência. O cliente pode realizar o atendimento de forma natural por voz ou utilizar XApps para preencher informações e concluir processos de forma interativa.',
    tags: ['Seguros', 'Sinistros', 'Assistência', 'Agendamento'],
    image: '/agents/insurance-support/card.png',
    flowImage: '/agents/insurance-support/flow.png',
    capabilities: { chat: true, voice: true },
    cognigy: {
      chatEndpoint: 'https://cognigy-endpoint-na1.nicecxone.com/456f0dfd0270c5d859f18d68d02672785d263ab351ccf7af02d133093be319e9',
      voiceEndpoint: 'https://cognigy-endpoint-na1.nicecxone.com/b119493a97b8f0d410515412060312a7e10ef6793997ae7ab7aee02f888db6a8',
    },
    demoScript: {
      introduction:
        'Demonstração da OneSeguros mostrando como um agente de IA pode automatizar o atendimento de segurados por voz e XApps, desde a abertura de sinistros até o agendamento de serviços.',
      suggestedQuestions: [
        'Quero abrir um sinistro',
        'Preciso agendar um serviço',
        'Quero abrir um sinistro pelo celular',
      ],
      scenarios: [
        {
          title: 'Abertura de sinistro por voz',
          objective:
            'Demonstrar a abertura de um sinistro de forma natural durante uma ligação, sem necessidade de atendimento humano.',
          prompt: 'Quero abrir um sinistro, bati o meu carro',
          expectedBehavior:
            'Conduz o cliente por uma conversa natural, coleta as informações necessárias sobre o acidente, confirma os dados e registra a solicitação de sinistro.',
        },
        {
          title: 'Abertura de sinistro via XApp',
          objective:
            'Demonstrar como o cliente pode utilizar uma interface XApp durante a conversa para enviar informações e concluir a abertura do sinistro.',
          prompt: 'Quero abrir um sinistro e prefiro preencher as informações pelo celular',
          expectedBehavior:
            'Apresenta uma XApp com os campos necessários para o sinistro, permite o preenchimento das informações pelo cliente e confirma a abertura após o envio.',
        },
        {
          title: 'Agendamento de serviço',
          objective:
            'Demonstrar o agendamento de um serviço de assistência de forma rápida e automatizada.',
          prompt: 'Preciso agendar um serviço para o meu carro',
          expectedBehavior:
            'Identifica o serviço necessário, consulta as opções disponíveis, apresenta datas e horários e confirma o agendamento escolhido pelo cliente.',
        },
      ],
    },
  },
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
