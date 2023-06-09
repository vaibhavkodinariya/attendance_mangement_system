import React from "react";
import {
  Box,
  Image,
  Stack,
  Input,
  Text,
  Select,
  Button,
  Grid,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import bg from "../images/background.png";
import curveBackground from "../images/Rectangle 9.png";
import { useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useGetDetailsOfStudentQuery } from "../service/amsSlice";
import { useEffect } from "react";
import { useUpdateStudentMutation } from "../service/amsSlice";
import background from "../images/animation.gif"

function AddStudent() {
  const [students, setStudentsDetails] = useState({
    enrollmentno: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    flatNo: "",
    area: "",
    city: "",
    state: "",
    gender: "",
    pincode: "",
    phone: "",
    email: "",
    password: "",
    division: "",
    semester:""
  });

  const {
    enrollmentno,
    firstname,
    middlename,
    lastname,
    dob,
    flatno,
    area,
    city,
    state,
    gender,
    pincode,
    phone,
    email,
    password,
    division,
    semester,
  } = students;

  const toast = useToast();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const location = useLocation();
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  const {
    data,
    isSuccess,
    isLoading: isDetailsLoading,
  } = useGetDetailsOfStudentQuery(location.state.id);

  const [selected, setSelected] = useState("male");
  const [updateStudent,{isLoading:isStudentUpdateLoading}]=useUpdateStudentMutation()

  useEffect(() => {
    if (isSuccess) {
      setStudentsDetails(data.students);
      setSelected(data.students.gender);
      setSelectedDivision(data.students.division);
      setSelectedSemester(data.students.semester);
      setSelectedProgram("MCA");
    }
  }, [data, isSuccess]);

  const onChange = (e) => {
    setStudentsDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeSemester = (e) => {
    setSelectedSemester(e.target.value);
    setStudentsDetails((prevState) => ({
      ...prevState,
      semester: e.target.value,
    }));
  };

  const onChangeDivision = (e) => {
    setSelectedDivision(e.target.value);
    setStudentsDetails((prevState) => ({
      ...prevState,
      division: e.target.value,
    }));
  };

  const onChangeProgram = (e) => {
    setSelectedProgram(e.target.value);
    setStudentsDetails((prevState) => ({
      ...prevState,
      program: e.target.value,
    }));
  };

  const handleGenderChange = (value) => {
    setSelected(value);
    setStudentsDetails((prevState) => ({
      ...prevState,
      gender: value,
    }));
  };

  const onUpdate = (e) => {
    e.preventDefault();
    updateStudent(students).unwrap().then((response)=>{
      if(response.success==true){
        toast({
          title: response.messege,
          status: "success",
          duration: 9000,
          isClosable: true,
          colorScheme: "blue",
        })
      }else{
        toast({
          title: response.messege,
          status: "warning",
          duration: 9000,
          isClosable: true,
          colorScheme: "blue",
        })
      }
    })
  };

  if (isDetailsLoading) {
    return (
      <Box bg="white" h="100vh" w="223vh" overflow="hidden">
        <Image src={background} alt="loader" h="100vh" ml="27%" mt="5dp" />
      </Box>
    );
  }
  if(isStudentUpdateLoading){
    return (
      <Box bg="white" h="100vh" w="223vh" overflow="hidden">
        <Image src={background} alt="loader" h="100vh" ml="27%" mt="5dp" />
      </Box>
    );
  }
  return (
    <Box bg="#1A237E" h="100vh" w="206vh" overflow="hidden">
      <Image src={bg} alt="Logo" h="100vh" mx="auto" mt="5dp" />

      <Box
        maxW={{ base: "90%", sm: "80%", md: "300vh" }}
        maxH={{ base: "90%", sm: "80%", md: "100vh" }}
        justifyContent="center"
        alignItems="center"
        position="absolute"
        top="15%"
        left="13%"
        transform="translate(-8%, -15%)"
      >
        <Image src={curveBackground} top="10%" w="300vh" h="100vh" />
      </Box>
      <Box
        maxW={{ base: "90%", sm: "80%", md: "250vh" }}
        maxH={{ base: "90%", sm: "80%", md: "100vh" }}
        justifyContent="center"
        alignItems="center"
        position="relative"
        left="36%"
        transform="translate(-6%, -170%)"
        zIndex="10"
      >
        <Text
          // mx="auto"
          // left="10%"

          mt="4"
          mb="2"
          fontSize="50px"
          color="#1A237E"
          fontFamily="noto-sherif"
          w="720px"
          h="55px"
          textAlign="center"
        >
          Update Students
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={20}
          mt={25}
        >
          <Stack spacing={25} direction={["row"]}>
            <Stack>
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="Enrollment No."
                _placeholder={{ color: "#1A237E" }}
                color="#1A237E"
                fontFamily="noto-sherif"
                name="enrollmentno"
                value={enrollmentno}
                onChange={onChange}
              />
              <Input
                type="text"
                placeholder="First Name"
                focusBorderColor="#1A237E"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="firstname"
                value={firstname}
                onChange={onChange}
              />
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="Middle Name"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="middlename"
                value={middlename}
                onChange={onChange}
              />
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="Last Name"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="lastname"
                value={lastname}
                onChange={onChange}
              />
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="Date Of Birth"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="dob"
                value={dob}
                onChange={onChange}
              />
              <RadioGroup
                onChange={(value) => handleGenderChange(value)}
                value={selected}
              >
                <Stack direction="row">
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                </Stack>
              </RadioGroup>
            </Stack>
            <Stack>
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="Flat No."
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="flatno"
                value={flatno}
                onChange={onChange}
              />
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="Area"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="area"
                value={area}
                onChange={onChange}
              />
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="City"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="city"
                value={city}
                onChange={onChange}
              />
              <Input
                type="text"
                focusBorderColor="#1A237E"
                placeholder="State"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="state"
                value={state}
                onChange={onChange}
              />
              <Input
                type="number"
                focusBorderColor="#1A237E"
                placeholder="Pincode"
                _placeholder={{ color: "#1A237E" }}
                fontFamily="noto-sherif"
                color="#1A237E"
                name="pincode"
                value={pincode}
                onChange={onChange}
              />
            </Stack>
            <Stack>
              <Input
                type="tel"
                focusBorderColor="#1A237E"
                placeholder="Phone No."
                _placeholder={{ color: "#1A237E" }}
                color="#1A237E"
                fontFamily="noto-sherif"
                name="phone"
                value={phone}
                onChange={onChange}
              />
              <Input
                type="email"
                focusBorderColor="#1A237E"
                placeholder="Email"
                _placeholder={{ color: "#1A237E" }}
                color="#1A237E"
                fontFamily="noto-sherif"
                name="email"
                value={email}
                onChange={onChange}
              />
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  focusBorderColor="#1A237E"
                  _placeholder={{ color: "#1A237E" }}
                  color="#1A237E"
                fontFamily="noto-sherif"
                name="password"
                  value={password}
                  onChange={onChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <Select
                placeholder="Semester"
                fontFamily="noto-sherif"
                color="#1A237E"
                focusBorderColor="#1A237E"
                _placeholder={{ color: "#1A237E" }}
                value={selectedSemester}
                onChange={onChangeSemester}
              >
                <option value="Semester-1">Semester 1</option>
                <option value="Semester-2">Semester 2</option>
                <option value="Semester-3">Semester 3</option>
                <option value="Semester-4">Semester 4</option>
                <option value="Semester-5">Semester 5</option>
                <option value="Semester-6">Semester 6</option>
              </Select>
              <Select
                placeholder="Programe"
                fontFamily="noto-sherif"
                color="#1A237E"
                focusBorderColor="#1A237E"
                _placeholder={{ color: "#1A237E" }}
                value={selectedProgram}
                onChange={onChangeProgram}
              >
                <option value="MCA">MCA</option>
                <option value="MscIT">MscIT</option>
                <option value="BCA">BCA</option>
              </Select>
              <Select
                placeholder="Division"
                fontFamily="noto-sherif"
                color="#1A237E"
                focusBorderColor="#1A237E"
                _placeholder={{ color: "#1A237E" }}
                value={selectedDivision}
                onChange={onChangeDivision}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <br></br>
                <option value="C">C</option>
              </Select>
            </Stack>
          </Stack>
        </Grid>
        <Button
          type="submit"
          bg="#1A237E"
          color="white"
          borderRadius={50}
          _hover={{ bg: " #202A9A" }}
          w="100px"
                fontFamily="noto-sherif"
                h="49px"
          alignSelf="center"
          left="17%"
          onClick={onUpdate}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
}

export default AddStudent;
