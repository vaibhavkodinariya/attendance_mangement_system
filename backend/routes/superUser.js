const express = require('express')
const router = express.Router()
const { studentData, attendanceOfStudent } = require('../controllers/studentsController')
const { getAllEmployees } = require('../controllers/employeeTeachingController')
const { deleteData, getAllQuery } = require('../controllers/employeeNonTeachingController')
const { getAttendanceStudents, updateAttendance } = require('../controllers/superUserController')

//View Student
router.get('/getStudents/:division/:semester', studentData)

router.get('/attend/:subject/:enrollmentNumber', attendanceOfStudent)

//View Employee
router.get('/getEmployees/:type', getAllEmployees)

router.delete('/deleteData/:id/:type', deleteData)

router.get('/queries/:employeeid', getAllQuery)

router.get('/getAttendance/:enrollmentno/:subject', getAttendanceStudents)

router.put('/updateAttendance', updateAttendance)

module.exports = router