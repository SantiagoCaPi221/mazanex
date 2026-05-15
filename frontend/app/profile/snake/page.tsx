import GoogleSnake from "@/components/GoogleSnake";

export default function Page() {
  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-slate-800">Snake</h2>
        <p className="text-slate-500 font-medium italic"></p>
      </div>

      <div className="flex justify-center">
        <GoogleSnake />
      </div>
    </div>
  );
}
