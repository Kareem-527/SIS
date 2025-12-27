import { User, Student, Fee, News, Course, Professor, CourseAssignment, Enrollment, Attendance } from './types';

// Seed Data
export const INITIAL_USERS: User[] = [
  { user_id: 1, username: 'Administrator', password: 'Abdallah11#', role: 'admin' },
  { user_id: 2, username: 'test', password: '12345678', role: 'finance' },
  // Adding a demo student and professor for immediate login testing
  { user_id: 3, username: 'student1', password: '123', role: 'student' },
  { user_id: 4, username: 'prof1', password: '123', role: 'professor' },
];

export const INITIAL_STUDENTS: Student[] = [
  { 
    student_id: 20250001, 
    user_id: 3, 
    seat_num: 1, 
    full_name: 'Jane Doe', 
    academic_year: 1, 
    track: 'General', 
    national_id: '12345678901234', 
    date_of_birth: '2005-01-01' 
  }
];

export const INITIAL_FEES: Fee[] = [
  { student_id: 20250001, amount: 15000, is_paid: false }
];

export const INITIAL_NEWS: News[] = [
  { news_id: 1, title: 'System Launch', content: 'Welcome to the new Student Information System.', post_date: new Date().toISOString() }
];

export const INITIAL_PROFESSORS: Professor[] = [
  { prof_id: 1, user_id: 4, full_name: 'Dr. John Smith' }
];

export const INITIAL_ASSIGNMENTS: CourseAssignment[] = [
  { assignment_id: 1, prof_id: 1, course_code: 'IT101' }
];

export const INITIAL_COURSES: Course[] = [
  { course_code: 'IT101', course_name: 'Intro. to Cyber Security', year_level: 1, semester: 1, track: 'All', max_grade: 150 },
  { course_code: 'IT102', course_name: 'IT Essentials', year_level: 1, semester: 1, track: 'All', max_grade: 150 },
  { course_code: 'IT103', course_name: 'Technical English 1', year_level: 1, semester: 1, track: 'All', max_grade: 150 },
  { course_code: 'IT106', course_name: 'Programming Essentials in python', year_level: 1, semester: 1, track: 'All', max_grade: 150 },
  { course_code: 'IT301', course_name: 'Advanced Programming in C', year_level: 3, semester: 1, track: 'S/W', max_grade: 150 },
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  { enrollment_id: 1, student_id: 20250001, course_code: 'IT101', ass1_grade: 'N', ass2_grade: 'N', year_work: 0, final_exam: 0, total_score: 0 }
];

export const INITIAL_ATTENDANCE: Attendance[] = [];
