interface AttendanceStats {
  absence_days: number;
  attendance_days: number;
  attendance_hours: number;
  expected_hours: number;
  expected_days: number;
  attendance_hours_in_day: number;
  overtime_hours: number;
  overtime_days: number;
}

export default AttendanceStats;
