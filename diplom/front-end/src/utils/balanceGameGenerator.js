export const generateBalanceRound = () => {
    const x = Math.floor(Math.random() * 9) + 1;
    const y = Math.floor(Math.random() * 10) + 1;
    const z = x + y;

    // Створюємо масив об'єктів з унікальними ID
    const triplet = [
        { id: 'num-1', value: x },
        { id: 'num-2', value: y },
        { id: 'num-3', value: z }
    ];

    // Вибираємо стартове число (індекс 2 — це завжди сума Z, так простіше для балансу)
    // Або можна лишити рандом, якщо хочеш щоб іноді треба було віднімати
    const startIndex = Math.floor(Math.random() * 3);
    const startItem = triplet[startIndex];

    const options = triplet.filter((_, i) => i !== startIndex);

    const startPlate = Math.random() > 0.5 ? 0 : 1;

    return {
        startItem, // Об'єкт {id, value}
        startPlate,
        options,   // Масив об'єктів
        triplet
    };
};