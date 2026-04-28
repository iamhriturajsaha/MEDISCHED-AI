import './globals.css';
import AuthWrapper from '@/components/AuthWrapper';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  title: "MediSched AI - Smart Scheduling & Calling",
  description: "Next-gen healthcare scheduling and automated outbound calling system.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}

