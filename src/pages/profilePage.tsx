import { FormEvent, useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { changeEmail, changePassword } from '../services/profile';
import { Button } from '../components/common/Button';
import styles from './profilePage.module.css';

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function ProfilePage() {
  const { user, loading: userLoading } = useCurrentUser();

  // ---- Troca de senha ----
  const [currentPasswordForPw, setCurrentPasswordForPw] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // ---- Troca de login (e-mail) ----
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!isStrongPassword(newPassword)) {
      setPwError(
        'A nova senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('A confirmação não corresponde à nova senha.');
      return;
    }

    setPwLoading(true);

    try {
      await changePassword(currentPasswordForPw, newPassword);
      setPwSuccess('Senha alterada com sucesso.');
      setCurrentPasswordForPw('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Erro ao alterar senha.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);

    try {
      await changeEmail(currentPasswordForEmail, newEmail);
      setEmailSuccess('Login alterado com sucesso. Use o novo login no próximo acesso.');
      setCurrentPasswordForEmail('');
      setNewEmail('');
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Erro ao alterar login.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Meu perfil</h1>

      {!userLoading && user && (
        <p className={styles.subtitle}>
          Logado como <strong>{user.email ?? user.displayName}</strong>
        </p>
      )}

      <div className={styles.grid}>
        {/* ================================================== */}
        {/* TROCA DE SENHA */}
        {/* ================================================== */}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Alterar senha</h2>
          <p className={styles.cardHint}>
            Por segurança, você pode trocar a senha no máximo a cada 10 minutos.
          </p>

          <form className={styles.form} onSubmit={handlePasswordSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Senha atual</span>
              <input
                className={styles.input}
                type="password"
                value={currentPasswordForPw}
                onChange={(e) => setCurrentPasswordForPw(e.target.value)}
                autoComplete="current-password"
                disabled={pwLoading}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Nova senha</span>
              <input
                className={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={pwLoading}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Confirmar nova senha</span>
              <input
                className={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={pwLoading}
                required
              />
            </label>

            {pwError && <p className={styles.error}>{pwError}</p>}
            {pwSuccess && <p className={styles.success}>{pwSuccess}</p>}

            <Button type="submit" className={styles.submit} disabled={pwLoading}>
              {pwLoading ? 'Salvando...' : 'Alterar senha'}
            </Button>
          </form>
        </section>

        {/* ================================================== */}
        {/* TROCA DE LOGIN */}
        {/* ================================================== */}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Alterar login</h2>
          <p className={styles.cardHint}>
            Por segurança, você pode trocar o login no máximo a cada 10 minutos.
          </p>

          <form className={styles.form} onSubmit={handleEmailSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Senha atual</span>
              <input
                className={styles.input}
                type="password"
                value={currentPasswordForEmail}
                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                autoComplete="current-password"
                disabled={emailLoading}
                required
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Novo login (e-mail)</span>
              <input
                className={styles.input}
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
                disabled={emailLoading}
                required
              />
            </label>

            {emailError && <p className={styles.error}>{emailError}</p>}
            {emailSuccess && <p className={styles.success}>{emailSuccess}</p>}

            <Button type="submit" className={styles.submit} disabled={emailLoading}>
              {emailLoading ? 'Salvando...' : 'Alterar login'}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}