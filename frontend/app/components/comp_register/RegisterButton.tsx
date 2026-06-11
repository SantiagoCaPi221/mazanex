interface Props {
  isLoading: boolean;
}

export default function RegisterButton({ isLoading }: Props) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
    >
      {isLoading ? "Creando cuenta..." : "Registrarse"}
    </button>
  );
}
