import { RegisterForm } from "@/components/auth/RegisterForm";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />
      </div>
    </div>
  );
}
