// Mock basique pour isows (WebSocket natif)
module.exports = {
  getNativeWebSocket: jest.fn(() => function WebSocket() {})};
