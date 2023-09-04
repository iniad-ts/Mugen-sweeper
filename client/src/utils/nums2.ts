import type { Num } from 'src/types/types';

const one: Num = {
  num: `
  'a a a a a a a '
  'b b b . c c c '
  'd d . . c c c '
  'd d e . c c c '
  'd d e . c c c '
  'd d . . . g g '
  'f f f f f f f '
`,
  divide: 7,
};

const tow: Num = {
  num: `
  'a a a a a a a '
  'b b . . . c c '
  'd . g g g . j '
  'd e e f . h j '
  'd e e . i i j '
  'd . . . . . j '
  'k k k k k k k '
`,
  divide: 11,
};

const three: Num = {
  num: `
  'a a b b b c c '
  'a a . . . c c '
  'e . d d d . g '
  'e f f . . h g '
  'e . i i i . g '
  'j j . . . l l '
  'j j k k k l l '
`,
  divide: 12,
};

const four: Num = {
  num: `
  'a a a b c c c '
  'a a a . c c c '
  'e d . g c c c '
  'e . h h . i i '
  'e . . . . . j '
  'f f f f . k k '
  'f f f f l l l '
`,
  divide: 12,
};

const five: Num = {
  num: `
  'a a a a a a a '
  'b . . . . . e '
  'b . d d d d e '
  'b . . . . f e '
  'c c g g g . e '
  'c c . . . h h '
  'c c i i i h h '
`,
  divide: 9,
};

const six: Num = {
  num: `
  'a a a a a a a '
  'b . . . . . c '
  'b . d d d d d '
  'b . . . . e e '
  'b . g g g . f '
  'b . . . . h h '
  'i i i i i i i '
`,
  divide: 9,
};

const seven: Num = {
  num: `
  'a a a a a a a '
  'b . . . . . c '
  'b . d d d . c '
  'e e e e . g g '
  'e e e e . g g '
  'f f f . h h h '
  'f f f i i i i '
`,
  divide: 9,
};

const eight: Num = {
  num: `
  'a a a a a a a '
  'b b . . . c c '
  'd . e e e . f '
  'g g . . . h h '
  'i . j j j . k '
  'l l . . . n n '
  'l l m m m n n '
`,
  divide: 14,
};

export const numbers2: Num[] = [one, tow, three, four, five, six, seven, eight];
