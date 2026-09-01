import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminDemos } from '../hooks/useAdminDemos';
import type { Agent, DemoScenario } from '../types/agent';
import styles from './AdminFlowFormPage.module.css';

const emptyScenario: DemoScenario = {
  title: '',
  objective: '',
  prompt: '',
  expectedBehavior: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function AdminFlowFormPage() {
  const { flowId } = useParams<{ flowId: string }>();
  const isNew = flowId === 'new';
  const navigate = useNavigate();

  const { demos, loading, saving, error, createDemo, updateDemo } = useAdminDemos();

  const [id, setId] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [flowImage, setFlowImage] = useState('');
  const [chatEndpoint, setChatEndpoint] = useState('');
  const [voiceEndpoint, setVoiceEndpoint] = useState('');
  const [multimodalUrl, setMultimodalUrl] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState('');
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || loading) return;

    const existing = demos.find((d) => d.id === flowId);
    if (!existing) return;

    const a = existing.payload;
    setId(a.id);
    setIdTouched(true);
    setName(a.name ?? '');
    setIndustry(a.industry ?? '');
    setShortDescription(a.shortDescription ?? '');
    setDescription(a.description ?? '');
    setTags((a.tags ?? []).join(', '));
    setImage(a.image ?? '');
    setFlowImage(a.flowImage ?? '');
    setChatEndpoint(a.cognigy?.chatEndpoint ?? '');
    setVoiceEndpoint(a.cognigy?.voiceEndpoint ?? '');
    setMultimodalUrl(a.demoUrls?.multimodal ?? '');
    setIntroduction(a.demoScript?.introduction ?? '');
    setSuggestedQuestions((a.demoScript?.suggestedQuestions ?? []).join('\n'));
    setScenarios(a.demoScript?.scenarios ?? []);
  }, [isNew, loading, demos, flowId]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!idTouched) setId(slugify(value));
  };

  const updateScenario = (index: number, field: keyof DemoScenario, value: string) => {
    setScenarios((current) =>
      current.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const removeScenario = (index: number) => {
    setScenarios((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!id.trim() || !name.trim() || !description.trim()) {
      setFormError('Nome, descrição e id são obrigatórios.');
      return;
    }

    if (!chatEndpoint.trim() && !voiceEndpoint.trim() && !multimodalUrl.trim()) {
      setFormError('Informe pelo menos um endpoint (chat, voz ou multimodal).');
      return;
    }

    const payload: Agent = {
      id: id.trim(),
      name: name.trim(),
      industry: industry.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      image: image.trim(),
      flowImage: flowImage.trim() || undefined,
      capabilities: {
        chat: !!chatEndpoint.trim(),
        voice: !!voiceEndpoint.trim(),
        multimodal: !!multimodalUrl.trim(),
      },
      cognigy: {
        chatEndpoint: chatEndpoint.trim() || undefined,
        voiceEndpoint: voiceEndpoint.trim() || undefined,
      },
      demoUrls: multimodalUrl.trim() ? { multimodal: multimodalUrl.trim() } : undefined,
      demoScript: {
        introduction: introduction.trim(),
        suggestedQuestions: suggestedQuestions
          .split('\n')
          .map((q) => q.trim())
          .filter(Boolean),
        scenarios: scenarios.filter((s) => s.title.trim() && s.prompt.trim()),
      },
    };

    try {
      if (isNew) {
        await createDemo(id.trim(), payload);
      } else {
        await updateDemo(id.trim(), payload, true);
      }
      navigate('/admin/flows');
    } catch {
      // erro já é exposto via `error` do hook
    }
  };

  if (!isNew && loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate('/admin/flows')}>
        ← Voltar para Flows
      </button>

      <h1 className={styles.title}>{isNew ? 'Adicionar nova demo' : `Editar: ${name}`}</h1>

      {(formError || error) && <div className={styles.error}>{formError ?? error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Informações básicas</h2>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Nome *</label>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Vertical Hospitais"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Id (slug) *</label>
              <input
                className={styles.input}
                value={id}
                disabled={!isNew}
                onChange={(e) => {
                  setIdTouched(true);
                  setId(slugify(e.target.value));
                }}
                placeholder="healthcare-assistant"
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Indústria</label>
              <input
                className={styles.input}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Healthcare"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tags (separadas por vírgula)</label>
              <input
                className={styles.input}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Saúde, Agendamento, Triagem"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição curta *</label>
            <input
              className={styles.input}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Aparece no card do catálogo"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição completa *</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Endpoints *</h2>
          <p className={styles.sectionHint}>
            Pelo menos um é obrigatório. Chat e Voice abrem como widget na própria página;
            Multimodal abre em nova aba.
          </p>

          <div className={styles.field}>
            <label className={styles.label}>Chat endpoint (Cognigy)</label>
            <input
              className={styles.input}
              value={chatEndpoint}
              onChange={(e) => setChatEndpoint(e.target.value)}
              placeholder="https://cognigy-endpoint-na1.nicecxone.com/..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Voice endpoint (Cognigy)</label>
            <input
              className={styles.input}
              value={voiceEndpoint}
              onChange={(e) => setVoiceEndpoint(e.target.value)}
              placeholder="https://cognigy-endpoint-na1.nicecxone.com/..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>URL Multimodal (abre em nova aba)</label>
            <input
              className={styles.input}
              value={multimodalUrl}
              onChange={(e) => setMultimodalUrl(e.target.value)}
              placeholder="https://onebank-app.exemplo.com"
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Imagens (opcional)</h2>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Imagem do card</label>
              <input
                className={styles.input}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/agents/healthcare-assistant/card.png"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Imagem do fluxo</label>
              <input
                className={styles.input}
                value={flowImage}
                onChange={(e) => setFlowImage(e.target.value)}
                placeholder="/agents/healthcare-assistant/flow.svg"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Demo script (opcional)</h2>

          <div className={styles.field}>
            <label className={styles.label}>Introdução</label>
            <textarea
              className={styles.textarea}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Perguntas sugeridas (uma por linha)</label>
            <textarea
              className={styles.textarea}
              value={suggestedQuestions}
              onChange={(e) => setSuggestedQuestions(e.target.value)}
              rows={4}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.scenariosHeader}>
            <h2 className={styles.sectionTitle}>Cenários (opcional)</h2>
            <button
              type="button"
              className={styles.smallButton}
              onClick={() => setScenarios((s) => [...s, { ...emptyScenario }])}
            >
              + Adicionar cenário
            </button>
          </div>

          {scenarios.map((scenario, index) => (
            <div key={index} className={styles.scenarioCard}>
              <div className={styles.scenarioTop}>
                <strong>Cenário {index + 1}</strong>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeScenario(index)}
                >
                  Remover
                </button>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <input
                  className={styles.input}
                  value={scenario.title}
                  onChange={(e) => updateScenario(index, 'title', e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Objetivo</label>
                <input
                  className={styles.input}
                  value={scenario.objective}
                  onChange={(e) => updateScenario(index, 'objective', e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Prompt de exemplo</label>
                <input
                  className={styles.input}
                  value={scenario.prompt}
                  onChange={(e) => updateScenario(index, 'prompt', e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Comportamento esperado</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={scenario.expectedBehavior}
                  onChange={(e) => updateScenario(index, 'expectedBehavior', e.target.value)}
                />
              </div>
            </div>
          ))}
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/admin/flows')}
          >
            Cancelar
          </button>

          <button type="submit" className={styles.submitButton} disabled={saving}>
            {saving ? 'Salvando...' : isNew ? 'Criar demo' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}