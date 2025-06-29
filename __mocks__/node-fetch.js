// Mock node-fetch compatible ESM/CJS
const fetchMock = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
  ok: true,
  status: 200,
}));

module.exports = fetchMock;
module.exports.default = fetchMock;
