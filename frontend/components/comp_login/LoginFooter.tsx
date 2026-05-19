import Link from "next/link";

export default function LoginFooter() {
  return (
    <div className="text-center pt-2">
      <p className="text-sm text-slate-500">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
