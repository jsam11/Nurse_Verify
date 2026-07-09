import { SignUp } from "@clerk/nextjs";
import { PreviewAuth } from "@/components/PreviewAuth";
import { hasClerkConfig } from "@/lib/runtime";

export default function SignUpPage() {
  if (!hasClerkConfig()) {
    return <PreviewAuth mode="sign-up" />;
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />
    </section>
  );
}
