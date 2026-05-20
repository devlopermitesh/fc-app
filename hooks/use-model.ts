import { create } from "zustand";

export type ModelType = "matchModel";

export type Modeldata = {
  username?: string;
  fantasy?: string;
};

interface UseModelProps {
  modelType: ModelType | null;
  data: Modeldata;
  instanceId: number;
  onClose: () => void;
  isOpen: boolean;
  onOpen: (type: ModelType, data?: Modeldata) => void;
}

export const useModel = create<UseModelProps>((set) => ({
  modelType: null,
  isOpen: false,
  data: {},
  instanceId: 0,
  onOpen: (type, data = {}) =>
    set((state) => ({
      isOpen: true,
      modelType: type,
      data,
      instanceId: state.instanceId + 1,
    })),
  onClose: () => set({ isOpen: false, modelType: null }),
}));
