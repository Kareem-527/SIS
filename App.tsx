import React, { useState, useEffect } from 'react';
import { 
  User, Student, Fee, News, Course, Professor, CourseAssignment, Enrollment, Attendance 
} from './types';
import { 
  INITIAL_USERS, INITIAL_STUDENTS, INITIAL_FEES, INITIAL_NEWS, 
  INITIAL_COURSES, INITIAL_ENROLLMENTS, INITIAL_PROFESSORS, INITIAL_ASSIGNMENTS 
} from './constants';
import { 
  LogOut, LayoutDashboard, UserPlus, BookOpen, Edit, Key, 
  Megaphone, DollarSign, User as UserIcon, GraduationCap, FileText 
} from 'lucide-react';
import { GeminiAssistant } from './components/GeminiAssistant';

// --- Main App Component ---

const App: React.FC = () => {
  // --- Database State (Simulating Backend) ---
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [fees, setFees] = useState<Fee[]>(INITIAL_FEES);
  const [news, setNews] = useState<News[]>(INITIAL_NEWS);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [professors, setProfessors] = useState<Professor[]>(INITIAL_PROFESSORS);
  const [assignments, setAssignments] = useState<CourseAssignment[]>(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  
  // --- Login Input State ---
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginRole, setLoginRole] = useState<string>('student');

  // --- View State ---
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<{code: string, name: string} | null>(null);

  // --- Helpers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginUser && u.password === loginPass && u.role === loginRole);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      // Set default initial view based on role
      if (user.role === 'student') setCurrentView('student-profile');
      else if (user.role === 'admin') setCurrentView('admin-register');
      else if (user.role === 'finance') setCurrentView('finance-dashboard');
      else if (user.role === 'professor') setCurrentView('prof-dashboard');
    } else {
      setLoginError('Invalid Credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginUser('');
    setLoginPass('');
    setLoginError('');
    setCurrentView('dashboard');
  };

  // --- Admin Handlers ---
  const registerStudent = (data: any) => {
    const nextUserId = Math.max(...users.map(u => u.user_id)) + 1;
    const nextSeatNum = Math.max(...students.map(s => s.seat_num), 0) + 1;
    
    // 1. Create User
    const newUser: User = {
      user_id: nextUserId,
      username: data.username,
      password: data.password,
      role: 'student'
    };

    // 2. Create Student
    const newStudent: Student = {
      student_id: parseInt(data.student_id),
      user_id: nextUserId,
      seat_num: nextSeatNum,
      full_name: data.full_name,
      academic_year: parseInt(data.year),
      track: data.track,
      national_id: data.national_id,
      date_of_birth: data.dob
    };

    // 3. Fees
    const newFee: Fee = {
      student_id: newStudent.student_id,
      amount: newStudent.academic_year <= 2 ? 15000 : 20000,
      is_paid: false
    };

    // 4. Default Enrollments (Simplified)
    const yearCourses = INITIAL_COURSES.filter(c => c.year_level === newStudent.academic_year);
    const newEnrollments: Enrollment[] = yearCourses.map((c, idx) => ({
      enrollment_id: Math.max(...enrollments.map(e => e.enrollment_id), 0) + 1 + idx,
      student_id: newStudent.student_id,
      course_code: c.course_code,
      ass1_grade: 'N',
      ass2_grade: 'N',
      year_work: 0,
      final_exam: 0,
      total_score: 0
    }));

    setUsers([...users, newUser]);
    setStudents([...students, newStudent]);
    setFees([...fees, newFee]);
    setEnrollments([...enrollments, ...newEnrollments]);

    alert(`Student Registered! Seat Number: ${nextSeatNum}`);
  };

  const addProfessor = (data: any) => {
    const nextUserId = Math.max(...users.map(u => u.user_id)) + 1;
    const newUser: User = { user_id: nextUserId, username: data.username, password: data.password, role: 'professor' };
    
    const nextProfId = Math.max(...professors.map(p => p.prof_id), 0) + 1;
    const newProf: Professor = { prof_id: nextProfId, user_id: nextUserId, full_name: data.full_name };

    const newAssign: CourseAssignment = {
      assignment_id: Math.max(...assignments.map(a => a.assignment_id), 0) + 1,
      prof_id: nextProfId,
      course_code: data.course_code
    };

    setUsers([...users, newUser]);
    setProfessors([...professors, newProf]);
    setAssignments([...assignments, newAssign]);
    alert('Professor Added & Course Assigned!');
  };

  const postNews = (title: string, content: string) => {
    const newPost: News = {
      news_id: Math.max(...news.map(n => n.news_id), 0) + 1,
      title,
      content,
      post_date: new Date().toISOString()
    };
    setNews([newPost, ...news]);
    alert('News Published');
  };

  // --- Finance Handlers ---
  const toggleFeeStatus = (studentId: number, status: boolean) => {
    setFees(fees.map(f => f.student_id === studentId ? { ...f, is_paid: status } : f));
  };

  // --- Professor Handlers ---
  const toggleAttendance = (enrollmentId: number, lectureNum: number, isPresent: boolean) => {
    if (isPresent) {
      const newAtt: Attendance = {
        att_id: Math.max(...attendance.map(a => a.att_id), 0) + 1,
        enrollment_id: enrollmentId,
        lecture_num: lectureNum
      };
      setAttendance([...attendance, newAtt]);
    } else {
      setAttendance(attendance.filter(a => !(a.enrollment_id === enrollmentId && a.lecture_num === lectureNum)));
    }
  };

  // --- Views ---

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nctu-blue to-[#001024] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="h-2 bg-nctu-orange w-full"></div>
          <div className="p-8">
            <div className="flex justify-center mb-6">
               {/* Placeholder Logo */}
               <div className="w-24 h-24 bg-nctu-blue rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-nctu-orange">
                 NCTU
               </div>
            </div>
            <h2 className="text-2xl font-bold text-nctu-blue text-center mb-6">Portal Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-nctu-orange focus:bg-white outline-none transition-all"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-nctu-orange focus:bg-white outline-none transition-all"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>
              <div>
                <select 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-nctu-orange focus:bg-white outline-none transition-all cursor-pointer"
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin / Control</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-nctu-blue text-white font-bold py-3 rounded-lg hover:bg-nctu-orange hover:text-nctu-blue transition-colors duration-300"
              >
                Login System
              </button>
              {loginError && (
                <p className="text-red-500 text-sm text-center font-semibold animate-pulse">{loginError}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated Layout ---

  const renderSidebar = () => {
    const MenuItem = ({ view, icon: Icon, label }: any) => (
      <div 
        onClick={() => setCurrentView(view)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${currentView === view ? 'bg-nctu-orange text-nctu-blue font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-nctu-orange'}`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
    );

    return (
      <div className="w-64 bg-nctu-blue text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-10">
        <div className="p-6 text-center border-b border-white/10">
          <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center text-nctu-blue font-bold">NCTU</div>
          <h2 className="font-bold text-lg">NCTU Portal</h2>
        </div>
        <div className="p-4 flex-1 space-y-2 overflow-y-auto">
          {currentUser.role === 'student' && (
            <>
              <MenuItem view="student-profile" icon={UserIcon} label="Profile" />
              <MenuItem view="student-transcript" icon={FileText} label="Transcript" />
              <MenuItem view="student-news" icon={Megaphone} label="News" />
            </>
          )}
          {currentUser.role === 'admin' && (
            <>
              <MenuItem view="admin-register" icon={UserPlus} label="Register Student" />
              <MenuItem view="admin-add-prof" icon={BookOpen} label="Manage Professors" />
              <MenuItem view="admin-grades" icon={Edit} label="Control Room" />
              <MenuItem view="admin-users" icon={Key} label="User Credentials" />
              <MenuItem view="admin-news" icon={Megaphone} label="Post News" />
            </>
          )}
          {currentUser.role === 'finance' && (
            <MenuItem view="finance-dashboard" icon={DollarSign} label="Manage Fees" />
          )}
          {currentUser.role === 'professor' && (
            <MenuItem view="prof-dashboard" icon={BookOpen} label="My Courses" />
          )}
        </div>
        <div className="p-4 border-t border-white/10">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // --- STUDENT VIEWS ---
    if (currentUser.role === 'student') {
      const student = students.find(s => s.user_id === currentUser.user_id);
      if (!student) return <div>Error loading profile</div>;
      const studentFee = fees.find(f => f.student_id === student.student_id);
      const studentEnrollments = enrollments.filter(e => e.student_id === student.student_id);
      const studentCourses = studentEnrollments.map(e => {
        const c = INITIAL_COURSES.find(ic => ic.course_code === e.course_code);
        return { ...e, name: c?.course_name };
      });

      if (currentView === 'student-profile') {
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-nctu-orange flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-nctu-blue mb-2">Welcome, <span className="text-nctu-orange">{student.full_name}</span></h1>
                <p className="text-gray-600 text-lg">Academic Year: <b>{student.academic_year}</b> | Seat No: <b>{student.seat_num}</b></p>
              </div>
              <div className="text-right">
                <h3 className={`text-4xl font-bold ${studentFee?.is_paid ? 'text-green-600' : 'text-red-500'}`}>
                  {studentFee?.is_paid ? 'PAID' : 'UNPAID'}
                </h3>
                <p className="text-gray-500 mt-1">Fees Due: {studentFee?.amount} EGP</p>
              </div>
            </div>
          </div>
        );
      }
      if (currentView === 'student-transcript') {
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">Academic Transcript</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-nctu-blue text-white">
                  <tr>
                    <th className="p-4 text-left">Code</th>
                    <th className="p-4 text-left">Course Name</th>
                    <th className="p-4 text-left">Ass1</th>
                    <th className="p-4 text-left">Ass2</th>
                    <th className="p-4 text-left">Final</th>
                    <th className="p-4 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {studentCourses.map(c => (
                    <tr key={c.enrollment_id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold">{c.course_code}</td>
                      <td className="p-4">{c.name}</td>
                      <td className="p-4">{c.ass1_grade}</td>
                      <td className="p-4">{c.ass2_grade}</td>
                      <td className="p-4">{c.final_exam}</td>
                      <td className="p-4 font-bold text-nctu-blue">{c.total_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      if (currentView === 'student-news') {
        return (
          <div className="space-y-6">
             <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">University News</h1>
             <div className="grid gap-6">
               {news.map(n => (
                 <div key={n.news_id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-nctu-orange">
                   <h3 className="text-xl font-bold text-nctu-blue mb-2">{n.title}</h3>
                   <p className="text-gray-700 leading-relaxed">{n.content}</p>
                   <span className="text-xs text-gray-400 mt-4 block">{new Date(n.post_date).toLocaleDateString()}</span>
                 </div>
               ))}
             </div>
          </div>
        );
      }
    }

    // --- ADMIN VIEWS ---
    if (currentUser.role === 'admin') {
      if (currentView === 'admin-register') {
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">Register New Student</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-3xl">
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const data = Object.fromEntries(fd.entries());
                registerStudent(data);
                e.currentTarget.reset();
              }} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                   <div><label className="text-nctu-blue font-bold text-sm">Student ID</label><input required name="student_id" type="number" className="w-full border p-2 rounded mt-1" /></div>
                   <div><label className="text-nctu-blue font-bold text-sm">Full Name</label><input required name="full_name" type="text" className="w-full border p-2 rounded mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-nctu-blue font-bold text-sm">National ID</label><input required name="national_id" type="text" className="w-full border p-2 rounded mt-1" /></div>
                   <div><label className="text-nctu-blue font-bold text-sm">Date of Birth</label><input required name="dob" type="date" className="w-full border p-2 rounded mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-nctu-blue font-bold text-sm">Username</label><input required name="username" type="text" className="w-full border p-2 rounded mt-1" /></div>
                   <div><label className="text-nctu-blue font-bold text-sm">Password</label><input required name="password" type="password" className="w-full border p-2 rounded mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-nctu-blue font-bold text-sm">Year</label><input required name="year" type="number" min="1" max="4" className="w-full border p-2 rounded mt-1" /></div>
                   <div>
                     <label className="text-nctu-blue font-bold text-sm">Track</label>
                     <select name="track" className="w-full border p-2 rounded mt-1">
                       <option value="General">General</option>
                       <option value="SW">Software</option>
                       <option value="Network">Network</option>
                     </select>
                   </div>
                </div>
                <button type="submit" className="bg-nctu-blue text-white px-6 py-2 rounded font-bold hover:bg-nctu-orange hover:text-nctu-blue transition-colors">Register</button>
              </form>
            </div>
          </div>
        );
      }
      if (currentView === 'admin-users') {
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">User Credentials</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-nctu-blue text-white">
                  <tr><th className="p-4 text-left">Role</th><th className="p-4 text-left">Username</th><th className="p-4 text-left">Password</th></tr>
                </thead>
                <tbody>
                  {users.sort((a,b) => a.role.localeCompare(b.role)).map(u => (
                    <tr key={u.user_id} className="border-b hover:bg-gray-50">
                      <td className="p-4 uppercase font-bold text-xs tracking-wider text-gray-500">{u.role}</td>
                      <td className="p-4 font-medium">{u.username}</td>
                      <td className="p-4 font-mono text-sm bg-gray-50 w-32">{u.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      if (currentView === 'admin-add-prof') {
         return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">Add Professor</h1>
             <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl">
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addProfessor(Object.fromEntries(fd.entries()));
                e.currentTarget.reset();
              }} className="space-y-4">
                  <div><label className="text-nctu-blue font-bold text-sm">Professor Full Name</label><input required name="full_name" type="text" className="w-full border p-2 rounded mt-1" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-nctu-blue font-bold text-sm">Username</label><input required name="username" type="text" className="w-full border p-2 rounded mt-1" /></div>
                    <div><label className="text-nctu-blue font-bold text-sm">Password</label><input required name="password" type="password" className="w-full border p-2 rounded mt-1" /></div>
                  </div>
                  <div><label className="text-nctu-blue font-bold text-sm">Assign Course Code</label><input required name="course_code" placeholder="e.g. IT101" type="text" className="w-full border p-2 rounded mt-1" /></div>
                  <button type="submit" className="bg-nctu-blue text-white px-6 py-2 rounded font-bold hover:bg-nctu-orange hover:text-nctu-blue transition-colors">Add Professor</button>
              </form>
             </div>
          </div>
         )
      }
      if (currentView === 'admin-news') {
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">Post News</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl">
               <div className="space-y-4">
                 <div><label className="text-nctu-blue font-bold text-sm">Title</label><input id="news-t" type="text" className="w-full border p-2 rounded mt-1" /></div>
                 <div><label className="text-nctu-blue font-bold text-sm">Content</label><textarea id="news-c" className="w-full border p-2 rounded mt-1 h-32" /></div>
                 <button onClick={() => {
                   const t = (document.getElementById('news-t') as HTMLInputElement).value;
                   const c = (document.getElementById('news-c') as HTMLTextAreaElement).value;
                   if(t && c) { postNews(t,c); (document.getElementById('news-t') as HTMLInputElement).value=''; (document.getElementById('news-c') as HTMLTextAreaElement).value=''; }
                 }} className="bg-nctu-blue text-white px-6 py-2 rounded font-bold hover:bg-nctu-orange hover:text-nctu-blue transition-colors">Publish</button>
               </div>
            </div>
          </div>
        )
      }
    }

    // --- PROFESSOR VIEWS ---
    if (currentUser.role === 'professor') {
      if (currentView === 'prof-dashboard') {
        const myAssignments = assignments.filter(a => {
           const p = professors.find(prof => prof.user_id === currentUser.user_id);
           return p && a.prof_id === p.prof_id;
        });

        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">My Courses</h1>
            <div className="grid gap-4">
              {myAssignments.map(a => {
                 const c = INITIAL_COURSES.find(ic => ic.course_code === a.course_code);
                 return (
                   <div key={a.assignment_id} 
                        onClick={() => { setSelectedCourse({code: c!.course_code, name: c!.course_name}); setCurrentView('prof-class'); }}
                        className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-nctu-blue hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-all">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{c?.course_code}</h3>
                        <p className="text-gray-600">{c?.course_name}</p>
                      </div>
                      <span className="bg-nctu-blue text-white px-3 py-1 rounded text-sm">View Class</span>
                   </div>
                 )
              })}
            </div>
          </div>
        );
      }
      if (currentView === 'prof-class' && selectedCourse) {
         const enrolledStudents = enrollments
          .filter(e => e.course_code === selectedCourse.code)
          .map(e => ({...e, student: students.find(s => s.student_id === e.student_id)}));

         return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <button onClick={() => setCurrentView('prof-dashboard')} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Back</button>
               <h1 className="text-2xl font-bold text-nctu-blue">{selectedCourse.code} - {selectedCourse.name}</h1>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-nctu-blue text-white">
                   <tr>
                     <th className="p-3 text-left">ID</th>
                     <th className="p-3 text-left">Name</th>
                     {[1,2,3,4,5,6,7,8,9].map(i => <th key={i} className="p-3 text-center">L{i}</th>)}
                   </tr>
                 </thead>
                 <tbody>
                   {enrolledStudents.map(item => (
                     <tr key={item.enrollment_id} className="border-b hover:bg-gray-50">
                       <td className="p-3">{item.student?.student_id}</td>
                       <td className="p-3 font-medium">{item.student?.full_name}</td>
                       {[1,2,3,4,5,6,7,8,9].map(i => {
                         const checked = attendance.some(a => a.enrollment_id === item.enrollment_id && a.lecture_num === i);
                         return (
                           <td key={i} className="p-3 text-center">
                             <input type="checkbox" checked={checked} 
                               onChange={(e) => toggleAttendance(item.enrollment_id, i, e.target.checked)}
                               className="w-5 h-5 accent-nctu-orange cursor-pointer"
                             />
                           </td>
                         )
                       })}
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
         )
      }
    }

    // --- FINANCE VIEWS ---
    if (currentUser.role === 'finance') {
       return (
         <div className="space-y-6">
           <h1 className="text-2xl font-bold text-nctu-blue border-b-2 border-nctu-orange inline-block pb-2">Fee Management</h1>
           <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
             <div className="flex gap-4 mb-6">
               <input type="number" id="fin-search" placeholder="Enter Student ID" className="flex-1 border p-3 rounded" />
               <button onClick={() => {
                 const id = parseInt((document.getElementById('fin-search') as HTMLInputElement).value);
                 const f = fees.find(fee => fee.student_id === id);
                 const s = students.find(stu => stu.student_id === id);
                 if(!f || !s) alert('Not Found');
                 else {
                    const el = document.getElementById('fin-res');
                    if(el) {
                      el.style.display = 'block';
                      (document.getElementById('fin-name') as HTMLElement).innerText = s.full_name;
                      (document.getElementById('fin-amt') as HTMLElement).innerText = f.amount.toString();
                      (document.getElementById('fin-stat') as HTMLElement).innerText = f.is_paid ? "PAID" : "UNPAID";
                      (document.getElementById('fin-btn-paid') as HTMLButtonElement).onclick = () => { toggleFeeStatus(id, true); alert('Updated'); };
                      (document.getElementById('fin-btn-unpaid') as HTMLButtonElement).onclick = () => { toggleFeeStatus(id, false); alert('Updated'); };
                    }
                 }
               }} className="bg-nctu-blue text-white px-6 rounded font-bold hover:bg-nctu-orange hover:text-nctu-blue">Search</button>
             </div>
             
             <div id="fin-res" className="hidden border-t pt-6 border-dashed border-gray-300">
               <h3 className="text-xl font-bold text-nctu-blue mb-2">Name: <span id="fin-name" className="text-gray-600"></span></h3>
               <p className="mb-2">Amount: <strong id="fin-amt"></strong> EGP</p>
               <p className="mb-6">Status: <span id="fin-stat" className="px-3 py-1 bg-gray-100 rounded text-sm font-bold"></span></p>
               <div className="flex gap-4">
                 <button id="fin-btn-paid" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Mark PAID</button>
                 <button id="fin-btn-unpaid" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Mark UNPAID</button>
               </div>
             </div>
           </div>
         </div>
       )
    }

    return <div>Select an option from the sidebar</div>;
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {renderSidebar()}
      <div className="ml-64 flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
      
      {/* Gemini AI Assistant - Only for Students and Professors */}
      {(currentUser.role === 'student' || currentUser.role === 'professor') && (
        <GeminiAssistant />
      )}
    </div>
  );
};

export default App;
