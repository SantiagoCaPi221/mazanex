import Link from "next/link";

export default function RegisterFooter() {
  return (
    <p className="text-center text-sm text-slate-600">
      ¿Ya tienes cuenta?{" "}
      <Link href="/app/login" className="text-indigo-600 font-bold">
        Inicia sesión aquí
      </Link>
    </p>
  );
}
