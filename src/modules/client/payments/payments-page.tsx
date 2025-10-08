import { useAuthStore } from "@/core/store/auth.store";
import PaymentForm from "@/shared/components/payment-form";
import { useLocation } from "react-router";
import { useMembershipStore } from "./store/useMembershipState";
import type { PaymentResponse } from "@/core/interfaces/payment.interface";
import { PlanService } from "@/modules/admin/plans/services/plan.service";
import { useMyMembership } from "./useMembershipQuery";

export default function PaymentsPage() {
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan;
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);

  const { membership, setMembership } = useMembershipStore();
  const { data: myMembership } = useMyMembership();

  const handlePaymentSuccess = async (paymentData: PaymentResponse) => {
    console.log("Pago exitoso:", paymentData);

    if (paymentData.status === "approved") {
      try {
        console.log("Mi membresia", myMembership);
        if (myMembership) {
          setMembership(myMembership);
        } else {
          console.error("No se pudo obtener la membresía.");
        }
      } catch (error) {
        console.error("Error obteniendo la membresía:", error);
      }
    }
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

  // Mostrar detalles de la membresía si ya existe
  if (membership?.hasActiveMembership) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Detalles de tu Membresía</h2>
        <p>
          <strong>Plan:</strong> {membership.activeMembership?.planName}
        </p>
        <p>
          <strong>Estado:</strong> {membership.activeMembership?.status}
        </p>
        <p>
          <strong>Inicio:</strong>{" "}
          {membership.activeMembership?.startDate
            ? new Date(membership.activeMembership.startDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Vencimiento:</strong>{" "}
          {membership.activeMembership?.endDate
            ? new Date(membership.activeMembership.endDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Días Restantes:</strong>{" "}
          {membership.activeMembership?.daysRemaining}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plan Adquirido</h1>
      </div>

      <PaymentForm
        plan={selectedPlan}
        userId={user?.id ?? ""}
        userEmail={user?.email ?? ""}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}