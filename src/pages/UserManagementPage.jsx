import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [addUserError, setAddUserError] = useState('');


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (err) {
      setError('Greška pri učitavanju korisnika.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    if (!newUsername || !newPassword) {
      setAddUserError('Korisničko ime i lozinka ne mogu biti prazni.');
      return;
    }

    try {
      const existingUsers = await axios.get(`http://localhost:5000/users?username=${newUsername}`);
      if (existingUsers.data.length > 0) {
        setAddUserError('Korisničko ime već postoji.');
        return;
      }

      const newUser = {
        id: `user${Date.now()}`,
        username: newUsername,
        password: newPassword,
        role: newRole
      };
      await axios.post('http://localhost:5000/users', newUser);
      await axios.post('http://localhost:5000/wallets', { userId: newUser.id, balances: {} }); // Kreiraj novčanik
      fetchUsers();
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
    } catch (err) {
      setAddUserError('Greška pri dodavanju korisnika.');
      console.error(err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setNewPassword(user.password);
    setNewRole(user.role);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    if (!newUsername || !newPassword || !editingUser) {
      setAddUserError('Sva polja moraju biti popunjena za ažuriranje.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/users/${editingUser.id}`, {
        username: newUsername,
        password: newPassword,
        role: newRole
      });
      fetchUsers();
      setEditingUser(null);
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
    } catch (err) {
      setAddUserError('Greška pri ažuriranju korisnika.');
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        alert("Korisnik obrisan! (Imajte na umu da povezani novčanici i transakcije moraju biti ručno obrisani iz db.json za potpunu konzistentnost u ovom simuliranom okruženju).");
        fetchUsers();
      } catch (err) {
        setError('Greška pri brisanju korisnika.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-lg mt-8">Učitavanje korisnika...</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Upravljanje Korisnicima</h1>

      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold mb-4">{editingUser ? 'Ažuriraj Korisnika' : 'Dodaj Novog Korisnika'}</h2>
        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Korisničko Ime:
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Lozinka:
            </label>
            <input
              type="text"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Uloga:
            </label>
            <select
              id="role"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {addUserError && <p className="text-red-500 text-xs italic mb-4">{addUserError}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              {editingUser ? 'Ažuriraj' : 'Dodaj Korisnika'}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={() => { setEditingUser(null); setNewUsername(''); setNewPassword(''); setNewRole('user'); }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ml-4"
              >
                Poništi
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Lista Korisnika</h2>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Korisničko Ime</th>
              <th className="py-2 px-4 border-b text-left">Uloga</th>
              <th className="py-2 px-4 border-b text-left">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded mr-2"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;