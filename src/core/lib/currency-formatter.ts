export const currencyFormatter = (value: number) => {
    return value.toLocaleString('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    })
}