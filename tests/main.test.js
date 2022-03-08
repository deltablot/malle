/*!
 * This file is part of the "malle" library
 * Copyright 2022 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/malle
 */

const Malle = require('../src/main.ts');

test('init Malle', () => {
  const malle = new Malle.Malle({
    fun: () => {
      return true;
    },
  });
  expect(malle).toBeInstanceOf(Malle.Malle);
  expect(malle.listen()).toBeInstanceOf(Malle.Malle);
});
