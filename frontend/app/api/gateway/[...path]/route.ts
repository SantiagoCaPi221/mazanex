import { NextResponse } from "next/server";
import { BACKEND_URLS } from "@/config/endpoints";

async function handleRequest(request: Request, path: string[], method: string) {
  console.log(`[Gateway] Interceptando ${method} hacia /${path.join("/")}`);
  const [service, ...endpoint] = path;
  const targetBaseUrl =
    service === "auth" ? BACKEND_URLS.AUTH : BACKEND_URLS.PROFILE;
  const queryString = new URL(request.url).search;
  const fullUrl = `${targetBaseUrl}/${endpoint.join("/")}${queryString}`;

  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    // EL ESCUDO ANTIBUGS: Leer como texto en lugar de forzar json()
    if (method !== "GET" && method !== "DELETE") {
      const rawBody = await request.text();
      if (rawBody) {
        options.body = rawBody; // Lo pasamos tal cual viene al backend de Java
      }
    }

    const response = await fetch(fullUrl, options);

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return new NextResponse(text, { status: response.status });
    }
  } catch (error) {
    console.error(`[Gateway Crash] Falla en ${method} ${fullUrl}:`, error);
    return NextResponse.json(
      { error: `Gateway Error ${method} on ${service}` },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(req, path, "GET");
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(req, path, "POST");
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(req, path, "PUT");
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(req, path, "PATCH");
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(req, path, "DELETE");
}
