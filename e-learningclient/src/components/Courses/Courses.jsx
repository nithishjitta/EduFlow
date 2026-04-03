import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/actions/course';
import toast from 'react-hot-toast';
import { addToPlaylist } from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';
import {
  FaPlay,
  FaEye,
  FaBookOpen,
  FaStar,
  FaShoppingCart,
  FaCheckCircle,
} from 'react-icons/fa';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

export const categories = [
  'Web Development',
  'Data Science',
  'Data Structure & Algorithm',
  'App Development',
  'Game Development',
  'Cybersecurity',
  'Cloud Computing',
  'UI/UX Design',
  'Machine Learning',
  'Blockchain',
];

const categoryColors = {
  'Web Development': { bg: '#eef2ff', color: '#4f46e5' },
  'Data Science': { bg: '#fdf4ff', color: '#9333ea' },
  'Data Structure & Algorithm': { bg: '#f0fdf4', color: '#16a34a' },
  'App Development': { bg: '#fff7ed', color: '#ea580c' },
  'Game Development': { bg: '#fef2f2', color: '#dc2626' },
  Cybersecurity: { bg: '#f0f9ff', color: '#0284c7' },
  'Cloud Computing': { bg: '#f0fdfa', color: '#0d9488' },
  'UI/UX Design': { bg: '#fff1f2', color: '#e11d48' },
  'Machine Learning': { bg: '#faf5ff', color: '#7c3aed' },
  Blockchain: { bg: '#fffbeb', color: '#d97706' },
};

export const COURSE_IMAGES = {
  'Web Development':
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80',
  'Data Science':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  'Data Structure & Algorithm':
    'https://media.geeksforgeeks.org/wp-content/uploads/20250930224354019581/Data-Structures---Algorithms.png',
  'App Development':
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  'Game Development':
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&q=80',
  Cybersecurity:
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
  'Cloud Computing':
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  'UI/UX Design':
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  'Machine Learning':
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  Blockchain:
    'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&q=80',
  default:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
};

const USD_TO_INR = 83;
export const formatINR = usd => {
  const inr = Math.round(usd * USD_TO_INR);
  return '\u20b9' + inr.toLocaleString('en-IN');
};

export const STATIC_COURSES = [
  {
    _id: 'static_1',
    title: 'Complete React & Node.js Fullstack Bootcamp',
    description:
      'Build production-ready web apps with React hooks, Redux, Node.js, Express, and MongoDB.',
    category: 'Web Development',
    price: 9,
    level: 'Intermediate',
    numOfVideos: 42,
    views: 18400,
    rating: 4.9,
    enrolledStudents: 4200,
    duration: 24,
    createdBy: 'Alex Turner',
    poster: { url: COURSE_IMAGES['Web Development'] },
    lastUpdated: '2024-11-01',
  },
  {
    _id: 'static_2',
    title: 'Python for Machine Learning & AI',
    description:
      'Master Python, NumPy, Pandas, Scikit-learn and TensorFlow. Build real ML models from scratch.',
    category: 'Machine Learning',
    price: 8,
    level: 'Beginner',
    numOfVideos: 56,
    views: 22100,
    rating: 4.8,
    enrolledStudents: 6800,
    duration: 32,
    createdBy: 'Priya Sharma',
    poster: { url: COURSE_IMAGES['Machine Learning'] },
    lastUpdated: '2024-10-15',
  },
  {
    _id: 'static_3',
    title: 'Data Structures & Algorithms Masterclass',
    description:
      'Crack coding interviews. Arrays, Trees, Graphs, DP, Sorting, Searching -- everything you need.',
    category: 'Data Structure & Algorithm',
    price: 7,
    level: 'Advanced',
    numOfVideos: 38,
    views: 14300,
    rating: 4.9,
    enrolledStudents: 3100,
    duration: 28,
    createdBy: 'Karan Mehta',
    poster: { url: COURSE_IMAGES['Data Structure & Algorithm'] },
    lastUpdated: '2024-09-20',
  },
  {
    _id: 'static_4',
    title: 'Flutter & Dart: Complete Mobile App Development',
    description:
      'Build beautiful cross-platform iOS and Android apps using Flutter with Firebase.',
    category: 'App Development',
    price: 9,
    level: 'Intermediate',
    numOfVideos: 64,
    views: 10900,
    rating: 4.7,
    enrolledStudents: 2400,
    duration: 35,
    createdBy: 'Neha Patel',
    poster: { url: COURSE_IMAGES['App Development'] },
    lastUpdated: '2024-10-01',
  },
  {
    _id: 'static_5',
    title: 'Unity Game Development: 2D & 3D Games',
    description:
      'Create your own games using Unity and C#. From 2D platformers to 3D action games.',
    category: 'Game Development',
    price: 8,
    level: 'Beginner',
    numOfVideos: 48,
    views: 8700,
    rating: 4.8,
    enrolledStudents: 1900,
    duration: 30,
    createdBy: 'Rohan Das',
    poster: { url: COURSE_IMAGES['Game Development'] },
    lastUpdated: '2024-08-10',
  },
  {
    _id: 'static_6',
    title: 'Data Science with Python & R',
    description:
      'End-to-end data science: EDA, visualization, statistical modeling, and storytelling with data.',
    category: 'Data Science',
    price: 9,
    level: 'Intermediate',
    numOfVideos: 52,
    views: 16500,
    rating: 4.8,
    enrolledStudents: 5400,
    duration: 38,
    createdBy: 'Ananya Roy',
    poster: { url: COURSE_IMAGES['Data Science'] },
    lastUpdated: '2024-11-05',
  },
  {
    _id: 'static_7',
    title: 'Ethical Hacking & Cybersecurity Fundamentals',
    description:
      'Penetration testing, network security, cryptography, and real-world attack defense.',
    category: 'Cybersecurity',
    price: 10,
    level: 'Intermediate',
    numOfVideos: 44,
    views: 12200,
    rating: 4.7,
    enrolledStudents: 2800,
    duration: 26,
    createdBy: 'Vikram Singh',
    poster: { url: COURSE_IMAGES['Cybersecurity'] },
    lastUpdated: '2024-10-20',
  },
  {
    _id: 'static_8',
    title: 'AWS & Cloud Computing: Zero to Professional',
    description:
      'Master AWS services, serverless, containers, CI/CD. Prepare for AWS certifications.',
    category: 'Cloud Computing',
    price: 10,
    level: 'Beginner',
    numOfVideos: 60,
    views: 9800,
    rating: 4.9,
    enrolledStudents: 2100,
    duration: 40,
    createdBy: 'Siddharth Rao',
    poster: { url: COURSE_IMAGES['Cloud Computing'] },
    lastUpdated: '2024-11-10',
  },
  {
    _id: 'static_9',
    title: 'UI/UX Design Masterclass: Figma to Prototype',
    description:
      'Design stunning interfaces. Figma, design systems, user research, wireframes, and prototypes.',
    category: 'UI/UX Design',
    price: 7,
    level: 'Beginner',
    numOfVideos: 36,
    views: 13400,
    rating: 4.8,
    enrolledStudents: 3700,
    duration: 22,
    createdBy: 'Divya Menon',
    poster: { url: COURSE_IMAGES['UI/UX Design'] },
    lastUpdated: '2024-09-15',
  },
  {
    _id: 'static_10',
    title: 'Blockchain Development & Web3 Fundamentals',
    description:
      'Build decentralized applications on Ethereum. Solidity, smart contracts, DeFi, and NFTs.',
    category: 'Blockchain',
    price: 9,
    level: 'Advanced',
    numOfVideos: 40,
    views: 7600,
    rating: 4.6,
    enrolledStudents: 1400,
    duration: 30,
    createdBy: 'Arjun Verma',
    poster: { url: COURSE_IMAGES['Blockchain'] },
    lastUpdated: '2024-10-05',
  },
  {
    _id: 'static_11',
    title: 'Advanced CSS & Modern Animations',
    description:
      'Master CSS Grid, Flexbox, custom properties, keyframe animations and 3D transforms.',
    category: 'Web Development',
    price: 6,
    level: 'Intermediate',
    numOfVideos: 28,
    views: 11200,
    rating: 4.7,
    enrolledStudents: 2900,
    duration: 18,
    createdBy: 'Meera Krishnan',
    poster: {
      url: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*jBuqufyfckQk35w3FPBKkQ.jpeg',
    },
    lastUpdated: '2024-10-25',
  },
  {
    _id: 'static_12',
    title: 'Deep Learning with PyTorch',
    description:
      'Build neural networks, CNNs, RNNs, Transformers, and LLMs from scratch with PyTorch.',
    category: 'Machine Learning',
    price: 10,
    level: 'Advanced',
    numOfVideos: 58,
    views: 9100,
    rating: 4.9,
    enrolledStudents: 1700,
    duration: 44,
    createdBy: 'Dr. Rahul Bose',
    poster: {
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    },
    lastUpdated: '2024-11-12',
  },
  {
    _id: 'static_13',
    title: 'TypeScript for React Developers',
    description:
      'Level up your React apps with TypeScript. Types, interfaces, generics, and advanced patterns.',
    category: 'Web Development',
    price: 8,
    level: 'Intermediate',
    numOfVideos: 32,
    views: 9400,
    rating: 4.8,
    enrolledStudents: 2300,
    duration: 20,
    createdBy: 'Aditya Gupta',
    poster: {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    },
    lastUpdated: '2024-11-08',
  },
  {
    _id: 'static_14',
    title: 'SQL & PostgreSQL: Database Mastery',
    description:
      'From SELECT to advanced window functions, stored procedures, and performance tuning.',
    category: 'Data Science',
    price: 7,
    level: 'Beginner',
    numOfVideos: 34,
    views: 12800,
    rating: 4.7,
    enrolledStudents: 4100,
    duration: 24,
    createdBy: 'Sunita Nair',
    poster: {
      url: 'https://img-c.udemycdn.com/course/480x270/6054699_9f97_2.jpg?w=3840&q=75',
    },
    lastUpdated: '2024-10-12',
  },
  {
    _id: 'static_15',
    title: 'Docker & Kubernetes: DevOps Essentials',
    description:
      'Containerize applications, orchestrate with Kubernetes, and master CI/CD pipelines.',
    category: 'Cloud Computing',
    price: 10,
    level: 'Intermediate',
    numOfVideos: 46,
    views: 8200,
    rating: 4.8,
    enrolledStudents: 1600,
    duration: 32,
    createdBy: 'Ravi Kumar',
    poster: {
      url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    },
    lastUpdated: '2024-11-03',
  },
];

export const Course = ({
  views,
  title,
  imageSrc,
  id,
  addToPlaylistHandler,
  creator,
  description,
  lectureCount,
  loading,
  category,
  rating,
  price,
  level,
  duration,
  enrolledStudents,
  isPurchased,
}) => {
  const catStyle = categoryColors[category] || {
    bg: '#f0f0f8',
    color: '#6b6b8a',
  };
  const safePrice = Math.min(price || 0, 10);
  const courseImage =
    imageSrc || COURSE_IMAGES[category] || COURSE_IMAGES.default;

  const formatNumber = num => {
    if (!num) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  const buyCourseHandler = async () => {
    const { data: keyData } = await axios.get(
      'http://localhost:8080/api/v1/stripekey'
    );

    const stripe = await loadStripe(keyData.key);

    const { data } = await axios.post(
      'http://localhost:8080/api/v1/buy-course',
      {
        title: title,
        price: price,
      },
      { withCredentials: true }
    );

    await stripe.redirectToCheckout({
      sessionId: data.id,
    });
  };
  return (
    <Box
      borderRadius="20px"
      overflow="hidden"
      bg="white"
      border="1px solid"
      borderColor={isPurchased ? 'green.200' : 'gray.100'}
      boxShadow={
        isPurchased
          ? '0 4px 20px rgba(22,163,74,0.08)'
          : '0 4px 20px rgba(0,0,0,0.06)'
      }
      transition="all 0.3s cubic-bezier(0.25,0.8,0.25,1)"
      _hover={{
        transform: 'translateY(-6px)',
        boxShadow: isPurchased
          ? '0 20px 50px rgba(22,163,74,0.15)'
          : '0 20px 50px rgba(124,92,252,0.12)',
        borderColor: isPurchased ? 'green.300' : 'purple.200',
      }}
      position="relative"
    >
      {isPurchased && (
        <Box
          position="absolute"
          top="3"
          right="3"
          zIndex={3}
          bg="green.500"
          color="white"
          px="2"
          py="1"
          borderRadius="8px"
          fontSize="10px"
          fontWeight="700"
          display="flex"
          alignItems="center"
          gap="1"
        >
          <FaCheckCircle size="9px" /> PURCHASED
        </Box>
      )}

      <Box position="relative" overflow="hidden" h="190px">
        <Image
          src={courseImage}
          alt={title}
          h="100%"
          w="100%"
          objectFit="cover"
          transition="transform 0.4s"
          fallbackSrc={COURSE_IMAGES.default}
        />
        <Box
          position="absolute"
          top="3"
          left="3"
          px="3"
          py="1"
          borderRadius="8px"
          fontSize="11px"
          fontWeight="700"
          fontFamily="'Syne', sans-serif"
          bg={catStyle.bg}
          color={catStyle.color}
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          {category || 'Course'}
        </Box>
        {level && !isPurchased && (
          <Box
            position="absolute"
            bottom="3"
            right="3"
            px="2"
            py="1"
            borderRadius="6px"
            fontSize="10px"
            fontWeight="600"
            bg="rgba(0,0,0,0.7)"
            color="white"
          >
            {level}
          </Box>
        )}
      </Box>

      <VStack p="5" align="stretch" spacing="3">
        <Heading
          fontSize="16px"
          fontWeight="700"
          fontFamily="'Syne', sans-serif"
          color="gray.900"
          letterSpacing="-0.01em"
          lineHeight="1.3"
          noOfLines={2}
        >
          {title}
        </Heading>

        <Text color="gray.500" fontSize="13px" noOfLines={2} lineHeight="1.6">
          {description}
        </Text>

        <HStack justify="space-between" align="center">
          <HStack spacing="1">
            <Icon as={FaStar} color="yellow.400" boxSize="12px" />
            <Text fontSize="12px" color="gray.700" fontWeight="600">
              {rating?.toFixed(1) || 'N/A'}
            </Text>
            <Text fontSize="12px" color="gray.500">
              ({formatNumber(enrolledStudents || 0)})
            </Text>
          </HStack>
          {duration && (
            <Text fontSize="12px" color="gray.500">
              {duration}h
            </Text>
          )}
        </HStack>

        <Text fontSize="12px" color="gray.500" fontWeight="500">
          by{' '}
          <Box as="span" color="gray.700" fontWeight="600">
            {creator}
          </Box>
        </Text>

        <HStack justify="space-between" pt="1" pb="1">
          <HStack spacing="1" color="gray.500">
            <Icon as={FaBookOpen} boxSize="12px" />
            <Text fontSize="12px">{lectureCount} Lectures</Text>
          </HStack>
          <HStack spacing="1" color="gray.500">
            <Icon as={FaEye} boxSize="12px" />
            <Text fontSize="12px">{formatNumber(views)} Views</Text>
          </HStack>
        </HStack>

        <HStack justify="space-between" align="center" pt="2">
          <VStack align="start" spacing="0">
            {isPurchased ? (
              <Text fontSize="16px" fontWeight="800" color="green.600">
                ✓ Owned
              </Text>
            ) : (
              <>
                <Text fontSize="20px" fontWeight="800" color="gray.900">
                  ${safePrice}
                </Text>
                <Text fontSize="12px" color="purple.600" fontWeight="700">
                  {formatINR(safePrice)}
                </Text>
              </>
            )}
          </VStack>
          {!isPurchased && (
            <Badge
              colorScheme="green"
              borderRadius="6px"
              fontSize="10px"
              px="2"
              py="1"
            >
              Best Value
            </Badge>
          )}
        </HStack>

        <HStack
          pt="3"
          mt="1"
          borderTop="1px solid"
          borderColor="gray.100"
          spacing="2"
        >
          {isPurchased ? (
            <Link to={`/course/${id}`} style={{ flex: 1 }}>
              <Button
                w="full"
                h="38px"
                bg="#16a34a"
                color="white"
                fontFamily="'Syne', sans-serif"
                fontWeight="700"
                fontSize="12px"
                borderRadius="10px"
                leftIcon={<FaPlay size="10px" />}
              >
                Continue Learning
              </Button>
            </Link>
          ) : (
            <Button
              w="full"
              h="38px"
              bg="#0a0a1e"
              color="white"
              fontFamily="'Syne', sans-serif"
              fontWeight="700"
              fontSize="12px"
              borderRadius="10px"
              leftIcon={<FaShoppingCart size="10px" />}
              onClick={buyCourseHandler}
            >
              Buy Now
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

const Courses = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToPlaylistHandler = async courseId => {
    await dispatch(addToPlaylist(courseId));
    dispatch(loadUser());
    toast.success('Course added to your profile!');
    navigate('/profile');
  };

  const {
    loading,
    courses: apiCourses,
    error,
    message,
  } = useSelector(state => state.course);
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllCourses(category, keyword));
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [category, keyword, dispatch, error, message]);

  const allCourses = [
    ...STATIC_COURSES,
    ...(apiCourses || []).map(c => ({
      ...c,
      price: Math.min(c.price || 0, 10),
    })),
  ];

  const filteredCourses = allCourses.filter(c => {
    const matchCat = !category || c.category === category;
    const matchKw =
      !keyword ||
      c.title.toLowerCase().includes(keyword.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(keyword.toLowerCase());
    return matchCat && matchKw;
  });

  const purchasedIds = new Set((user?.playlist || []).map(p => p.course));

  return (
    <Box bg="#f7f7f9" minH="95vh">
      <Box
        bg="#0a0a1e"
        py="16"
        px="8"
        textAlign="center"
        position="relative"
        overflow="hidden"
        _after={{
          content: '""',
          position: 'absolute',
          w: '600px',
          h: '600px',
          background:
            'radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)',
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <Box
          display="inline-flex"
          alignItems="center"
          gap="2"
          px="4"
          py="2"
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="full"
          fontSize="12px"
          color="whiteAlpha.700"
          fontWeight="600"
          mb="5"
          letterSpacing="0.06em"
          textTransform="uppercase"
        >
          🎓 &nbsp;All Courses Under $10 — No Subscription Needed
        </Box>
        <Heading
          fontFamily="'Syne', sans-serif"
          fontSize={['3xl', '5xl']}
          fontWeight="800"
          color="white"
          letterSpacing="-0.03em"
          mb="4"
        >
          Explore Our{' '}
          <Box as="span" color="#ff5f3a">
            Courses
          </Box>
        </Heading>
        <Text
          fontSize={['sm', 'md']}
          color="whiteAlpha.600"
          maxW="lg"
          mx="auto"
        >
          Expert-led courses priced at $10 or less. Buy once, learn forever.
        </Text>
        <HStack justify="center" spacing="8" mt="6" flexWrap="wrap">
          {[
            { val: '$10', label: 'Max Price' },
            { val: '₹830', label: 'In Rupees' },
            { val: '15+', label: 'Courses' },
          ].map((s, i) => (
            <Box key={i} textAlign="center">
              <Text
                fontFamily="'Syne', sans-serif"
                fontSize="24px"
                fontWeight="800"
                color="white"
              >
                {s.val}
              </Text>
              <Text
                fontSize="11px"
                color="whiteAlpha.500"
                textTransform="uppercase"
                letterSpacing="0.06em"
              >
                {s.label}
              </Text>
            </Box>
          ))}
        </HStack>
      </Box>

      <Container maxW="container.xl" py="10">
        <Box mb="6">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Search courses, topics, instructors..."
            style={{
              width: '100%',
              height: '52px',
              padding: '0 16px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '15px',
              background: 'white',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </Box>

        <Box
          display="flex"
          overflowX="auto"
          gap="8px"
          pb="24px"
          flexWrap="nowrap"
          style={{ scrollbarWidth: 'thin' }}
        >
          {['All Categories', ...categories].map(item => (
            <button
              key={item}
              onClick={() => setCategory(item === 'All Categories' ? '' : item)}
              style={{
                height: '36px',
                padding: '0 20px',
                borderRadius: '999px',
                fontFamily: "'Syne', sans-serif",
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
                background: (
                  item === 'All Categories'
                    ? category === ''
                    : category === item
                )
                  ? '#0a0a1e'
                  : 'white',
                color: (
                  item === 'All Categories'
                    ? category === ''
                    : category === item
                )
                  ? 'white'
                  : '#4a5568',
                border: `1.5px solid ${(item === 'All Categories' ? category === '' : category === item) ? '#0a0a1e' : '#e2e8f0'}`,
              }}
            >
              {item}
            </button>
          ))}
        </Box>

        {filteredCourses.length > 0 && (
          <Text fontSize="13px" color="gray.500" mb="5" fontWeight="500">
            Showing{' '}
            <Box as="span" color="gray.800" fontWeight="700">
              {filteredCourses.length}
            </Box>{' '}
            courses
            {category && (
              <>
                {' '}
                in{' '}
                <Box as="span" color="#7c5cfc" fontWeight="700">
                  {category}
                </Box>
              </>
            )}
          </Text>
        )}

        {filteredCourses.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
            gap="6"
          >
            {filteredCourses.map((item, index) => (
              <Course
                key={item._id || index}
                title={item.title}
                description={item.description}
                views={item.views}
                imageSrc={
                  item.poster?.url ||
                  COURSE_IMAGES[item.category] ||
                  COURSE_IMAGES.default
                }
                id={item._id}
                creator={item.createdBy}
                lectureCount={item.numOfVideos}
                addToPlaylistHandler={addToPlaylistHandler}
                loading={loading}
                category={item.category}
                rating={item.rating}
                price={Math.min(item.price || 0, 10)}
                level={item.level}
                duration={item.duration}
                enrolledStudents={item.enrolledStudents}
                isPurchased={purchasedIds.has(item._id)}
              />
            ))}
          </Box>
        ) : (
          <Box textAlign="center" py="24">
            <Box fontSize="48px" mb="4">
              🔍
            </Box>
            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize="xl"
              color="gray.600"
              mb="2"
            >
              No Courses Found
            </Heading>
            <Text color="gray.400" fontSize="14px">
              Try adjusting your search or category filter.
            </Text>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Courses;
