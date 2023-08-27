const keys = [
  'block',
  'unBlock',
  'flag',
  'unFlag',
  'user',
  'unUser',
  'select',
  'unSelect',
  'bomb',
  'unBomb',
] as const;

const bitForNumS = 4;

export const CELL_FLAGS = keys.reduce(
  (dict, key, i) => ({ ...dict, [key]: 1 << (i + bitForNumS) }),
  {} as Record<(typeof keys)[number], number>
);

export const HAS_FLAG = (flag: number) => flag & (0b1111 << 4);

export const CELL_STYLE_HANDLER = (
  flag: number,
  styles: {
    block: string;
    flag: string;
    user: string;
    select: string;
    bomb: string;
    number: string;
    unBlock: string;
    unFlag: string;
    unUser: string;
    unSelect: string;
    unBomb: string;
  }
) =>
  keys
    .filter((key) => CELL_FLAGS[key] & flag)
    .map((cellStyle) => styles[cellStyle])
    .reduce((str, style) => ` ${style} ${str}`, styles.number);

export const IS_BLANK_CELL = (flag: number) => !(flag & 0b1111);

export const CHANGE_FLAG = (value: number, flag: number, mask: number) => (value + flag) | ~mask;
