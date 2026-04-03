import {
  Box,
  Grid,
  Heading,
  HStack,
  Progress,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri';
import Sidebar from '../Users/Sidebar';
import { DoughnutChart, LineChart } from './Chart';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../../../redux/actions/admin';
import Loader from '../../Layout/Loader/Loader';

const accentColors = ['#7c5cfc', '#00c9a7', '#ff5f3a'];

const Databox = ({ title, qty, qtyPercentage, profit, accent }) => (
  <Box
    flex="1"
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="20px"
    p="6"
    position="relative"
    overflow="hidden"
    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    _after={{
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      h: '3px',
      bg: accent,
      borderRadius: '20px 20px 0 0',
    }}
  >
    <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="4">
      {title}
    </Text>

    <Text fontFamily="'Syne', sans-serif" fontSize="40px" fontWeight="800" color="gray.900" lineHeight="1" letterSpacing="-0.03em" mb="3">
      {qty}
    </Text>

    <HStack spacing="1">
      {profit ? (
        <RiArrowUpLine color="#00c9a7" size="14px" />
      ) : (
        <RiArrowDownLine color="#ff5f3a" size="14px" />
      )}
      <Text fontSize="13px" fontWeight="600" color={profit ? '#00c9a7' : '#ff5f3a'}>
        {qtyPercentage}%
      </Text>
      <Text fontSize="12px" color="gray.400">vs last month</Text>
    </HStack>
  </Box>
);

const Bar = ({ title, value, profit }) => (
  <Box
    py="4"
    px="6"
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="14px"
    mb="3"
  >
    <HStack justify="space-between" mb="3">
      <Text fontSize="13px" fontWeight="600" color="gray.700" fontFamily="'Syne', sans-serif">
        {title}
      </Text>
      <Text
        fontSize="13px"
        fontWeight="700"
        color={profit ? '#00c9a7' : '#ff5f3a'}
        fontFamily="'Syne', sans-serif"
      >
        {profit ? `+${value}%` : `-${value}%`}
      </Text>
    </HStack>
    <Progress
      value={value}
      h="6px"
      borderRadius="full"
      bg="gray.100"
      sx={{
        '& > div': {
          background: profit
            ? 'linear-gradient(90deg, #00c9a7, #00a896)'
            : 'linear-gradient(90deg, #ff5f3a, #e04a27)',
          borderRadius: 'full',
        },
      }}
    />
  </Box>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    loading,
    stats,
    viewsCount,
    subscriptionCount,
    usersCount,
    subscriptionPercentage,
    viewsPercentage,
    usersPercentage,
    subscriptionProfit,
    viewsProfit,
    usersProfit,
  } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <Grid
      minH="100vh"
      templateColumns={['1fr', '1fr', '1fr 220px']}
      bg="#f7f7f9"
    >
      {loading || !stats ? (
        <Loader />
      ) : (
        <Box py="10" px={['4', '8', '10']}>
          {/* Header */}
          <HStack justify="space-between" mb="8" align="flex-start">
            <Box>
              <Heading
                fontFamily="'Syne', sans-serif"
                fontSize={['2xl', '3xl']}
                fontWeight="800"
                color="gray.900"
                letterSpacing="-0.03em"
              >
                Dashboard
              </Heading>
              <Text fontSize="13px" color="gray.400" mt="1">
                Last updated:{' '}
                {String(new Date(stats[11].createdAt)).split('G')[0]}
              </Text>
            </Box>
          </HStack>

          {/* Stat Cards */}
          <Stack direction={['column', 'row']} spacing="4" mb="8">
            <Databox title="Total Views" qty={viewsCount} qtyPercentage={viewsPercentage} profit={viewsProfit} accent={accentColors[0]} />
            <Databox title="Users" qty={usersCount} qtyPercentage={usersPercentage} profit={usersProfit} accent={accentColors[1]} />
            <Databox title="Subscriptions" qty={subscriptionCount} qtyPercentage={subscriptionPercentage} profit={subscriptionProfit} accent={accentColors[2]} />
          </Stack>

          {/* Charts Row */}
          <Grid templateColumns={['1fr', '1fr', '3fr 2fr']} gap="6" mb="6">
            {/* Line chart */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="20px"
              p="6"
              boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            >
              <HStack justify="space-between" mb="4">
                <Heading fontFamily="'Syne', sans-serif" fontSize="16px" fontWeight="700" color="gray.800" letterSpacing="-0.01em">
                  Monthly Views
                </Heading>
                <Box px="3" py="1" bg="#eef2ff" borderRadius="8px">
                  <Text fontSize="11px" fontWeight="700" color="#4f46e5" textTransform="uppercase" letterSpacing="0.06em">
                    Last 12 months
                  </Text>
                </Box>
              </HStack>
              <LineChart views={stats.map(item => item.views)} />
            </Box>

            {/* Doughnut */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="20px"
              p="6"
              boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            >
              <Heading fontFamily="'Syne', sans-serif" fontSize="16px" fontWeight="700" color="gray.800" letterSpacing="-0.01em" mb="4">
                User Distribution
              </Heading>
              <DoughnutChart users={[subscriptionCount, usersCount - subscriptionCount]} />
              <HStack justify="center" mt="4" spacing="6">
                <HStack>
                  <Box w="10px" h="10px" borderRadius="3px" bg="rgba(62,12,171,0.6)" />
                  <Text fontSize="12px" color="gray.500">Subscribed</Text>
                </HStack>
                <HStack>
                  <Box w="10px" h="10px" borderRadius="3px" bg="rgba(214,43,129,0.6)" />
                  <Text fontSize="12px" color="gray.500">Free</Text>
                </HStack>
              </HStack>
            </Box>
          </Grid>

          {/* Progress bars */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="20px"
            p="6"
            boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          >
            <Heading fontFamily="'Syne', sans-serif" fontSize="16px" fontWeight="700" color="gray.800" letterSpacing="-0.01em" mb="5">
              Growth Metrics
            </Heading>
            <Bar profit={viewsProfit} title="Views" value={viewsPercentage} />
            <Bar profit={usersProfit} title="Users" value={usersPercentage} />
            <Bar profit={subscriptionProfit} title="Subscriptions" value={subscriptionPercentage} />
          </Box>
        </Box>
      )}

      <Sidebar />
    </Grid>
  );
};

export default Dashboard;