import { LoginForm } from "@/components/auth/LoginForm";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}
