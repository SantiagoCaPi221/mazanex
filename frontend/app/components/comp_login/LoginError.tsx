interface Props {
  message: string;
}

export default function LoginError({ message }: Props) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-in fade-in duration-300">
      <p className="text-sm text-red-700 font-medium">{message}</p>
    </div>
  );
}
