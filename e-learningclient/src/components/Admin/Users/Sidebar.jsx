import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import {
  RiAddCircleFill,
  RiDashboardFill,
  RiEyeFill,
  RiUser3Fill,
} from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: RiDashboardFill, text: 'Dashboard', url: 'dashboard' },
  { icon: RiAddCircleFill, text: 'Create Course', url: 'createcourse' },
  { icon: RiEyeFill, text: 'Courses', url: 'courses' },
  { icon: RiUser3Fill, text: 'Users', url: 'users' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box
      bg="#0a0a1e"
      minH="100vh"
      p="6"
      display="flex"
      flexDirection="column"
      gap="2"
      borderLeft="1px solid"
      borderColor="whiteAlpha.100"
    >
      {/* Logo */}
      <HStack spacing="2" mb="8" px="2">
        <Box w="8px" h="8px" borderRadius="full" bg="#ff5f3a" flexShrink="0" />
        <Text fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="16px" color="white" letterSpacing="-0.02em">
          EduFlow
        </Text>
      </HStack>

      {/* Nav items */}
      <VStack spacing="1" align="stretch">
        {navItems.map(({ icon: Icon, text, url }) => {
          const isActive = location.pathname === `/admin/${url}`;
          return (
            <Link to={`/admin/${url}`} key={url}>
              <HStack
                spacing="3"
                px="3"
                py="3"
                borderRadius="12px"
                bg={isActive ? '#ff5f3a' : 'transparent'}
                color={isActive ? 'white' : 'whiteAlpha.500'}
                fontFamily="'Syne', sans-serif"
                fontWeight="600"
                fontSize="13px"
                letterSpacing="0.02em"
                transition="all 0.2s"
                _hover={{
                  bg: isActive ? '#ff5f3a' : 'whiteAlpha.100',
                  color: 'white',
                }}
              >
                <Box fontSize="15px">
                  <Icon />
                </Box>
                <Text>{text}</Text>
              </HStack>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;