import { create } from "zustand";
import { Database } from "@/types/database.types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

// Define the shape of your Address JSON
export interface AddressJson {
  [key: string]: any;
  lat?: number;
  lng?: number;
}

interface RegisterState {
  email: string;
  password: string;
  profileData: Omit<ProfileInsert, "id" | "address"> & {
    address: AddressJson; // Overriding the string type with our JSON interface
  };

  setAuthData: (data: { email?: string; password?: string }) => void;
  setProfileData: (
    data: Partial<Omit<ProfileInsert, "id" | "address">>,
  ) => void;
  setAddressData: (data: Partial<AddressJson>) => void; // Dedicated action for address
  reset: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  email: "",
  password: "",
  profileData: {
    full_name: "",
    phone_number: "",
    role: "customer",
    vehicle_type: null,
    availability_status: true,
    address: {
      lat: undefined,
      lng: undefined,
    },
  },

  setAuthData: (data) => set((state) => ({ ...state, ...data })),

  setProfileData: (data) =>
    set((state) => ({
      profileData: { ...state.profileData, ...data },
    })),

  // New action to update nested address fields
  setAddressData: (data) =>
    set((state) => ({
      profileData: {
        ...state.profileData,
        address: { ...state.profileData.address, ...data },
      },
    })),

  reset: () =>
    set({
      email: "",
      password: "",
      profileData: {
        full_name: "",
        phone_number: "",
        role: "customer",
        vehicle_type: null,
        availability_status: true,
        address: {
          lat: undefined,
          lng: undefined,
        },
      },
    }),
}));
