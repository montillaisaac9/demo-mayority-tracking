import AuthGuard from "@/components/auth/AuthGuard";
import CitizenApp from "@/components/citizen/CitizenApp";

export default function CitizenPage() {
  return (
    <AuthGuard>
      <CitizenApp />
    </AuthGuard>
  );
}
