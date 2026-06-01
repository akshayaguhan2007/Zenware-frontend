import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-wine-dark text-cream border-wine-dark",
          description: "text-cream/70",
          actionButton: "bg-cream text-wine-dark",
          cancelButton: "bg-wine text-cream",
        },
      }}
    />
  );
}
