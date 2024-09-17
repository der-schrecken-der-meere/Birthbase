type Digit = 0|1|2|3|4|5|6|7|8|9;

type Decimal<D extends number | Digit = Digit, B extends Digit = Digit> = `${D}${B}`;

type Centi = `${Digit}${Decimal}`;

type Milli = `${Digit}${Centi}`;

type Day = Decimal<0, Exclude<Digit, 0>>|Decimal<1|2>|Decimal<3, 0|1>;

type Month = Decimal<0, Exclude<Digit, 0>>|Decimal<1, 0|1|2>

type Year = `${(Decimal<1, Extract<Digit, 9>>|Decimal<Exclude<Digit, 0|1>>)}${Digit}${Digit}`;

type Hour = Decimal<0|1>|Decimal<2, Extract<Digit, 0|1|2|3>>;

type Minute = Decimal<0|1|2|3|4|5>

type Second = Minute;

type ISOTime = `T${Hour}:${Minute}:${Second}.${Centi}`;

type ISODate = `${Year}-${Month}-${Day}`;

type ISODateFull = `${ISODate}${ISOTime}`;

type ExtractPropertyOfArray<
    T extends any[],
    K extends keyof T[number],
> = T[number][K];

export type { ISODateFull, ExtractPropertyOfArray, TypeOrUndefined }