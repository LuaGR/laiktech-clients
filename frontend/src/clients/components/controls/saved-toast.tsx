import { Check } from "lucide-react";

interface SavedToastProps {
  visible: boolean;
}

export function SavedToast({ visible }: SavedToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg shadow-lg animate-fade-in">
      <Check className="w-4 h-4" />
      Cambios guardados exitosamente
    </div>
  );
}
