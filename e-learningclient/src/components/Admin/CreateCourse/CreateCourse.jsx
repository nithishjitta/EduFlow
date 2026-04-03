import { categories } from '../../Courses/Courses';
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../../redux/actions/admin';
import { fileUploadCss } from '../../Auth/Register';
import Sidebar from '../Users/Sidebar';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [imagePrev, setImagePrev] = useState('');

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(state => state.admin);

  const changeImageHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = e => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('title', title);
    myForm.append('description', description);
    myForm.append('category', category);
    myForm.append('createdBy', createdBy);
    myForm.append('file', image);
    dispatch(createCourse(myForm));
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (message) { toast.success(message); dispatch({ type: 'clearMessage' }); }
  }, [dispatch, error, message]);

  const fieldStyle = {
    focusBorderColor: '#7c5cfc',
    borderRadius: '10px',
    border: '1.5px solid',
    borderColor: 'gray.200',
    fontSize: '14px',
    h: '46px',
    bg: 'white',
    _hover: { borderColor: 'gray.300' },
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'gray.500',
    mb: '2',
  };

  return (
    <Grid
      minH="100vh"
      templateColumns={['1fr', '1fr', '1fr 220px']}
      bg="#f7f7f9"
    >
      <Box py="10" px={['4', '6', '10']}>
        <Heading
          fontFamily="'Syne', sans-serif"
          fontSize={['xl', '2xl']}
          fontWeight="800"
          color="gray.900"
          letterSpacing="-0.02em"
          mb="8"
        >
          Create New Course
        </Heading>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="20px"
          p={['6', '8', '10']}
          boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          maxW="640px"
        >
          <form onSubmit={submitHandler}>
            <VStack spacing="5">
              <Box w="full">
                <Text {...labelStyle}>Course Title</Text>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. React & Node.js Fullstack"
                  type="text"
                  {...fieldStyle}
                />
              </Box>

              <Box w="full">
                <Text {...labelStyle}>Description</Text>
                <Input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What will students learn?"
                  type="text"
                  {...fieldStyle}
                />
              </Box>

              <Box w="full">
                <Text {...labelStyle}>Creator Name</Text>
                <Input
                  value={createdBy}
                  onChange={e => setCreatedBy(e.target.value)}
                  placeholder="Instructor's name"
                  type="text"
                  {...fieldStyle}
                />
              </Box>

              <Box w="full">
                <Text {...labelStyle}>Category</Text>
                <Select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  {...fieldStyle}
                >
                  <option value="">Select a category</option>
                  {categories.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </Box>

              <Box w="full">
                <Text {...labelStyle}>Course Thumbnail</Text>
                <Input
                  accept="image/*"
                  required
                  type="file"
                  focusBorderColor="#7c5cfc"
                  css={{
                    '&::file-selector-button': {
                      ...fileUploadCss,
                      color: '#7c5cfc',
                    },
                  }}
                  onChange={changeImageHandler}
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  h="46px"
                  bg="white"
                />
              </Box>

              {imagePrev && (
                <Box w="full" borderRadius="14px" overflow="hidden" border="1px solid" borderColor="gray.100">
                  <Image src={imagePrev} w="full" maxH="200px" objectFit="cover" />
                </Box>
              )}

              <Button
                isLoading={loading}
                w="full"
                h="46px"
                bg="#7c5cfc"
                color="white"
                type="submit"
                fontFamily="'Syne', sans-serif"
                fontWeight="700"
                fontSize="14px"
                letterSpacing="0.03em"
                borderRadius="10px"
                _hover={{ bg: '#6344e0', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(124,92,252,0.35)' }}
                transition="all 0.2s"
                mt="2"
              >
                Create Course →
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>

      <Sidebar />
    </Grid>
  );
};

export default CreateCourse;