import { NextRequest, NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import fs from 'fs';
import path from 'path';

// Handle PDF downloads with async params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Track the download event
  await track('pdf_download', {
    filename: filename,
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
  });

  // Construct the path to the PDF file
  const filePath = path.join(process.cwd(), 'public', 'downloads', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  // Read the file
  const fileBuffer = fs.readFileSync(filePath);

  // Return the PDF file with appropriate headers
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
