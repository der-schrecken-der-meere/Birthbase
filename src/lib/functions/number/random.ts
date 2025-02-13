const random_number_between_inclusive = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export { random_number_between_inclusive };