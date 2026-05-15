interface Props {
  error: string;
}

export default function LoginError({ error }: Props) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-in fade-in duration-300">
      <svg
        className="w-5 h-5 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>

      <p className="text-sm text-red-700 font-medium">{error}</p>
    </div>
  );
}
