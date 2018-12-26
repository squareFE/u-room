// app.js
module.exports = app => {
  app.beforeStart(async () => {
    await app.runSchedule('RoomTimingTask');
  });
};