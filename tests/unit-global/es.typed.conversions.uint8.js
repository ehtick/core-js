import { DESCRIPTORS, GLOBAL, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, NATIVE } from '../helpers/constants.js';

if (DESCRIPTORS) QUnit.test('Uint8 conversions', assert => {
  const uint8array = new Uint8Array(1);
  const dataview = new DataView(uint8array.buffer);

  function viewFrom(it) {
    return new DataView(new Uint8Array(it).buffer);
  }
  function toString(it) {
    return it === 0 && 1 / it === -Infinity ? '-0' : it;
  }

  const data = [
    [0, 0, [0]],
    [-0, 0, [0]],
    [1, 1, [1]],
    [-1, 255, [255]],
    [1.1, 1, [1]],
    [-1.1, 255, [255]],
    [1.9, 1, [1]],
    [-1.9, 255, [255]],
    [127, 127, [127]],
    [-127, 129, [129]],
    [128, 128, [128]],
    [-128, 128, [128]],
    [255, 255, [255]],
    [-255, 1, [1]],
    [255.1, 255, [255]],
    [255.9, 255, [255]],
    [256, 0, [0]],
    [32767, 255, [255]],
    [-32767, 1, [1]],
    [32768, 0, [0]],
    [-32768, 0, [0]],
    [65535, 255, [255]],
    [65536, 0, [0]],
    [65537, 1, [1]],
    [65536.54321, 0, [0]],
    [-65536.54321, 0, [0]],
    [2147483647, 255, [255]],
    [-2147483647, 1, [1]],
    [2147483648, 0, [0]],
    [-2147483648, 0, [0]],
    [4294967296, 0, [0]],
    [MAX_SAFE_INTEGER + 1, 0, [0]],
    [MIN_SAFE_INTEGER - 1, 0, [0]],
    [Infinity, 0, [0]], [-Infinity, 0, [0]],
    [-Number.MAX_VALUE, 0, [0]],
    [Number.MAX_VALUE, 0, [0]],
    [Number.MIN_VALUE, 0, [0]],
    [-Number.MIN_VALUE, 0, [0]],
    [NaN, 0, [0]],
  ];
  // Android 4.3- bug
  if (NATIVE || !/Android [2-4]/.test(GLOBAL.navigator && navigator.userAgent)) {
    data.push(
      [2147483649, 1, [1]],
      [-2147483649, 255, [255]],
      [4294967295, 255, [255]],
      [4294967297, 1, [1]],
      [MAX_SAFE_INTEGER, 255, [255]],
      [MIN_SAFE_INTEGER, 1, [1]],
      [MAX_SAFE_INTEGER + 3, 2, [2]],
      [MIN_SAFE_INTEGER - 3, 254, [254]],
    );
  }
  for (const [value, conversion, little] of data) {
    uint8array[0] = value;
    assert.same(uint8array[0], conversion, `Uint8Array ${ toString(value) } -> ${ toString(conversion) }`);
    assert.arrayEqual(uint8array, little, `Uint8Array ${ toString(value) } -> [${ little }]`);
    dataview.setUint8(0, value);
    assert.arrayEqual(uint8array, little, `dataview.setUint8(0, ${ toString(value) }) -> [${ little }]`);
    assert.same(viewFrom(little).getUint8(0), conversion, `dataview{${ little }}.getUint8(0) -> ${ toString(conversion) }`);
  }
});
