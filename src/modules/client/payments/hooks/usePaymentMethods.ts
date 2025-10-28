import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentMethodService } from "@/core/services/payment-method.service";
import type {
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  SavedPaymentMethod,
} from "@/core/interfaces/payment-method.interface";

export function usePaymentMethods() {
  const queryClient = useQueryClient();

  /**
   * Fetches the user's saved payment methods.
   * The component using this hook is responsible for syncing the data with any state management library.
   */
  const useFetchCards = () =>
    useQuery<SavedPaymentMethod[], Error>({
      queryKey: ["paymentMethods"],
      queryFn: PaymentMethodService.getUserPaymentMethods,
    });

  /**
   * Creates a mutation to add a new payment method.
   * On success, it invalidates the 'paymentMethods' query to refetch the updated list.
   */
  const useAddCard = () =>
    useMutation({
      mutationFn: (data: CreatePaymentMethodRequest) =>
        PaymentMethodService.savePaymentMethod(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      },
    });

  /**
   * Creates a mutation to update an existing payment method.
   * On success, it invalidates the 'paymentMethods' query.
   */
  const useUpdateCard = () =>
    useMutation({
      mutationFn: ({ cardId, data }: { cardId: string; data: UpdatePaymentMethodRequest }) =>
        PaymentMethodService.updatePaymentMethod(cardId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      },
    });

  /**
   * Creates a mutation to delete a payment method.
   * On success, it invalidates the 'paymentMethods' query.
   */
  const useDeleteCard = () =>
    useMutation({
      mutationFn: (cardId: string) => PaymentMethodService.deletePaymentMethod(cardId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      },
    });

  return {
    useFetchCards,
    useAddCard,
    useUpdateCard,
    useDeleteCard,
  };
}
