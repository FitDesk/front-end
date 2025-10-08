import { useAuthStore } from "@/core/store/auth.store";
import PaymentForm from "@/shared/components/payment-form";

export default function PaymentsPage() {

  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);


  const mockMembershipPlan = {
    id: "1",
    name: "Plan Básico",
    price: 50,
    description: "Acceso básico al gimnasio"
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Pago exitoso:", paymentData);
    // Aquí puedes manejar el éxito del pago, como redirigir o mostrar un mensaje
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
        membershipPlan={mockMembershipPlan}
        userId={user?.id ?? ''}
        userEmail={user?.email ?? ''}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
