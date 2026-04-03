import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { courseRequest } from '../../redux/actions/other';
import toast from 'react-hot-toast';

const Request = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');

  const dispatch = useDispatch();
  const { loading, error, message: stateMessage } = useSelector(state => state.other);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(courseRequest(name, email, course));
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (stateMessage) { toast.success(stateMessage); dispatch({ type: 'clearMessage' }); }
  }, [dispatch, error, stateMessage]);

  const inputStyle = {
    focusBorderColor: '#ff5f3a',
    borderRadius: '10px',
    border: '1.5px solid',
    borderColor: 'gray.200',
    fontSize: '14px',
    h: '46px',
    bg: 'white',
    _hover: { borderColor: 'gray.300' },
  };

  return (
    <Box bg="#f7f7f9" minH="90vh" py="16">
      <Container maxW="container.sm">
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="20px"
          overflow="hidden"
          boxShadow="0 4px 20px rgba(0,0,0,0.06)"
        >
          <Box h="4px" bgGradient="linear(to-r, #ff5f3a, #7c5cfc)" />
          <Box p={['6', '10']}>
            <Box
              w="56px" h="56px" bg="orange.50" borderRadius="16px"
              display="flex" alignItems="center" justifyContent="center"
              fontSize="24px" mb="5"
            >
              💡
            </Box>
            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize="2xl"
              fontWeight="800"
              color="gray.900"
              letterSpacing="-0.02em"
              mb="2"
            >
              Request a Course
            </Heading>
            <Text fontSize="14px" color="gray.500" mb="8" lineHeight="1.7">
              Don&apos;t see a course you need? Tell us about it and we&apos;ll consider adding it to our library.
            </Text>

            <form onSubmit={submitHandler}>
              <VStack spacing="5">
                <Box w="full">
                  <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.500" mb="2">Name</FormLabel>
                  <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" type="text" {...inputStyle} />
                </Box>
                <Box w="full">
                  <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.500" mb="2">Email</FormLabel>
                  <Input required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" {...inputStyle} />
                </Box>
                <Box w="full">
                  <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.500" mb="2">Course Description</FormLabel>
                  <Textarea
                    required
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    placeholder="Describe the course you'd like to see — topic, level, any specific skills..."
                    focusBorderColor="#ff5f3a"
                    borderRadius="10px"
                    border="1.5px solid"
                    borderColor="gray.200"
                    fontSize="14px"
                    rows={5}
                    bg="white"
                    _hover={{ borderColor: 'gray.300' }}
                    resize="none"
                  />
                </Box>

                <Button
                  isLoading={loading}
                  type="submit"
                  w="full"
                  h="46px"
                  bg="#ff5f3a"
                  color="white"
                  fontFamily="'Syne', sans-serif"
                  fontWeight="700"
                  fontSize="14px"
                  letterSpacing="0.03em"
                  borderRadius="10px"
                  _hover={{ bg: '#e04a27', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(255,95,58,0.35)' }}
                  transition="all 0.2s"
                >
                  Submit Request →
                </Button>
              </VStack>
            </form>

            <Box mt="6" pt="5" borderTop="1px solid" borderColor="gray.100">
              <Text fontSize="13px" color="gray.500">
                Want to see what we already have?{' '}
                <Link to="/courses">
                  <Button variant="link" color="#7c5cfc" fontWeight="700" fontSize="13px">
                    Browse courses
                  </Button>
                </Link>
              </Text>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Request;