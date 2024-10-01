export interface Config {
    exam_gcal_url: string;
    school_station_id: string;
    announcement_message_url: string;
}

const app_config: Config = {
    exam_gcal_url: "https://www.googleapis.com/calendar/v3/calendars/c_ccb173b4b46532575a1a316f50fe4c947323594da40401a987d73b0c99f04ce2@group.calendar.google.com/events?key=AIzaSyCHaGwe8UZ-EWdN2_5Tmopjcn_MVKM9gyw",
    school_station_id: "OTA5MTAwMTAwMDAwNzAwMA==",
    announcement_message_url: "https://www.googleapis.com/calendar/v3/calendars/c_ccb173b4b46532575a1a316f50fe4c947323594da40401a987d73b0c99f04ce2@group.calendar.google.com/events?key=AIzaSyCHaGwe8UZ-EWdN2_5Tmopjcn_MVKM9gyw",
}

export default app_config;
