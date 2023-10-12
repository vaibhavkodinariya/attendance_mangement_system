import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const amsSlice = createApi({
  reducerPath: "attendanceManagementSystem",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/ams" }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    updateEmployee: builder.mutation({
      query: (details) => ({
        url: "/admin/manageEmployee/update",
        method: "PUT",
        body: details,
      }),
    }),
    updateStudent: builder.mutation({
      query: (details) => ({
        url: "/admin/manageStudent/update",
        method: "PUT",
        body: details,
      }),
    }),
    updateAttendance: builder.mutation({
      query: (details) => ({
        url: "/superAdmin/updateAttendance",
        method: "PUT",
        body: details,
      }),
    }),
    addEmployee: builder.mutation({
      query: (details) => ({
        url: "/admin/manageEmployee/ADD",
        method: "POST",
        body: details,
      }),
    }),
    addStudent: builder.mutation({
      query: (details) => ({
        url: "/admin/manageStudent/ADD",
        method: "POST",
        body: details,
      }),
    }),
    addSubject: builder.mutation({
      query: (details) => ({
        url: "/admin/subjects/add",
        method: "POST",
        body: details,
      }),
    }),
    getAllEmployees: builder.query({
      query: () => "/employees/Teaching",
    }),
    getAllDetailsEmployees: builder.query({
      query: (id) => `/employees/getEmployeeProfile/${id}`,
    }),
    getAllStudentBySemesterAndDivision: builder.query({
      query: ({ division, semester }) =>
        `/admin/manageStudent/get/${division}/${semester}`,
    }),
    getDetailsOfStudent: builder.query({
      query: (id) => `/students/getStudent/${id}`,
    }),
    getAllSubjects: builder.query({
      query: () => `/admin/subjects/getSubjects`,
    }),
    getAllQueries: builder.query({
      query: (employeeid) => `/superAdmin/queries/${employeeid}`,
    }),
    getAllAttendance: builder.query({
      query: ({ enrollmentno, subject }) =>
        `/superAdmin/getAttendance/${enrollmentno}/${subject}`,
    }),
    deleteData: builder.mutation({
      query: ({ id, type }) => ({
        url: `/admin/manage/delete/${id}/${type}`,
        method: "DELETE",
      }),
    }),
    deleteSubject: builder.mutation({
      query: ({ subjectname, id }) => ({
        url: `/admin/subjects/delete/${subjectname}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetAllEmployeesQuery,
  useGetAllDetailsEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteDataMutation,
  useAddEmployeeMutation,
  useGetAllStudentBySemesterAndDivisionQuery,
  useGetDetailsOfStudentQuery,
  useUpdateStudentMutation,
  useAddStudentMutation,
  useGetAllSubjectsQuery,
  useDeleteSubjectMutation,
  useAddSubjectMutation,
  useLazyGetAllQueriesQuery,
  useLazyGetAllAttendanceQuery,
  useUpdateAttendanceMutation,
} = amsSlice;
