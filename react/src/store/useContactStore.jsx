import axios from "axios";
import { create } from "zustand";



const useContactStore = create((set) => ({
    contacts: [],
    getContacts: async () =>{
        
    }
}));