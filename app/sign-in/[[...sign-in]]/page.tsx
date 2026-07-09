import { SignIn } from "@clerk/nextjs";
import { PreviewAuth } from "@/components/PreviewAuth";
import { hasClerkConfig } from "@/lib/runtime";

export default function SignInPage() {
  if (!hasClerkConfig()) {
    return <PreviewAuth mode="sign-in" />;
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
    </section>
  );
}
