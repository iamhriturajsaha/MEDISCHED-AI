import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Use environment variables for production
// process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_DUMMY_SID';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'DUMMY_TOKEN';
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// In Next.js App Router, POST request to initiate a call
export async function POST(request) {
  try {
    const { to, patientName } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Phone number "to" is required' }, { status: 400 });
    }

    // Generate the URL for our Twilio TwiML handler (Must be a public URL like ngrok in dev)
    // We pass the patient name as a query parameter so the AI can greet them
    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    const targetName = patientName || 'Patient';
    const SCRIPTS = [
      `Hello, ${targetName}. This is MediSched AI, the intelligent health assistant calling from Doctor Smith's office. I am calling to confirm your upcoming general consultation tomorrow morning at 10:00 A.M. Please remember to bring your updated insurance card, and arrive 15 minutes early. We look forward to seeing you.`,
      `Hi ${targetName}, this is the automated scheduling team at MediSched AI. We are confirming your MRI scan scheduled for this Thursday at 2:00 P.M. Please remember to arrive 15 minutes early and fast for 4 hours prior. Thank you.`,
      `Hello ${targetName}. This is MediSched AI calling regarding your upcoming Ultrasound appointment. Your time slot is secured for tomorrow at 3:30 P.M. Please drink plenty of water beforehand. See you soon.`,
      `Good morning ${targetName}, this is MediSched AI. We noticed you missed your annual checkup last month. Please reply to the text message we just sent you to easily reschedule. Have a great day.`,
      `Hi ${targetName}. I am calling from the MediSched AI specialist clinic. Your blood test results are ready and look great. You can view them securely in your patient portal at any time.`,
      `Hello ${targetName}, this is your MediSched AI assistant. This is a friendly reminder that your physical therapy session is tomorrow at 9:00 A.M. Please wear comfortable clothing.`,
      `Good afternoon ${targetName}. MediSched AI here. We are confirming your dental checkup tomorrow at 11:30 A.M. If you need to reschedule, please call our front desk. Have a wonderful afternoon.`,
      `Hi ${targetName}, this is MediSched AI calling to remind you about your vaccination appointment on Friday at 4:00 P.M. Please bring your vaccination card with you.`,
      `Hello ${targetName}, this is the MediSched AI billing department's automated assistant. We are calling to confirm that your latest insurance pre-authorization has been approved. Your procedure is fully cleared.`,
      `Greetings ${targetName}, this is your automated health assistant at MediSched AI. Your prescription refill has been successfully processed and sent to your local pharmacy. It is now ready for pickup.`
    ];

    const randomScript = SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)];

    // Create the outbound call using inline TwiML so we don't need ngrok just to make it ring!
    const call = await client.calls.create({
      twiml: `
        <Response>
          <Pause length="1"/>
          <Say voice="Polly.Joanna-Neural" language="en-US">
            ${randomScript}
          </Say>
        </Response>
      `,
      to: to,
      from: twilioNumber,
      record: true,
    });

    return NextResponse.json({ success: true, callSid: call.sid, status: call.status });
  } catch (error) {
    console.error('Twilio Call Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
