export type Role = 'admin' | 'finance' | 'student' | 'professor';

export interface User {
  user_id: number;
  username: string;
  password: string; // stored in plain text per original code (not recommended for prod)
  role: Role;
}

export interface Student {
  student_id: number;
  user_id: number;
  seat_num: number;
  full_name: string;
  academic_year: number;
  track: string;
  national_id: string;
  date_of_birth: string;
}

export interface Fee {
  student_id: number;
  amount: number;
  is_paid: boolean;
}

export interface News {
  news_id: number;
  title: string;
  content: string;
  post_date: string;
}

export interface Course {
  course_code: string;
  course_name: string;
  year_level: number;
  semester: number;
  track: string;
  max_grade: number;
}

export interface Enrollment {
  enrollment_id: number;
  student_id: number;
  course_code: string;
  ass1_grade: string;
  ass2_grade: string;
  year_work: number;
  final_exam: number;
  total_score: number;
}

export interface Attendance {
  att_id: number;
  enrollment_id: number;
  lecture_num: number;
}

export interface Professor {
  prof_id: number;
  user_id: number;
  full_name: string;
}

export interface CourseAssignment {
  assignment_id: number;
  prof_id: number;
  course_code: string;
}
