const asyncHandler = require("express-async-handler");
const { connectDb } = require("../config/db");
const con = connectDb();

//@method GET
//@desc Get Employee
//@PATH /ams/employees/:id
const getEmployeesById = asyncHandler(async (req, res) => {
  var getEmployeesById = "SELECT * FROM employees where employeeid=?";
  const employee = await new Promise((resolve) => {
    con.query(getEmployeesById, [req.params.id], (err, res) => {
      if (err) res.send({ success: false, messege: "Something Went Wrong" });
      resolve(res);
    });
  });

  var queryToGetSubjectsTakeByEmployee =
    "SELECT subjects.subjectname FROM subjects INNER JOIN divisions ON divisions.subjectid = subjects.subjectid INNER JOIN employees ON divisions.employeeid = employees.employeeid WHERE employees.employeeid= ?";
  var getAllSubjectsOfEmployee = await new Promise((resolve) => {
    con.query(
      queryToGetSubjectsTakeByEmployee,
      [req.params.id],
      (err, result) => {
        if (err) res.send({ success: false, messege: "Something Went Wrong" });

        resolve(result);
      }
    );
  });
  var getSubjects = [];
  for (let i in getAllSubjectsOfEmployee) {
    getSubjects.push(getAllSubjectsOfEmployee[i]["subjectname"]);
  }
  res.send({ success: true, employee: employee[0], subjects: getSubjects });
});

//@method GET
//@desc Get Employee
//@PATH /ams/employees/
const getAllEmployees = asyncHandler(async (req, res) => {
  if (!req.params) return res.send({ success: false });
  var getAllEmployees =
    "SELECT employeeid, firstname,middlename,lastname,gender,email FROM employees WHERE type=?";
  con.query(getAllEmployees, [req.params.type], (err, result) => {
    if (err) res.send({ success: false, messege: "Something Went Wrong" });

    res.send({ success: true, employees: result });
  });
});

//@desc Take attendance of students
//@method POST
//@PATH /ams/employees/takeAttendance
const takeAttendance = asyncHandler(async (req, res) => {
  const { subject, date, attendance, employeeid } = req.body;

  if (!subject || !date || !attendance || !employeeid) {
    return res.send({ success: false, messege: "Please Fill result" });
  }
  // Get All Students Attendance till now
  const getStudentsTotalAttendance = await new Promise((resolve) => {
    con.query(
      `Select enrollmentno,Totalstudentattendtillnow from ${subject}`,
      (err, rows) => {
        if (err) {
          return res.send({ success: false, messege: "Something Went Wrong" });
        }
        var jsonData = new Array(rows);

        const getStudentAttendance = jsonData[0].map((row) => {
          const { enrollmentno, Totalstudentattendtillnow } = row;
          const obj = {};
          obj[enrollmentno] = Totalstudentattendtillnow;
          return obj;
        });

        resolve(getStudentAttendance);
      }
    );
  });

  var getColumnIFExsist = `SHOW COLUMNS FROM ${subject}`;

  con.query(getColumnIFExsist, (err, rows) => {
    if (err) {
      return res.send({ success: false, messege: "Something Went Wrong" });
    }

    var i = 1;
    var k = 0;
    var arrayColumns = [];

    while (i <= rows.length) {
      arrayColumns.push(rows[k].Field);
      k++;
      i++;
    }

    var checkColumn = arrayColumns.indexOf(date);

    if (checkColumn < 1) {
      var addColumnSql = `ALTER TABLE ${subject} ADD ${date} int(10)`;
      con.query(addColumnSql);
    }

    var checkLectureQuery = `SELECT COUNT(${date}) FROM ${subject} WHERE employeeid=?`;

    con.query(checkLectureQuery, [employeeid], (err, rows) => {
      if (err) {
        return res.send({ success: false, messege: "Something Went Wrong" });
      }
      let countOfData = JSON.parse(JSON.stringify(rows[0]));

      const columnsNames = arrayColumns.slice(5);
      const checkDate = date.substring(0, date.length - 2);

      let count = 0;
      for (colNames of columnsNames) {
        actualDates = colNames.substring(0, colNames.length - 2);
        if (checkDate == actualDates) {
          count++;
        }
      }

      var newDate;
      if (countOfData[`COUNT(${date})`] > 0) {
        var getCurrentLecture = date.charAt(date.length - 1);
        var newLecture = parseInt(getCurrentLecture) + count;
        var currentDate = date.substring(0, date.length - 1);
        newDate = currentDate + newLecture;
        var addColumnSql = `ALTER TABLE ${subject} ADD ${newDate} int(10)`;
        con.query(addColumnSql);
      }

      var addDate;
      if (newDate) {
        addDate = newDate;
      } else {
        addDate = date;
      }

      var getColumnsCount =
        "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = ?";
      con.query(getColumnsCount, [subject], (err, result) => {
        if (err)
          return res.send({ success: false, messege: "Something Went Wrong" });

        var jsonData = JSON.parse(JSON.stringify(result[0]));
        var totalLectures = jsonData["COUNT(*)"] - 5;

        var results = {};
        for (const key in attendance) {
          let sum = attendance[key];
          for (const obj2 of getStudentsTotalAttendance) {
            if (obj2.hasOwnProperty(key)) {
              sum += obj2[key];
            }
          }
          results[key] = sum;
        }

        for (let key in results) {
          var insertAttendanceSql = `UPDATE ${subject} SET ${addDate}=?,TotalLecturestillnow=?,Totalstudentattendtillnow=? WHERE enrollmentno=? && employeeid=?`;
          con.query(insertAttendanceSql, [
            attendance[key],
            totalLectures,
            results[key],
            key,
            employeeid,
          ]);
        }

        return res.send({ success: true, messege: "Attendance Submitted" });
      });
    });
  });
});

//@desc Update of students Attendance
//@method PUT
//@PATH /ams/employees/updateAttendance
const updateStudentAttendance = asyncHandler(async (req, res) => {
  const { subject, employeeId, date, attendance } = req.body;
  if (!subject || !employeeId || !date) {
    res.send({ success: false, messege: "Please Fill Data" });
  } else {
    var promises = [];
    for (var key in attendance) {
      var getStudentAttendancetillnow = `Select enrollmentno,Totalstudentattendtillnow from ${subject} WHERE enrollmentno=? && employeeid=?`;
      var promise = await new Promise((resolve) => {
        con.query(
          getStudentAttendancetillnow,
          [attendance[key]["enrollmentno"], employeeId],
          (err, results) => {
            var data = JSON.parse(JSON.stringify(results));
            resolve(data[0]);
          }
        );
      });
      promises.push(promise);
    }
    Promise.all(promises)
      .then((results) => {
        let finalSubtractedAttendance = [];
        for (let i = 0; i < results.length; i++) {
          const item1 = results[i];
          const item2 = attendance.find(
            (item) => item.enrollmentno === item1.enrollmentno
          );
          if (item2) {
            if (item2.attend === 1) {
              finalSubtractedAttendance.push({
                enrollmentno: item1.enrollmentno,
                difference: item1.Totalstudentattendtillnow + 1,
              });
            } else {
              finalSubtractedAttendance.push({
                enrollmentno: item1.enrollmentno,
                difference: item1.Totalstudentattendtillnow - 1,
              });
            }
          }
        }
        for (var key in attendance) {
          var updateAttendanceSql = `UPDATE ${subject} SET ${date}=?,Totalstudentattendtillnow=? WHERE enrollmentno=? && employeeid=?`;
          con.query(
            updateAttendanceSql,
            [
              attendance[key]["attend"],
              finalSubtractedAttendance[key]["difference"],
              attendance[key]["enrollmentno"],
              employeeId,
            ],
            (err) => {
              if (err) {
                return res.send({
                  success: false,
                  messege: "Something Went Wrong",
                });
              }
            }
          );
        }
        return res.send({ success: true, messege: "Attendance Updated" });
      })
      .catch((err) => {
        return res.send({ success: false, messege: "Something Went Wrong" });
      });
  }
});

//@desc Take attendance of students
//@method POST
//@PATH /ams/employees/query
const responseQueryToStudent = asyncHandler(async (req, res) => {
  const {
    description,
    employeeId,
    enrollmentNumber,
    programId,
    subjectId,
    semesterId,
  } = req.body;

  if (
    !description ||
    !employeeId ||
    !enrollmentNumber ||
    !programId ||
    !semesterId
  ) {
    res.send({ success: false, messege: "Please Fill Data" });
  } else {
    var sendResponseToStudent = `INSERT INTO queries(description,employeeid,enrollmentno,programid,subjectid,semesterid)values(?,?,?,?,?,?)`;
    con.query(
      sendResponseToStudent,
      [
        description,
        employeeId,
        enrollmentNumber,
        programId,
        subjectId,
        semesterId,
      ],
      (err) => {
        if (err)
          return res.send({ success: false, messege: "Something Went Wrong" });
      }
    );
    res.send({ success: true, messege: "Response Submitted" });
  }
});

//@desc Take attendance of students
//@method GET
//@PATH /ams/employees/query/:id
const getStudentsQuery = asyncHandler(async (req, res) => {
  if (!req.params)
    return res.send({ success: false, messege: "Invalid Username" });

  var studentsQueryDetails =
    "SELECT subjects.subjectname,queries.description,students.firstname,students.middlename,students.lastname FROM queries INNER JOIN students ON queries.enrollmentno=students.enrollmentno INNER JOIN subjects ON queries.subjectid=subjects.subjectid WHERE employeeid=?";
  var queries = await new Promise((resolve) => {
    con.query(studentsQueryDetails, [req.params.id], (err, result) => {
      if (err)
        return res.send({ success: false, messege: "Something Went Wrong" });
      resolve(result);
    });
  });
  if (queries.length === 0)
    return res.send({ success: false, messege: "No Queries Found Yet" });

  res.send({ success: true, queries });
});

//@method GET
//@desc GET students By Division
//@PATH /ams/getStudentsByDivision/:division
const getStudentsByDivision = asyncHandler(async (req, res) => {
  if (!req.params)
    return res.send({ success: false, messege: "Invalid Username" });

  const { subject, id } = req.params;
  const selectDataQuery = `SELECT ${subject}.enrollmentno,students.firstname,students.middlename,students.lastname FROM ${subject} INNER JOIN students ON ${subject}.enrollmentno=students.enrollmentno WHERE ${subject}.employeeid=?`;
  con.query(selectDataQuery, [id], (error, results) => {
    if (error)
      return res.send({
        success: false,
        messege: "Failed to retrieve students from the database",
        error,
      });

    res.send({
      success: true,
      students: results,
    });
  });
});

//@desc Take attendance of students
//@method GET
//@PATH /ams/employees/getStudentAttendance
const getStudentsAttendance = asyncHandler(async (req, res) => {
  if (!req.params)
    return res.send({ success: false, messege: "Please Send Proper Data" });

  var getStudentAttendance = `SELECT TotalLecturestillnow,Totalstudentattendtillnow FROM ${req.params.subject} WHERE employeeid=? && enrollmentno=? `;
  var getAttendance = await new Promise((resolve) => {
    con.query(
      getStudentAttendance,
      [req.params.id, req.params.enrollmentNo],
      (err, result) => {
        if (err)
          return res.send({ success: false, messege: "Something Went Wrong" });
        if (result === undefined) {
          resolve(null);
        } else {
          var jsonData = JSON.parse(JSON.stringify(result));
          resolve(jsonData);
        }
      }
    );
  });
  if (getAttendance.length === 0) {
    res.send({ success: false, messege: "No Attendnace Records Found Yet" });
  } else {
    var percentage =
      (getAttendance[0]["Totalstudentattendtillnow"] /
        getAttendance[0]["TotalLecturestillnow"]) *
      100;
    res.send({
      success: true,
      TotalNumberOfLectures: getAttendance[0]["TotalLecturestillnow"],
      studentAttendLecture: getAttendance[0]["Totalstudentattendtillnow"],
      attendancePercentage: percentage,
    });
  }
});

//@desc Get Dates of Attendance
//@method GET
//@PATH /ams/employees/attendancedates/:employeeid
const getAllTakenAttendances = asyncHandler(async (req, res) => {
  if (!req.params)
    return res.send({ success: false, messege: "Please Send Data Properly" });

  const { subject } = req.params;
  var getColumnNamesQuery = `SHOW COLUMNS FROM ${subject}`;
  const getColumnNames = await new Promise((resolve) => {
    con.query(getColumnNamesQuery, (err, names) => {
      var i = 1;
      var k = 0;
      var arrayColumns = [];

      while (i <= names.length) {
        arrayColumns.push(names[k].Field);
        k++;
        i++;
      }

      const columnsNames = arrayColumns.slice(5);
      resolve(columnsNames);
    });
  });
  if (getColumnNames.length === 0) return res.send({ success: false });

  var promises = [];
  for (var date of getColumnNames) {
    var checkNullDataQuery = `SELECT ${date} FROM ${subject} WHERE employeeid=?`;
    var promise = await new Promise((resolve) => {
      con.query(checkNullDataQuery, [req.params.employeeid], (err, counter) => {
        resolve(counter);
      });
    });
    promises.push(promise);
  }
  if (promises.length === 0) {
    res.send({ success: false, messege: "No Attendance Records Found" });
  } else {
    const lectureByDate = {};
    promises.forEach((arr) => {
      arr.forEach((obj) => {
        const key = obj && Object.keys(obj)[0];
        if (key && obj[key]) {
          const date = key.substring(0, key.length - 2);
          const subKey = key.substring(key.length - 2);
          if (!lectureByDate[date]) {
            lectureByDate[date] = [];
          }
          if (!lectureByDate[date].includes(subKey)) {
            lectureByDate[date].push(subKey);
          }
        }
      });
    });

    res.send({ success: true, Dates: lectureByDate });
  }
});

//@desc Get Attendance By Date
//@method GET
//@PATH /ams/employees/attendance/:employeeid
const getAttendanceByDate = asyncHandler(async (req, res) => {
  if (!req.params)
    return res.send({ success: false, messege: "Please Send Data Properly" });

  const { date, subject } = req.params;
  var getStudentAttendance = `SELECT students.firstname,students.middlename,students.lastname,students.enrollmentno,${date} FROM ${subject} INNER JOIN students ON ${subject}.enrollmentno=students.enrollmentno WHERE employeeid=? `;
  var getAttendance = await new Promise((resolve) => {
    con.query(getStudentAttendance, [req.params.employeeid], (err, result) => {
      if (err)
        return res.send({ success: false, messege: "Something Went Wrong" });
      var jsonData = JSON.parse(JSON.stringify(result));
      resolve(jsonData);
    });
  });
  if (getAttendance.length === 0)
    return res.send({
      success: false,
      messege: "No Attendance Records Found Yet",
    });
  res.send({ success: true, attendance: getAttendance });
});

//@desc Get Employees Subjects
//@method GET
//@PATH /ams/employees/getEmployeesSubjects/:id
const getEmployeesSubjects = asyncHandler(async (req, res) => {
  if (!req.params.id)
    return res.send({ success: false, messege: "Please Send Data Properly" });
  var queryToGetSubjectsTakeByEmployee =
    "SELECT subjects.subjectname FROM subjects INNER JOIN divisions ON divisions.subjectid = subjects.subjectid INNER JOIN employees ON divisions.employeeid = employees.employeeid WHERE employees.employeeid= ?";
  con.query(
    queryToGetSubjectsTakeByEmployee,
    [req.params.id],
    (err, result) => {
      if (err) res.send({ success: false, messege: "Something Went Wrong" });
      var getSubjects = [];
      for (let i in result) {
        getSubjects.push(result[i]["subjectname"]);
      }
      res.send({ success: true, subjects: getSubjects });
    }
  );
});

module.exports = {
  takeAttendance,
  getEmployeesById,
  getAllEmployees,
  updateStudentAttendance,
  responseQueryToStudent,
  getStudentsQuery,
  getStudentsAttendance,
  getAllTakenAttendances,
  getAttendanceByDate,
  getEmployeesSubjects,
  getStudentsByDivision,
};
