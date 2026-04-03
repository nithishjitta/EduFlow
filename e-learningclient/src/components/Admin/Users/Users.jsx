import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getAllUsers, updateUserRole } from '../../../redux/actions/admin';
import toast from 'react-hot-toast';

const Users = () => {
  const { users, loading, error, message } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  const updateHandler = userId => dispatch(updateUserRole(userId));
  const deleteButtonHandler = userId => dispatch(deleteUser(userId));

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (message) { toast.success(message); dispatch({ type: 'clearMessage' }); }
    dispatch(getAllUsers());
  }, [dispatch, error, message]);

  return (
    <Grid
      minH="100vh"
      templateColumns={['1fr', '1fr', '1fr 220px']}
      bg="#f7f7f9"
    >
      <Box py="10" px={['4', '6', '10']} overflowX="auto">
        <HStack justify="space-between" mb="8">
          <Heading
            fontFamily="'Syne', sans-serif"
            fontSize={['xl', '2xl']}
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.02em"
          >
            All Users
          </Heading>
          {users && (
            <Box px="4" py="2" bg="#eef2ff" borderRadius="10px">
              <Text fontSize="13px" fontWeight="700" color="#4f46e5" fontFamily="'Syne', sans-serif">
                {users.length} total
              </Text>
            </Box>
          )}
        </HStack>

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
              <TableCaption fontSize="12px" color="gray.400">
                All registered users in the database
              </TableCaption>
              <Thead bg="gray.50">
                <Tr>
                  {['User', 'Email', 'Role', 'Subscription', 'Actions'].map(h => (
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
                {users && users.map(item => (
                  <Row
                    key={item._id}
                    item={item}
                    updateHandler={updateHandler}
                    deleteButtonHandler={deleteButtonHandler}
                    loading={loading}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Sidebar />
    </Grid>
  );
};

function Row({ item, updateHandler, deleteButtonHandler, loading }) {
  const isActive = item.subscription && item.subscription.status === 'active';
  const initials = item.name ? item.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  return (
    <Tr _hover={{ bg: 'gray.50' }} transition="background 0.15s">
      <Td py="4" borderColor="gray.100">
        <HStack spacing="3">
          <Box
            w="36px"
            h="36px"
            borderRadius="10px"
            bgGradient="linear(135deg, #7c5cfc, #ff5f3a)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontFamily="'Syne', sans-serif"
            fontSize="12px"
            fontWeight="700"
            color="white"
            flexShrink="0"
          >
            {initials}
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="600" color="gray.800" fontFamily="'Syne', sans-serif">
              {item.name}
            </Text>
            <Text fontSize="11px" color="gray.400">
  #{item?._id?.toString().slice(-6)}
</Text>
          </Box>
        </HStack>
      </Td>
      <Td fontSize="13px" color="gray.600" borderColor="gray.100">{item.email}</Td>
      <Td borderColor="gray.100">
        <Box
          display="inline-block"
          px="3"
          py="1"
          borderRadius="8px"
          fontSize="11px"
          fontWeight="700"
          fontFamily="'Syne', sans-serif"
          textTransform="uppercase"
          letterSpacing="0.04em"
          bg={item.role === 'admin' ? '#fff7ed' : '#f7f7f9'}
          color={item.role === 'admin' ? '#ea580c' : '#6b7280'}
        >
          {item.role}
        </Box>
      </Td>
      <Td borderColor="gray.100">
        <Box
          display="inline-block"
          px="3"
          py="1"
          borderRadius="8px"
          fontSize="11px"
          fontWeight="700"
          fontFamily="'Syne', sans-serif"
          textTransform="uppercase"
          letterSpacing="0.04em"
          bg={isActive ? '#f0fdf4' : '#f7f7f9'}
          color={isActive ? '#16a34a' : '#9ca3af'}
        >
          {isActive ? 'Active' : 'Free'}
        </Box>
      </Td>
      <Td borderColor="gray.100" isNumeric>
        <HStack justifyContent="flex-end" spacing="2">
          <Button
            onClick={() => updateHandler(item._id)}
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
            Change Role
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

export default Users;