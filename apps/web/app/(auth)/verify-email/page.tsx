import { EmailVerificationForm } from "@/components/auth/EmailVerificationForm";

export default function EmailVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <EmailVerificationForm />
      </div>
    </div>
  );
}
