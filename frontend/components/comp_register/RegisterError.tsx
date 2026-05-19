interface Props {
  message: string;
}

export default function RegisterError({ message }: Props) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <p className="text-sm text-red-700 font-medium">{message}</p>
    </div>
  );
}
