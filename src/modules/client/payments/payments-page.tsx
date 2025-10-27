import { useAuthStore } from "@/core/store/auth.store";
import PaymentForm from "@/shared/components/payment-form";
import { useLocation, useNavigate } from "react-router";
import type { PaymentResponse } from "@/core/interfaces/payment.interface";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { useMembershipStore } from "@/modules/client/payments/store/useMembershipState";
import type { PlanResponse } from "@/core/interfaces/plan.interface";
import type { UpgradeCostResponse } from "@/core/interfaces/payment.interface";

export default function PaymentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanResponse | null>(null);
  const [isUpgrade, setIsUpgrade] = useState<boolean>(false);
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeCostResponse | null>(null);
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);
  const [isProcessing, setIsProcessing] = useState(false);
  const setIsUpgradeStore = useMembershipStore((state) => state.setIsUpgrade);

  useEffect(() => {
    const state = location.state as {
      selectedPlan?: PlanResponse;
      isUpgrade?: boolean;
      upgradeInfo?: UpgradeCostResponse;
    };
    
    if (state?.selectedPlan) {
      setSelectedPlan(state.selectedPlan);
      setIsUpgrade(state.isUpgrade || false);
      setUpgradeInfo(state.upgradeInfo || null);
      console.log("📄 PaymentsPage montado con isUpgrade:", state.isUpgrade);
      console.log("💰 Upgrade info:", state.upgradeInfo);
    } else {
      // Si no hay plan seleccionado, redirigir
      navigate('/');
    }
  }, [location, navigate]);

  // Limpiar el flag cuando se desmonte el componente
  useEffect(() => {
    return () => {
      console.log("🧹 Limpiando flag isUpgrade");
      setIsUpgradeStore(false);
    };
  }, [setIsUpgradeStore]);

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
      upgradeInfo={upgradeInfo}  // Pasar la información del upgrade al formulario
    />
  );
}
