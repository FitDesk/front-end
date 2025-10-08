import { useAuthStore } from "@/core/store/auth.store";
import PaymentForm from "@/shared/components/payment-form";
import { useLocation } from "react-router";

export default function PaymentsPage() {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan;
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);

  console.log("Plan Selecionado", selectedPlan);

  const handlePaymentSuccess = (paymentData: PaymentResponse) => {
    console.log("Pago exitoso:", paymentData);

  };


  if (authStatus === 'not-authenticated' || authStatus === 'checking') {
    <div className="space-y-6">
      <div className="flex items-center justify-center p-8">
        <p className="text-lg text-muted-foreground">
          Debes iniciar sesión para realizar un pago
        </p>
      </div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plan Adquirido</h1>
      </div>

      <PaymentForm
        plan={selectedPlan}
        userId={user?.id ?? ''}
        userEmail={user?.email ?? ''}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
