import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const { user, token, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone_no: '',
    description: '',
    type: 'personal'
  });
  const [editContact, setEditContact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch contacts for the authenticated user
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('/api/contacts', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
        },
        });
        setContacts(res.data);
      } catch (error) {
        console.error("Failed to fetch contacts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [token]);

  // Handle new contact input
  const handleNewContactChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  // Add a new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/contacts', newContact, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts([...contacts, res.data]);
      setNewContact({ name: '', phone_no: '', description: '', type: 'personal' });
    } catch (error) {
      console.error("Failed to add contact", error);
    }
  };

  // Edit a contact
  const handleEditContact = (contact) => {
    setEditContact(contact);
  };

  const handleEditContactChange = (e) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value });
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/contacts/${editContact.id}`, editContact, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts(contacts.map(c => c.id === res.data.id ? res.data : c));
      setEditContact(null);
    } catch (error) {
      console.error("Failed to update contact", error);
    }
  };

  // Delete a contact
  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error("Failed to delete contact", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      clearAuth();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!user || loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <h2>Your Contacts</h2>

      {/* Contact List */}
      <ul>
        {contacts.map(contact => (
          <li key={contact.id} className="border-b p-4">
            <h3>{contact.name}</h3>
            <p>Phone: {contact.phone_no}</p>
            <p>Description: {contact.description}</p>
            <p>Type: {contact.type}</p>
            <button onClick={() => handleEditContact(contact)} className="text-blue-500">Edit</button>
            <button onClick={() => handleDeleteContact(contact.id)} className="text-red-500 ml-2">Delete</button>
          </li>
        ))}
      </ul>

      {/* Add Contact Form */}
      <h3>Add New Contact</h3>
      <form onSubmit={handleAddContact}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newContact.name}
          onChange={handleNewContactChange}
          required
        />
        <input
          type="text"
          name="phone_no"
          placeholder="Phone No"
          value={newContact.phone_no}
          onChange={handleNewContactChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newContact.description}
          onChange={handleNewContactChange}
        />
        <select
          name="type"
          value={newContact.type}
          onChange={handleNewContactChange}
        >
          <option value="personal">Personal</option>
          <option value="business">Business</option>
          <option value="family">Family</option>
          <option value="private">Private</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Add Contact</button>
      </form>

      {/* Edit Contact Form */}
      {editContact && (
        <div>
          <h3>Edit Contact</h3>
          <form onSubmit={handleUpdateContact}>
            <input
              type="text"
              name="name"
              value={editContact.name}
              onChange={handleEditContactChange}
              required
            />
            <input
              type="text"
              name="phone_no"
              value={editContact.phone_no}
              onChange={handleEditContactChange}
              required
            />
            <input
              type="text"
              name="description"
              value={editContact.description}
              onChange={handleEditContactChange}
            />
            <select
              name="type"
              value={editContact.type}
              onChange={handleEditContactChange}
            >
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="family">Family</option>
              <option value="private">Private</option>
              <option value="other">Other</option>
            </select>
            <button type="submit">Update Contact</button>
          </form>
        </div>
      )}

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
