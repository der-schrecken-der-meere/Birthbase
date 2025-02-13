type Digit = 0|1|2|3|4|5|6|7|8|9;

type Decimal<D extends number | Digit = Digit, B extends Digit = Digit> = `${D}${B}`;

type Centi = `${Digit}${Decimal}`;

type Milli = `${Digit}${Centi}`;

type _0_59 = Decimal<0|1|2|3|4|5>;

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type BitUnit = "bit"|"kilobit"|"megabit"|"gigabit"|"terabit";

type ByteUnit = "byte"|"kilobyte"|"megabyte"|"gigabyte"|"terabyte"|"petabyte";

type StorageUnit = BitUnit|ByteUnit;

type VersionNumber = `${number}.${number}.${number}`;

export type { Digit, Decimal, Centi, Milli, _0_59, Range, StorageUnit, BitUnit, ByteUnit, VersionNumber };