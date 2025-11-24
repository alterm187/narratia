import { NextRequest, NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import fs from 'fs';
import path from 'path';
import { downloadRateLimit, getClientIdentifier, checkRateLimit } from '@/lib/ratelimit';
import { logSecurityEvent } from '@/lib/security-logger';

// Whitelist of allowed downloadable files
const ALLOWED_FILES = [
  'odbicie-umyslu.pdf',
  // Add more files here as needed
];

// Handle PDF downloads with async params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Rate limiting check
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(downloadRateLimit, identifier);

  if (!rateLimitResult.success) {
    await logSecurityEvent({
      type: 'rate_limit_exceeded',
      endpoint: '/api/download',
      ip: identifier,
    });
    return rateLimitResult.response!;
  }

  const { filename } = await params;

  // Sanitize filename - remove any path components
  const sanitizedFilename = path.basename(filename);

  // Validate against whitelist
  if (!ALLOWED_FILES.includes(sanitizedFilename)) {
    await logSecurityEvent({
      type: 'file_not_whitelisted',
      endpoint: '/api/download',
      ip: identifier,
      details: { requestedFile: filename },
    });
    return new NextResponse('File not found', { status: 404 });
  }

  // Validate file extension
  if (!sanitizedFilename.endsWith('.pdf')) {
    console.warn('Attempted access to non-PDF file:', filename);
    return new NextResponse('Invalid file type', { status: 400 });
  }

  // Track the download event
  await track('pdf_download', {
    filename: sanitizedFilename,
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
  });

  // Construct the path to the PDF file
  const filePath = path.join(process.cwd(), 'public', 'downloads', sanitizedFilename);

  // Check if file exists (should always be true due to whitelist)
  if (!fs.existsSync(filePath)) {
    console.error('Whitelisted file not found on disk:', sanitizedFilename);
    return new NextResponse('File not found', { status: 404 });
  }

  // Read the file
  const fileBuffer = fs.readFileSync(filePath);

  // Return the PDF file with appropriate headers
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
    },
  });
}
