/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { CardDesing } from "./ui/card-desing";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { useMyMembership } from "@/modules/client/payments/useMembershipQuery";
import type { PlanResponse } from "@/core/interfaces/plan.interface";
import type { PaymentResponse } from "@/core/interfaces/payment.interface";
import { CheckCircle, CreditCard, Lock, Shield } from "lucide-react";
import { usePaymentForm } from "@/core/hooks/use-payment-form";

interface PaymentFormProps {
  userId: string;
  userEmail: string;
  plan: PlanResponse;
  onPaymentSuccess: (paymentData: PaymentResponse) => void;
  isProcessingPayment?: boolean;
}

const PaymentForm = ({ userId, userEmail, plan, onPaymentSuccess, isProcessingPayment }: PaymentFormProps) => {

  const {
    formData,
    cardRef,
    cardType,
    isSubmitting,
    handleCardNumberChange,
    onExpChange,
    onCcvChange,
    onDniChange,
    toggleBackCard,
    showBackCard,
    hideBackCard,
    handleSubmit,
    getCardGradient
  } = usePaymentForm({
    userId,
    userEmail,
    plan,
    onPaymentSuccess
  });
  const setFormData = (updater: (prev: typeof formData) => typeof formData) => {
    const newData = updater(formData);
    Object.keys(newData).forEach(key => {
      const field = key as keyof typeof formData;
      if (newData[field] !== formData[field]) {
        setFormData(prev => ({ ...prev, [field]: newData[field] }));
      }
    });
  };
  const CardLogo = CardDesing[cardType];
  if (isProcessingPayment) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-16 px-4"
      >
        <div className="rounded-full bg-green-100 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
        <p className="text-muted-foreground mb-8">
          Tu membresía ha sido activada correctamente. Estamos redireccionándote...
        </p>
        <div className="flex items-center justify-center">
          <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <>
      {/* CSS para el efecto 3D flip */}
      <style>{`
        .creditCard { transform-style: preserve-3d; transition: transform 0.5s; }
        .creditCard.seeBack { transform: rotateY(-180deg); }
        .cardFace { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .cardBack { transform: rotateY(180deg); }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="absolute -top-6 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-orange-500 to-red-500 opacity-25" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {plan.name}
          </h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            {plan.description}
          </p>
        </div>
      </motion.div>

      <Card className="w-full max-w-6xl mx-auto border border-border/40 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-border/10 bg-muted/50">
          <CardTitle className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-orange-500/10 text-orange-500">
              <Lock className="h-5 w-5" />
            </div>
            <span>Información de Pago Seguro</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-green-500" />
            Todas las transacciones son seguras y encriptadas
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            {/* Columna izquierda - Formulario de entrada */}
            <div className="w-full lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <FieldSet className="bg-card rounded-lg border border-border/50 p-4">
                  <FieldLegend className="bg-background px-2 text-foreground">
                    Datos de la Tarjeta
                  </FieldLegend>

                  <Field className="mb-4">
                    <FieldLabel htmlFor="card-number" className="font-medium">
                      Número de Tarjeta
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="card-number"
                        type="text"
                        onFocus={hideBackCard}
                        onClick={hideBackCard}
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        maxLength={19}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="pl-10"
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    {cardType !== 'unknown' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-1.5 flex items-center gap-2"
                      >
                        <span className="font-semibold capitalize text-foreground">{cardType}</span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Tarjeta detectada
                        </span>
                      </motion.div>
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Field>
                      <FieldLabel htmlFor="card-name" className="font-medium">
                        Nombre del Titular
                      </FieldLabel>
                      <Input
                        id="card-name"
                        type="text"
                        onFocus={hideBackCard}
                        onClick={hideBackCard}
                        value={formData.cardName}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setFormData((prev) => ({ ...prev, cardName: value }));
                        }}
                        placeholder="NOMBRE APELLIDO"
                        required
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-2">
                      <Field>
                        <FieldLabel htmlFor="card-date" className="font-medium">
                          Fecha de Exp.
                        </FieldLabel>
                        <Input
                          id="card-date"
                          type="text"
                          onFocus={hideBackCard}
                          onClick={hideBackCard}
                          value={formData.expDate}
                          onChange={onExpChange}
                          maxLength={5}
                          placeholder="MM/YY"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="card-ccv" className="font-medium">
                          CCV
                        </FieldLabel>
                        <Input
                          id="card-ccv"
                          type="text"
                          onFocus={showBackCard}
                          onClick={showBackCard}
                          value={formData.ccv}
                          onChange={onCcvChange}
                          maxLength={3}
                          placeholder="•••"
                          required
                        />
                      </Field>
                    </div>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="card-dni" className="font-medium">
                      DNI
                    </FieldLabel>
                    <Input
                      id="card-dni"
                      type="text"
                      onFocus={hideBackCard}
                      onClick={hideBackCard}
                      value={formData.dni}
                      onChange={onDniChange}
                      maxLength={8}
                      placeholder="12345678"
                      required
                    />
                  </Field>
                </FieldSet>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Field>
                  <FieldLabel htmlFor="card-comments" className="font-medium">
                    Comentarios (opcional)
                  </FieldLabel>
                  <Textarea
                    id="card-comments"
                    onFocus={hideBackCard}
                    onClick={hideBackCard}
                    value={formData.comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Agrega cualquier comentario o instrucción especial..."
                    rows={2}
                    className="resize-none"
                  />
                </Field>
              </motion.div>
            </div>

            {/* Columna derecha - Visualización de la tarjeta */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 flex items-center justify-center"
            >
              <div className="w-full max-w-sm h-56" style={{ perspective: 1000 }}>
                <div
                  ref={cardRef}
                  role="button"
                  tabIndex={0}
                  aria-label="Tarjeta de crédito interactiva"
                  onClick={toggleBackCard}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleBackCard();
                  }}
                  className={`relative creditCard cursor-pointer w-full h-56 ${formData.showBack ? "seeBack" : ""}`}
                >
                  {/* Frente de la tarjeta */}
                  <div className={`absolute w-full h-56 rounded-2xl text-white shadow-2xl cardFace overflow-hidden bg-gradient-to-br ${getCardGradient()}`}>
                    {/* Patrón de fondo sutil */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                    </div>

                    <div className="relative w-full px-6 py-6 h-full flex flex-col justify-between">
                      {/* Logo y Chip */}
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-yellow-600 rounded-sm"></div>
                        </div>
                        <CardLogo />
                      </div>

                      {/* Número de tarjeta */}
                      <div>
                        <p className="font-mono text-xl tracking-[0.2em] mb-1">
                          {formData.cardNumber || "•••• •••• •••• ••••"}
                        </p>
                      </div>

                      {/* Nombre y Fecha */}
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          <p className="text-[10px] opacity-70 mb-1">TITULAR</p>
                          <p className="font-semibold text-sm tracking-wider uppercase">
                            {formData.cardName || "NOMBRE APELLIDO"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] opacity-70 mb-1">VENCE</p>
                          <p className="font-semibold text-sm tracking-wider">
                            {formData.expDate || "MM/YY"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reverso de la tarjeta */}
                  <div className={`absolute w-full h-56 rounded-2xl text-white shadow-2xl cardFace cardBack overflow-hidden bg-gradient-to-br ${getCardGradient()}`}>
                    <div className="w-full h-full flex flex-col">
                      {/* Banda magnética */}
                      <div className="bg-black h-12 mt-6"></div>

                      {/* CCV */}
                      <div className="px-6 mt-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-10 bg-white rounded"></div>
                          <div className="bg-white text-black flex items-center justify-center w-16 h-10 font-bold rounded text-sm">
                            {formData.ccv || "•••"}
                          </div>
                        </div>
                        <p className="text-[10px] opacity-70 text-right">CÓDIGO DE SEGURIDAD</p>

                        {/* Logo en reverso */}
                        <div className="flex justify-end mt-4">
                          <CardLogo />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-4 p-6 border-t border-border/10 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            className="transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : (
              <>Confirmar Pago</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Resumen del plan seleccionado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 max-w-6xl mx-auto"
      >
        <Card className="border border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Resumen del Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-muted-foreground">Precio:</span>
                <span className="font-medium">{new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(plan.price)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-muted-foreground">Duración:</span>
                <span className="font-medium">{plan.durationMonths} meses</span>
              </div>
              <div className="border-t border-border mt-2 pt-2">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total:</span>
                  <span className="text-orange-600">{new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(plan.price)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}

export default PaymentForm;