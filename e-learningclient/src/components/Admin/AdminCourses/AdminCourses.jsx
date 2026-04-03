import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Users/Sidebar';
import CourseModal from './CourseModal';
import { getAllCourses, getCourseLectures } from '../../../redux/actions/course';
import { addLecture, deleteCourse, deleteLecture } from '../../../redux/actions/admin';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const { courses, lectures } = useSelector(state => state.course);
  const { loading, error, message } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [courseId, setCourseId] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  const coureDetailsHandler = (courseId, title) => {
    dispatch(getCourseLectures(courseId));
    onOpen();
    setCourseId(courseId);
    setCourseTitle(title);
  };

  const deleteButtonHandler = courseId => dispatch(deleteCourse(courseId));

  const deleteLectureButtonHandler = async (courseId, lectureId) => {
    await dispatch(deleteLecture(courseId, lectureId));
    dispatch(getCourseLectures(courseId));
  };

  const addLectureHandler = async (e, courseId, title, description, video) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('title', title);
    myForm.append('description', description);
    myForm.append('file', video);
    await dispatch(addLecture(courseId, myForm));
    dispatch(getCourseLectures(courseId));
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (message) { toast.success(message); dispatch({ type: 'clearMessage' }); }
    dispatch(getAllCourses());
  }, [dispatch, error, message, onClose]);

  return (
    <Grid
      minH="100vh"
      templateColumns={['1fr', '1fr', '1fr 220px']}
      bg="#f7f7f9"
    >
      <Box py="10" px={['4', '6', '10']} overflowX="auto">
        <Heading
          fontFamily="'Syne', sans-serif"
          fontSize={['xl', '2xl']}
          fontWeight="800"
          color="gray.900"
          letterSpacing="-0.02em"
          mb="8"
        >
          All Courses
        </Heading>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="20px"
          overflow="hidden"
          boxShadow="0 4px 20px rgba(0,0,0,0.04)"
        >
          <TableContainer>
            <Table variant="simple" size="md">
              <TableCaption
                fontSize="12px"
                color="gray.400"
                fontFamily="'DM Sans', sans-serif"
              >
                All courses in the database
              </TableCaption>
              <Thead bg="gray.50">
                <Tr>
                  {['Poster', 'Title', 'Category', 'Creator', 'Views', 'Lectures', 'Actions'].map(h => (
                    <Th
                      key={h}
                      fontSize="11px"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      color="gray.400"
                      fontFamily="'Syne', sans-serif"
                      py="4"
                      borderColor="gray.100"
                    >
                      {h}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {courses.map(item => (
                  <Row
                    key={item._id}
                    item={item}
                    coureDetailsHandler={coureDetailsHandler}
                    deleteButtonHandler={deleteButtonHandler}
                    loading={loading}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <CourseModal
          isOpen={isOpen}
          onClose={onClose}
          id={courseId}
          courseTitle={courseTitle}
          deleteButtonHandler={deleteLectureButtonHandler}
          addLectureHandler={addLectureHandler}
          lectures={lectures}
          loading={loading}
        />
      </Box>

      <Sidebar />
    </Grid>
  );
};

function Row({ item, coureDetailsHandler, deleteButtonHandler, loading }) {
  return (
    <Tr _hover={{ bg: 'gray.50' }} transition="background 0.15s">
      <Td py="4" borderColor="gray.100">
        <Image
          src={item.poster.url}
          alt={item.title}
          boxSize="48px"
          objectFit="cover"
          borderRadius="10px"
          border="1px solid"
          borderColor="gray.100"
        />
      </Td>
      <Td borderColor="gray.100">
        <Text fontSize="14px" fontWeight="600" color="gray.800" fontFamily="'Syne', sans-serif" noOfLines={1} maxW="200px">
          {item.title}
        </Text>
        <Text fontSize="11px" color="gray.400" mt="0.5">#{item._id.slice(-6)}</Text>
      </Td>
      <Td borderColor="gray.100">
        <Box
          display="inline-block"
          px="3"
          py="1"
          bg="#eef2ff"
          borderRadius="8px"
          fontSize="11px"
          fontWeight="700"
          color="#4f46e5"
          fontFamily="'Syne', sans-serif"
          textTransform="uppercase"
          letterSpacing="0.04em"
        >
          {item.category}
        </Box>
      </Td>
      <Td fontSize="13px" color="gray.600" borderColor="gray.100">{item.createdBy}</Td>
      <Td fontSize="13px" color="gray.600" borderColor="gray.100" isNumeric>{item.views}</Td>
      <Td fontSize="13px" color="gray.600" borderColor="gray.100" isNumeric>{item.numOfVideos}</Td>
      <Td borderColor="gray.100" isNumeric>
        <HStack justifyContent="flex-end" spacing="2">
          <Button
            onClick={() => coureDetailsHandler(item._id, item.title)}
            size="sm"
            variant="outline"
            borderColor="gray.200"
            color="gray.600"
            fontFamily="'Syne', sans-serif"
            fontWeight="600"
            fontSize="12px"
            borderRadius="8px"
            isLoading={loading}
            _hover={{ borderColor: '#7c5cfc', color: '#7c5cfc', bg: '#f0eeff' }}
            transition="all 0.2s"
          >
            Lectures
          </Button>
          <Button
            onClick={() => deleteButtonHandler(item._id)}
            size="sm"
            bg="red.50"
            color="red.500"
            fontFamily="'Syne', sans-serif"
            borderRadius="8px"
            isLoading={loading}
            _hover={{ bg: 'red.500', color: 'white' }}
            transition="all 0.2s"
          >
            <RiDeleteBin7Fill />
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}

export default AdminCourses;