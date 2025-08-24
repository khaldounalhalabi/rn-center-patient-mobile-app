import AttendanceLog from "@/models/AttendanceLog";

interface UserAttendance {
  [date: string]: AttendanceLog[];
}

export default UserAttendance;
