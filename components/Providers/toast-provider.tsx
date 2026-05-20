"use client";

import * as Toast from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastVariant = "error" | "success";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

function ToastViewportItem({
  toast,
  onOpenChange,
}: {
  toast: ToastItem;
  onOpenChange: (open: boolean) => void;
}) {
  const isError = toast.variant === "error";

  return (
    <Toast.Root
      open
      onOpenChange={onOpenChange}
      duration={isError ? 5200 : 3200}
      className={`group relative overflow-hidden rounded-[1.4rem] border px-4 py-3 shadow-[0_22px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] ${
        isError
          ? "border-red-400/25 bg-[#2a1010]/92 text-red-50"
          : "border-gold/30 bg-[#18130a]/94 text-[#f9f2db]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,196,0,0.14),transparent_48%)] opacity-80" />
      <div className="relative flex items-start gap-3">
        <div
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            isError ? "bg-red-300" : "bg-gold"
          }`}
        />
        <div className="min-w-0 flex-1">
          <Toast.Title className="text-sm font-semibold tracking-[0.02em]">
            {toast.title}
          </Toast.Title>
          {toast.description ? (
            <Toast.Description className="mt-1 text-sm leading-6 text-white/72">
              {toast.description}
            </Toast.Description>
          ) : null}
        </div>
      </div>
    </Toast.Root>
  );
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    setToasts((current) => [
      ...current,
      { ...toast, id: crypto.randomUUID() },
    ]);
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <Toast.Provider swipeDirection="right">
      <ToastContext.Provider value={contextValue}>
        {children}
        {toasts.map((toast) => (
          <ToastViewportItem
            key={toast.id}
            toast={toast}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id),
                );
              }
            }}
          />
        ))}
        <Toast.Viewport className="fixed right-4 top-4 z-[120] flex w-[min(92vw,24rem)] max-w-sm flex-col gap-3 outline-none sm:right-6 sm:top-6" />
      </ToastContext.Provider>
    </Toast.Provider>
  );
}
