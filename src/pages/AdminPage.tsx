import { Link } from 'react-router-dom';

export function AdminPage() {
  return (
    <div>
      <h1>Administração</h1>

      <p>
        Gerencie usuários, demos e configurações do Demo Hub.
      </p>

      <div>
        <Link to="/admin/users">
          Gerenciar usuários
        </Link>
      </div>

      <div>
        <Link to="/admin/demos">
          Gerenciar demos
        </Link>
      </div>

      <div>
        <Link to="/admin/audit">
          Auditoria
        </Link>
      </div>
    </div>
  );
}