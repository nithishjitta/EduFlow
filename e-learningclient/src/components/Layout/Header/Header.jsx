import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import {
  RiAddLine,
  RiDashboardFill,
  RiHomeLine,
  RiInformationLine,
  RiLogoutBoxLine,
  RiMenu5Fill,
  RiBookOpenLine,
  RiPhoneLine,
  RiUserLine,
} from 'react-icons/ri';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/actions/user';

const navLinks = [
  { url: '/', label: 'Home' },
  { url: '/courses', label: 'Courses' },
  { url: '/recommend', label: 'AI Picks ✨' },
  { url: '/subscribe', label: 'Pricing' },
  { url: '/about', label: 'About' },
];

const drawerLinks = [
  { url: '/', label: 'Home', icon: <RiHomeLine /> },
  { url: '/courses', label: 'Browse Courses', icon: <RiBookOpenLine /> },
  { url: '/recommend', label: 'AI Recommendations ✨', icon: <RiBookOpenLine /> },
  { url: '/subscribe', label: 'Pricing', icon: <RiInformationLine /> },
  { url: '/request', label: 'Request a Course', icon: <RiAddLine /> },
  { url: '/contact', label: 'Contact Us', icon: <RiPhoneLine /> },
  { url: '/about', label: 'About', icon: <RiInformationLine /> },
];

const Header = ({ isAuthenticated = false, user }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = () => {
    onClose();
    dispatch(logout());
    navigate('/');
  };

  const isActive = url =>
    url === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(url);

  return (
    <>
      <Box
        as="header"
        bg="#0a0a1e"
        borderBottom="1px solid rgba(255,255,255,0.06)"
        position="sticky"
        top="0"
        zIndex="sticky"
        px={['4', '8']}
        h="68px"
        display="flex"
        alignItems="center"
      >
        <Flex align="center" w="full" maxW="container.xl" mx="auto">
          {/* Logo */}
          <Link to="/">
            <HStack spacing="2" cursor="pointer">
              <Box w="8px" h="8px" borderRadius="full" bg="#ff5f3a" flexShrink="0" />
              <Text
                fontFamily="'Syne', sans-serif"
                fontWeight="800"
                fontSize="18px"
                color="white"
                letterSpacing="-0.02em"
                _hover={{ opacity: 0.85 }}
                transition="opacity 0.2s"
              >
                EduFlow
              </Text>
            </HStack>
          </Link>

          <Spacer />

          {/* Desktop nav */}
          <HStack spacing="1" display={{ base: 'none', md: 'flex' }}>
            {navLinks.map(({ url, label }) => (
              <Link key={url} to={url}>
                <Button
                  variant="ghost"
                  size="sm"
                  h="36px"
                  px="4"
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight={isActive(url) ? '600' : '400'}
                  fontSize="14px"
                  color={isActive(url) ? 'white' : 'rgba(255,255,255,0.5)'}
                  bg={isActive(url) ? 'rgba(255,255,255,0.08)' : 'transparent'}
                  borderRadius="8px"
                  _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'white' }}
                  transition="all 0.15s"
                >
                  {label}
                </Button>
              </Link>
            ))}
          </HStack>

          <Spacer />

          {/* Right side */}
          <HStack spacing="2">
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Box}
                  cursor="pointer"
                  borderRadius="12px"
                  border="1px solid rgba(255,255,255,0.12)"
                  p="1.5"
                  _hover={{ border: '1px solid rgba(255,255,255,0.25)' }}
                  transition="all 0.2s"
                >
                  <HStack spacing="2" px="1">
                    <Avatar
                      size="xs"
                      name={user?.name}
                      src={user?.avatar?.url}
                      borderRadius="8px"
                    />
                    <Text
                      display={{ base: 'none', md: 'block' }}
                      fontSize="13px"
                      fontWeight="500"
                      color="rgba(255,255,255,0.7)"
                      maxW="100px"
                      noOfLines={1}
                    >
                      {user?.name}
                    </Text>
                    <Text fontSize="10px" color="rgba(255,255,255,0.3)" display={{ base: 'none', md: 'block' }}>
                      ▾
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg="white"
                  border="1px solid"
                  borderColor="gray.100"
                  borderRadius="14px"
                  boxShadow="0 16px 48px rgba(0,0,0,0.12)"
                  p="2"
                  minW="180px"
                >
                  <MenuItem
                    as={Link}
                    to="/profile"
                    icon={<RiUserLine />}
                    borderRadius="8px"
                    fontSize="14px"
                    fontFamily="'DM Sans', sans-serif"
                    _hover={{ bg: 'gray.50' }}
                  >
                    My Courses & Profile
                  </MenuItem>
                  <MenuItem
                    as={Link}
                    to="/request"
                    icon={<RiAddLine />}
                    borderRadius="8px"
                    fontSize="14px"
                    fontFamily="'DM Sans', sans-serif"
                    _hover={{ bg: 'gray.50' }}
                  >
                    Request Course
                  </MenuItem>
                  {user && user.role === 'admin' && (
                    <MenuItem
                      as={Link}
                      to="/admin/dashboard"
                      icon={<RiDashboardFill />}
                      borderRadius="8px"
                      fontSize="14px"
                      fontFamily="'DM Sans', sans-serif"
                      _hover={{ bg: 'gray.50' }}
                    >
                      Dashboard
                    </MenuItem>
                  )}
                  <Box h="1px" bg="gray.100" my="1" />
                  <MenuItem
                    onClick={logoutHandler}
                    icon={<RiLogoutBoxLine />}
                    borderRadius="8px"
                    fontSize="14px"
                    fontFamily="'DM Sans', sans-serif"
                    color="red.500"
                    _hover={{ bg: 'red.50' }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <HStack spacing="2" display={{ base: 'none', md: 'flex' }}>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    h="36px"
                    px="5"
                    fontFamily="'Syne', sans-serif"
                    fontWeight="600"
                    fontSize="13px"
                    color="rgba(255,255,255,0.6)"
                    borderRadius="8px"
                    _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'white' }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    h="36px"
                    px="5"
                    bg="#ff5f3a"
                    color="white"
                    fontFamily="'Syne', sans-serif"
                    fontWeight="700"
                    fontSize="13px"
                    borderRadius="8px"
                    _hover={{ bg: '#e04a27' }}
                    transition="all 0.2s"
                  >
                    Get Started
                  </Button>
                </Link>
              </HStack>
            )}

            {/* Mobile hamburger */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              icon={<RiMenu5Fill />}
              variant="ghost"
              color="rgba(255,255,255,0.7)"
              aria-label="Open menu"
              borderRadius="8px"
              _hover={{ bg: 'rgba(255,255,255,0.08)' }}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg="#0a0a1e" maxW="280px">
          <DrawerHeader
            borderBottom="1px solid rgba(255,255,255,0.06)"
            py="5"
            px="6"
          >
            <HStack spacing="2">
              <Box w="8px" h="8px" borderRadius="full" bg="#ff5f3a" />
              <Text
                fontFamily="'Syne', sans-serif"
                fontWeight="800"
                fontSize="18px"
                color="white"
                letterSpacing="-0.02em"
              >
                EduFlow
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody px="4" py="6">
            <VStack spacing="1" align="stretch">
              {drawerLinks.map(({ url, label, icon }) => (
                <Link key={url} to={url} onClick={onClose}>
                  <HStack
                    spacing="3"
                    px="3"
                    py="3"
                    borderRadius="10px"
                    color={isActive(url) ? 'white' : 'rgba(255,255,255,0.5)'}
                    bg={isActive(url) ? '#ff5f3a' : 'transparent'}
                    fontFamily="'DM Sans', sans-serif"
                    fontSize="14px"
                    fontWeight={isActive(url) ? '600' : '400'}
                    _hover={{ bg: isActive(url) ? '#ff5f3a' : 'rgba(255,255,255,0.08)', color: 'white' }}
                    transition="all 0.15s"
                    cursor="pointer"
                  >
                    <Box fontSize="15px">{icon}</Box>
                    <Text>{label}</Text>
                  </HStack>
                </Link>
              ))}

              {/* Auth buttons */}
              {!isAuthenticated && (
                <Box pt="6" mt="2" borderTop="1px solid rgba(255,255,255,0.06)">
                  <VStack spacing="2">
                    <Link to="/login" onClick={onClose} style={{ width: '100%' }}>
                      <Button
                        w="full"
                        h="42px"
                        variant="outline"
                        borderColor="rgba(255,255,255,0.15)"
                        color="rgba(255,255,255,0.7)"
                        fontFamily="'Syne', sans-serif"
                        fontWeight="600"
                        fontSize="13px"
                        borderRadius="10px"
                        _hover={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white' }}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={onClose} style={{ width: '100%' }}>
                      <Button
                        w="full"
                        h="42px"
                        bg="#ff5f3a"
                        color="white"
                        fontFamily="'Syne', sans-serif"
                        fontWeight="700"
                        fontSize="13px"
                        borderRadius="10px"
                        _hover={{ bg: '#e04a27' }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </VStack>
                </Box>
              )}

              {isAuthenticated && (
                <Box pt="6" mt="2" borderTop="1px solid rgba(255,255,255,0.06)">
                  <Button
                    w="full"
                    h="42px"
                    variant="ghost"
                    color="red.400"
                    fontFamily="'Syne', sans-serif"
                    fontWeight="600"
                    fontSize="13px"
                    borderRadius="10px"
                    leftIcon={<RiLogoutBoxLine />}
                    justifyContent="flex-start"
                    _hover={{ bg: 'rgba(255,100,100,0.1)' }}
                    onClick={logoutHandler}
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;