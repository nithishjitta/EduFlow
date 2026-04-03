import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';

const UpdateProfile = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.profile);

  const submitHandler = async e => {
    e.preventDefault();
    await dispatch(updateProfile(name, email));
    dispatch(loadUser());
    navigate('/profile');
  };

  const inputStyle = {
    focusBorderColor: '#7c5cfc',
    borderRadius: '10px',
    border: '1.5px solid',
    borderColor: 'gray.200',
    fontSize: '14px',
    h: '46px',
    bg: 'white',
    _hover: { borderColor: 'gray.300' },
  };

  return (
    <Box bg="#f7f7f9" minH="90vh" display="flex" alignItems="center" py="10">
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
              w="56px"
              h="56px"
              bg="orange.50"
              borderRadius="16px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="24px"
              mb="5"
            >
              ✏️
            </Box>

            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize="2xl"
              fontWeight="800"
              color="gray.900"
              letterSpacing="-0.02em"
              mb="2"
            >
              Update Profile
            </Heading>
            <Text fontSize="14px" color="gray.500" mb="8" lineHeight="1.7">
              Update your name and email address below.
            </Text>

            <form onSubmit={submitHandler}>
              <VStack spacing="5">
                <Box w="full">
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    color="gray.500"
                    mb="2"
                  >
                    Full Name
                  </Text>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    type="text"
                    {...inputStyle}
                  />
                </Box>

                <Box w="full">
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    color="gray.500"
                    mb="2"
                  >
                    Email Address
                  </Text>
                  <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    {...inputStyle}
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
                  _hover={{
                    bg: '#e04a27',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 24px rgba(255,95,58,0.35)',
                  }}
                  transition="all 0.2s"
                  mt="2"
                >
                  Save Changes →
                </Button>
              </VStack>
            </form>

            <HStack justify="center" mt="6">
              <Text fontSize="13px" color="gray.500">Changed your mind?</Text>
              <Link to="/profile">
                <Button variant="link" color="#7c5cfc" fontWeight="700" fontSize="13px">
                  Back to Profile
                </Button>
              </Link>
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdateProfile;