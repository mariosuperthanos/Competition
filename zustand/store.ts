"use client";

import { create } from "zustand";

const useStore = create<{
  isNextPage;
  tags;
  searchCriteria;
  events: any; // Replace 'any' with the specific type of your data if known
  setEvents: (data: any) => void; // Replace 'any' with the specific type of your data if known
}>((set) => ({
  isNextPage: false,
  tags: [],
  searchCriteria: {
    contains: "",
    country: "",
    city: "",
    date: "",
  },
  events: null,
  setEvents: (data) => {
    console.log("Setting new events:", data); // Log pentru datele pe care le setezi
    set({ events: data });
  },
}));

export default useStore;