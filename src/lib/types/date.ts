import { _0_59, Decimal, Digit, Milli } from "./number";

type Millisecond = Milli;

type Second = _0_59;

type Minute = _0_59;

type Hour = Decimal<0|1>|Decimal<2, Extract<Digit, 0|1|2|3>>;

type HourMinute = `${Hour}:${Minute}`;

type HourMinuteString = `${string}:${string}`;

type Day = Decimal<0, Exclude<Digit, 0>>|Decimal<1|2>|Decimal<3, 0|1>;

type Month = Decimal<0, Exclude<Digit, 0>>|Decimal<1, 0|1|2>

type Year = `${(Decimal<1, Extract<Digit, 9>>|Decimal<Exclude<Digit, 0|1>>)}${Digit}${Digit}`;

type ISOTime = `T${HourMinuteString}:${string}.${string}`;

type ISODate = `${string}-${string}-${string}`;

type ISODateFull = `${ISODate}${ISOTime}`;

type ISODateFullTZ = `${ISODateFull}${"+"|"-"}${HourMinuteString}`;

type TimeZone = string & {};

export type { Millisecond, Second, Minute, Hour, HourMinute, HourMinuteString, Day, Month, Year, ISODate, ISOTime, ISODateFull, ISODateFullTZ, TimeZone };