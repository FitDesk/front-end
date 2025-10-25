import { useAuthStore } from "@/core/store/auth.store";
import PaymentForm from "@/shared/components/payment-form";
import { useLocation, useNavigate } from "react-router";
import type { PaymentResponse } from "@/core/interfaces/payment.interface";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

export default function PaymentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.selectedPlan;
  const isUpgrade = location.state?.isUpgrade ?? false; 
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = async (paymentData: PaymentResponse) => {
    console.log("Pago exitoso:", paymentData);
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/client/membership");
    }, 1800);
  };

  if (authStatus === "not-authenticated" || authStatus === "checking") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <p className="text-lg text-muted-foreground">
            Debes iniciar sesión para realizar un pago
          </p>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-lg text-muted-foreground mb-4">
            No has seleccionado ningún plan
          </p>
          <Button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Ver planes disponibles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PaymentForm
      plan={selectedPlan}
      userId={user?.id ?? ""}
      userEmail={user?.email ?? ""}
      onPaymentSuccess={handlePaymentSuccess}
      isProcessingPayment={isProcessing}
      isUpgrade={isUpgrade}
    />
  );
}