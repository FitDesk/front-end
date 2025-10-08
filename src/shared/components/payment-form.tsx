import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { CardDesing } from "./ui/card-desing";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { PaymentService } from "@/core/services/payment.service";
import { useRef, useState } from "react";
import type { PlanResponse } from "@/core/interfaces/plan.interface";
import { useMyMembership } from "@/modules/client/payments/useMembershipQuery";
import type { PaymentResponse } from "@/core/interfaces/payment.interface";
import { toast } from "./ui/toast-provider";


const detectCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' => {
    const cleaned = number.replace(/\s/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';

    return 'unknown';
};


interface PaymentFormProps {

    userId: string;
    userEmail: string;
    plan: PlanResponse;
    onPaymentSuccess: (paymentData: PaymentResponse) => void;
}

const PaymentForm = ({ userId, userEmail, plan, onPaymentSuccess }: PaymentFormProps) => {


    const { data: myMembership } = useMyMembership()

    const [detectedPaymentMethod, setDetectedPaymentMethod] = useState('visa');
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "APRO",
        expDate: "",
        ccv: "",
        dni: "",
        comments: "",
        showBack: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const cardRef = useRef<HTMLDivElement | null>(null);
    const cardType = detectCardType(formData.cardNumber);

    const toggleBackCard = () => {
        handleInputChange("showBack", !formData.showBack);
    };

    const showBackCard = () => handleInputChange("showBack", true);
    const hideBackCard = () => handleInputChange("showBack", false);

    const formatCardNumber = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpDate = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length <= 2) return digits;
        return digits.slice(0, 2) + "/" + digits.slice(2);
    };

    const formatCcv = (value: string) => value.replace(/\D/g, "").slice(0, 3);

    const formatDni = (value: string) => value.replace(/\D/g, "").slice(0, 8);


    const onExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpDate(e.target.value);
        handleInputChange("expDate", formatted || "");
    };

    const onCcvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCcv(e.target.value);
        handleInputChange("ccv", formatted || "");
    };

    const onDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatDni(e.target.value);
        handleInputChange("dni", formatted || "");
    };


    const handleCardNumberChange = (value: string) => {
        const formatted = formatCardNumber(value);
        const cleanNumber = formatted.replace(/\s/g, '');
        setFormData(prev => ({ ...prev, cardNumber: cleanNumber }));

        // Detectar método de pago cuando tenga suficientes dígitos
        if (cleanNumber.length >= 6) {
            const bin = cleanNumber.substring(0, 6);
            PaymentService.detectPaymentMethod(bin)
                .then(method => {
                    console.log('🔍 Método de pago detectado:', method);
                    setDetectedPaymentMethod(method);
                })
                .catch(err => console.warn('Error detectando método:', err));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('🔒 Creando token de tarjeta en el navegador...');
            const cardToken = await PaymentService.createCardToken({
                cardNumber: formData.cardNumber,
                cardholderName: formData.cardName,
                cardExpirationMonth: formData.expDate.slice(0, 2),
                cardExpirationYear: formData.expDate.slice(3, 5),
                securityCode: formData.ccv,
                identificationType: "DNI",
                identificationNumber: formData.dni
            });

            console.log('✅ Token creado:', cardToken.id);
            console.log('💳 Procesando pago en el backend...');
            const externalReference = `MEMBERSHIP_${userId}_${Date.now()}`;

            const paymentResponse = await PaymentService.processDirectPayment({
                externalReference,
                userId,
                planId: plan.id,
                amount: plan.price,
                payerEmail: userEmail,
                payerFirstName: formData.cardName.split(' ')[0],
                payerLastName: formData.cardName.split(' ').slice(1).join(' ') || 'N/A',
                description: `Membresía ${plan.name} - FitDesk`,
                token: cardToken.id,
                installments: 1,
                paymentMethodId: detectedPaymentMethod,
                identificationType: "DNI",
                identificationNumber: formData.dni
            });

            console.log('✅ Pago procesado:', paymentResponse);

            if (paymentResponse.status === 'approved') {
            
                toast.success("¡Pago exitoso! Tu membresia ha sido activada")
                console.info(`🎉 ¡Pago Exitoso! , la membresia ${plan.name} a sido activada`)
                onPaymentSuccess(paymentResponse);
            } else if (paymentResponse.status === 'pending') {
                onPaymentSuccess(paymentResponse);
            } else {
                throw new Error(`Pago ${paymentResponse.status}: ${paymentResponse.statusDetail}`);
            }

        } catch (error: any) {
            console.error('❌ Error procesando pago:', error);
            toast.error(`Error al procesar el pago ${error.message}`)
        }
    };



    const getCardGradient = () => {
        switch (cardType) {
            case 'visa':
                return 'from-blue-700 via-blue-800 to-blue-900';
            case 'mastercard':
                return 'from-slate-800 via-slate-900 to-black';
            case 'amex':
                return 'from-blue-600 via-blue-700 to-blue-800';
            case 'discover':
                return 'from-orange-600 via-orange-700 to-orange-800';
            default:
                return 'from-slate-700 via-slate-800 to-slate-900';
        }
    };

    const CardLogo = CardDesing[cardType];




    return (
        <>
            {/* CSS para el efecto 3D flip */}
            <style>{`
                .creditCard { transform-style: preserve-3d; transition: transform 0.5s; }
                .creditCard.seeBack { transform: rotateY(-180deg); }
                .cardFace { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .cardBack { transform: rotateY(180deg); }
            `}</style>

            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Información de Pago</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Completa los datos de tu tarjeta de crédito o débito
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                        {/* Formulario de entrada */}

                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend>Metodo de Pago</FieldLegend>
                                <FieldDescription>
                                    Todas las transacciones seguras y encriptadas
                                </FieldDescription>

                                <FieldGroup>

                                    <Field>
                                        <FieldLabel htmlFor="card-number">
                                            Numero de Tarjeta
                                        </FieldLabel>
                                        {/** biome-ignore lint/correctness/useUniqueElementIds: <> */}
                                        <Input
                                            id="card-number"
                                            type="text"
                                            onFocus={hideBackCard}
                                            onClick={hideBackCard}
                                            value={formData.cardNumber}
                                            onChange={(e) => handleCardNumberChange(e.target.value)}
                                            maxLength={19}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            required
                                        />
                                        {cardType !== 'unknown' && (
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                <span className="font-semibold capitalize">{cardType}</span>
                                                <span className="text-green-600">✓ Detectada</span>
                                            </p>
                                        )}
                                    </Field>

                                </FieldGroup>

                            </FieldSet>
                        </FieldGroup>

                        <div className="w-full lg:w-1/2 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="card-date">Fecha de Expiracion</FieldLabel>
                                            {/** biome-ignore lint/correctness/useUniqueElementIds: <> */}
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
                                        <div className="flex-1">
                                            <Field className="flex-1">
                                                <FieldLabel htmlFor="card-ccv">CCV</FieldLabel>
                                                {/** biome-ignore lint/correctness/useUniqueElementIds: <> */}
                                                <Input
                                                    id="card-ccv"
                                                    type="text"
                                                    onFocus={showBackCard}
                                                    onClick={showBackCard}
                                                    value={formData.ccv}
                                                    onChange={onCcvChange}
                                                    maxLength={3}
                                                    placeholder="xxx"
                                                    required
                                                />
                                            </Field>
                                        </div>
                                    </FieldGroup>
                                </div>

                            </div>

                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="card-dni">DNI</FieldLabel>
                                    {/** biome-ignore lint/correctness/useUniqueElementIds: <> */}
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
                                <Field>
                                    <FieldLabel htmlFor="card-comments">Comentarios (opcional)</FieldLabel>
                                    {/** biome-ignore lint/correctness/useUniqueElementIds: <> */}
                                    <Textarea
                                        id="card-comments"
                                        onFocus={hideBackCard}
                                        onClick={hideBackCard}
                                        value={formData.comments}
                                        onChange={(e) => handleInputChange("comments", e.target.value)}
                                        placeholder="Agrega cualquier comentario o instrucción especial..."
                                        rows={3}
                                    />
                                </Field>
                            </FieldGroup>
                        </div>

                        {/* Visualización de la tarjeta */}
                        <div className="w-full lg:w-1/2 flex items-center justify-center">
                            <div className="w-full max-w-sm h-56" style={{ perspective: 1000 }}>
                                <div
                                    ref={cardRef}
                                    onClick={toggleBackCard}
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
                                                        {formData.ccv || "***"}
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
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                        Confirmar Pago
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default PaymentForm;