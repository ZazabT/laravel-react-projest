import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useContactStore from "../store/useContactStore";
import Modal from "../components/Modal"; // Assume you have a Modal component
import '../css/loader.css';

const HomePage = () => {
  const { user, token, clearAuth } = useAuthStore();
  const { getContacts, deleteContact, updateContact, contacts, addContact } = useContactStore();
  const navigate = useNavigate();
  const [newContact, setNewContact] = useState({
    name: '',
    phone_no: '',
    description: '',
    type: 'personal',
  });
  const [editContact, setEditContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch contacts for the authenticated user
  useEffect(() => {
    const fetchContacts = async () => {
      await getContacts();
      setLoading(false);
    };
    fetchContacts();
  }, [token, getContacts]);

  // Handle new contact input
  const handleNewContactChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  // Add a new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    addContact(newContact);
    setNewContact({ name: '', phone_no: '', description: '', type: 'personal' });
    setIsAddModalOpen(false);
  };

  // Edit a contact
  const handleEditContact = (contact) => {
    setEditContact(contact);
    setIsEditModalOpen(true);
  };

  const handleEditContactChange = (e) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value });
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    updateContact(editContact.id, editContact);
    setEditContact(null);
    setIsEditModalOpen(false);
  };

  // Delete a contact
  const handleDeleteContact = async (id) => {
    deleteContact(id);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      clearAuth();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
    
  }

  return (
    <div className="container mx-auto py-10 px-6 lg:px-8 relative">
      {/* Top Navigation Bar */}
      

      <header className="text-center mb-12"><nav className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded mb-6">
        <h2 className="text-lg font-semibold">Welcome, {user.name}</h2>
        <button
          onClick={handleLogout}
          className=" py-2 px-4 rounded-lg hover:text-red-600"
        >
          Logout
        </button>
      </nav>
        <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-indigo-600">Manage Your Contacts</h1>
        <p className="text-lg text-gray-600">Organize your contacts with ease</p>
      </header>

     <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-1 p-6 rounded-lg">
  {contacts && contacts.length > 0 ? (
    contacts.map(contact => (
      <div key={contact.id} className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{contact.name}</h3>
        <p className="text-gray-600 mb-1"><strong>Phone:</strong> {contact.phone_no}</p>
        <p className="text-gray-600 mb-1"><strong>Description:</strong> {contact.description || "N/A"}</p>
        <p className="text-gray-600 mb-4"><strong>Type:</strong> {contact.type}</p>
        <div className="flex justify-between">
          <button onClick={() => handleEditContact(contact)} className="text-blue-500 hover:underline">Edit</button>
          <button onClick={() => handleDeleteContact(contact.id)} className="text-red-500 hover:underline">Delete</button>
        </div>
      </div>
    ))
  ) : (
    <div className="flex justify-center items-center h-full w-full text-gray-500 text-lg">
      No contacts yet. Add your first contact!
    </div>
  )}
</section>


      {/* Add Contact Button at Bottom Center */}
      <div className="flex justify-center mb-6 fixed bottom-10 left-0 right-0">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition text-2xl"
        >
          +
        </button>
      </div>

      {/* Add Contact Modal */}
<Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
  <div className="relative">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Contact</h3>
    <button
      onClick={() => setIsAddModalOpen(false)}
      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
    >
      &times; {/* Close icon */}
    </button>
    <form onSubmit={handleAddContact} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newContact.name}
        onChange={handleNewContactChange}
        className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
        required
      />
      <input
        type="text"
        name="phone_no"
        placeholder="Phone No"
        value={newContact.phone_no}
        onChange={handleNewContactChange}
        className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newContact.description}
        onChange={handleNewContactChange}
        className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
      />
      <select
        name="type"
        value={newContact.type}
        onChange={handleNewContactChange}
        className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
      >
        <option value="personal">Personal</option>
        <option value="business">Business</option>
        <option value="family">Family</option>
        <option value="private">Private</option>
        <option value="other">Other</option>
      </select>
      <button type="submit" className="bg-indigo-600 text-white py-3 px-6 rounded-lg w-full hover:bg-indigo-700 transition">
        Add Contact
      </button>
    </form>
  </div>
</Modal>

{/* Edit Contact Modal */}
{editContact && (
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
    <div className="relative">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Contact</h3>
      <button
        onClick={() => setIsEditModalOpen(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
      >
        &times; {/* Close icon */}
      </button>
      <form onSubmit={handleUpdateContact} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <input
          type="text"
          name="name"
          value={editContact.name}
          onChange={handleEditContactChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
          required
        />
        <input
          type="text"
          name="phone_no"
          value={editContact.phone_no}
          onChange={handleEditContactChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
          required
        />
        <input
          type="text"
          name="description"
          value={editContact.description}
          onChange={handleEditContactChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
        />
        <select
          name="type"
          value={editContact.type}
          onChange={handleEditContactChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:border-indigo-500"
        >
          <option value="personal">Personal</option>
          <option value="business">Business</option>
          <option value="family">Family</option>
          <option value="private">Private</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" className="bg-green-600 text-white py-3 px-6 rounded-lg w-full hover:bg-green-700 transition">
          Update Contact
        </button>
      </form>
    </div>
  </Modal>
)}

    </div>
  );
};

export default HomePage;
