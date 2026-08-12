// backend/src/utils/calendar.js
const { google } = require("googleapis");

async function createCalendarEvent({
  summary,
  description,
  startTime,
  endTime,
  attendees,
}) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary,
    description,
    start: { dateTime: startTime, timeZone: "Asia/Jakarta" },
    end: { dateTime: endTime, timeZone: "Asia/Jakarta" },
    attendees: attendees.map((email) => ({ email })),
    conferenceData: {
      createRequest: { requestId: `pcn-${Date.now()}` },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    sendUpdates: "all",
    conferenceDataVersion: 1,
  });

  return {
    eventId: response.data.id,
    meetLink: response.data.hangoutLink,
    htmlLink: response.data.htmlLink,
  };
}

module.exports = { createCalendarEvent };
