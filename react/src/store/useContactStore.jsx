import axios from "axios";
import { create } from "zustand";
import useAuthStore from "./useAuthStore";

const useContactStore = create((set) => ({
    contacts: [],

    // Add a new contact
    addContact: async (contact) => {
        const token = useAuthStore.getState().token;
        try {
            const res = await axios.post('/api/contacts', contact, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update contacts state with the new contact
            set((state) => ({
                contacts: [...state.contacts, res.data],
            }));
        } catch (error) {
            console.log("Failed to add contact", error);
        }
    },

    // Fetch all contacts
    getContacts: async () => {
        const token = useAuthStore.getState().token;
        try {
            const res = await axios.get('/api/contacts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Set the fetched contacts in the state
            set({ contacts: res.data });
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        }
    },

    // Update an existing contact
    updateContact: async (id, contact) => {
        const token = useAuthStore.getState().token;
        try {
            const res = await axios.put(`/api/contacts/${id}`, contact, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update the contact in the state
            set((state) => ({
                contacts: state.contacts.map((c) => (c.id === res.data.id ? res.data : c)),
            }));
        } catch (error) {
            console.error("Failed to update contact", error);
        }
    },

    // Delete a contact
    deleteContact: async (id) => {
        const token = useAuthStore.getState().token;
        try {
            await axios.delete(`/api/contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Remove the contact from the state
            set((state) => ({
                contacts: state.contacts.filter((c) => c.id !== id),
            }));
        } catch (error) {
            console.error("Failed to delete contact", error);
        }
    },
}));

export default useContactStore;
