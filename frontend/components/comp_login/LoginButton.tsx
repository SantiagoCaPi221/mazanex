interface Props {
  isLoading: boolean;
}

export default function LoginButton({ isLoading }: Props) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
    >
      {isLoading ? "Verificando..." : "Iniciar Sesión"}
    </button>
  );
}
