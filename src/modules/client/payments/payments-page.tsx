import PaymentForm from "@/shared/components/payment-form";

export default function PaymentsPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Plan Adquirido</h1>
      </div>

      <PaymentForm membershipPlan={mockMembershipPlan} userId={"13"} userEmail={"raydev@gmail.com"} onPaymentSuccess={handlePaymentSuccess} />

    </div>
  );
}
