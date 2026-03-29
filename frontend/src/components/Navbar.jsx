import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { setToken } = useAuthContext();

  const onLogout = (ev) => {
    ev.preventDefault();
    setToken(null);
  };

  return (
    <nav style={{ display: 'flex', gap: '10px', padding: '15px 20px', background: '#2c3e50', color: '#fff', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>My App</Link>
      <div style={{ marginLeft: 'auto' }}>
        <button onClick={onLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  )
}
