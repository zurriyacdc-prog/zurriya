import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const fileUrl = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename') ?? 'document';

  if (!fileUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!supabaseBase || !fileUrl.startsWith(supabaseBase)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) {
      return new NextResponse('File not found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return new NextResponse('Failed to download file', { status: 500 });
  }
}
