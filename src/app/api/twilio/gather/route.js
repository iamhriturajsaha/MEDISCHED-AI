import { NextResponse } from 'next/server';

export async function POST(request) {
  // Twilio sends data as application/x-www-form-urlencoded
  const formData = await request.formData();
  
  // Get URL search params for the dynamic name we passed in
  const url = new URL(request.url);
  const patientName = url.searchParams.get('name') || 'Patient';

  // Extract speech result if the user already responded
  const speechResult = formData.get('SpeechResult');
  const confidence = formData.get('Confidence');

  let twiml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';

  if (!speechResult) {
    // Initial Call - Ask the question and gather voice input
    twiml += `
      <Gather input="speech" action="/api/twilio/gather?name=${encodeURIComponent(patientName)}" timeout="3" speechTimeout="auto">
        <Say voice="Polly.Matthew" language="en-US">
          Hello ${patientName}, I am calling from Aura Health regarding your upcoming appointment. Are you still able to make it?
        </Say>
      </Gather>
      <Say voice="Polly.Matthew">We didn't receive any input. Goodbye!</Say>
    `;
  } else {
    // User responded - Process intent (Mocking intent parsing logic)
    console.log(`[Twilio IVR] Patient "${patientName}" said: "${speechResult}" (Confidence: ${confidence})`);
    
    const lowerSpeech = speechResult.toLowerCase();
    
    if (lowerSpeech.includes('reschedule') || lowerSpeech.includes('change') || lowerSpeech.includes('another time')) {
      // Slot fetching logic
      twiml += `
        <Say voice="Polly.Matthew">
          I can help you reschedule. I've checked our calendar and found an opening this Thursday at 2:00 PM. I have successfully moved your appointment. See you then!
        </Say>
      `;
    } else if (lowerSpeech.includes('yes') || lowerSpeech.includes('confirm') || lowerSpeech.includes('still able')) {
      twiml += `
        <Say voice="Polly.Matthew">
          Perfect! Your appointment is confirmed. We look forward to seeing you. Have a great day.
        </Say>
      `;
    } else if (lowerSpeech.includes('insurance') || lowerSpeech.includes('medicare') || lowerSpeech.includes('billing')) {
      // Fallback to human agent
      twiml += `
        <Say voice="Polly.Matthew">
          I understand you have a complex question regarding your insurance. Please hold while I transfer you to a human specialist.
        </Say>
        <Dial>+1234567890</Dial>
      `;
    } else {
      // Fallback catch-all
      twiml += `
        <Say voice="Polly.Matthew">
          I'm sorry, I didn't quite catch that. Let me connect you with our front desk to assist you further.
        </Say>
        <Dial>+1234567890</Dial>
      `;
    }
  }

  twiml += '\n</Response>';

  return new NextResponse(twiml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
