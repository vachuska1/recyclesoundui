import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Just return success - the actual email will be handled client-side
    return NextResponse.json({ 
      success: true, 
      message: 'Form data received',
      data: { name, email, phone, message }
    });
  } catch (error: any) {
    // Log the complete error details
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      response: error.response,
      command: error.command,
      responseCode: error.responseCode,
      responseMessage: error.responseMessage
    });

    // Return detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: {
          message: error.message,
          code: error.code,
          response: error.response
        }
      },
      { status: 500 }
    );
  }
}
