import {
  Box, Button, Container, Heading, Text, Badge, Flex,
  HStack, VStack, Progress, Icon,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToPlaylist } from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';
import { Course, STATIC_COURSES, COURSE_IMAGES } from './Courses';
import { FiTarget, FiClock, FiAward, FiBriefcase, FiStar, FiRefreshCw } from 'react-icons/fi';

// ─── Survey Questions ───────────────────────────────────────────────────────
const SURVEY = [
  {
    id: 'goal',
    icon: FiTarget,
    question: 'What is your main learning goal?',
    subtitle: 'Help us understand what you want to achieve',
    options: [
      { label: 'Get a new job in tech', value: 'job', emoji: '💼' },
      { label: 'Build my own product', value: 'product', emoji: '🚀' },
      { label: 'Upskill at my current job', value: 'upskill', emoji: '📈' },
      { label: 'Just exploring & curious', value: 'explore', emoji: '🔭' },
    ],
  },
  {
    id: 'domain',
    icon: FiBriefcase,
    question: 'Which domain interests you most?',
    subtitle: 'You can always explore others later',
    options: [
      { label: 'Web Development', value: 'Web Development', emoji: '🌐' },
      { label: 'Data Science / AI', value: 'Data Science', emoji: '📊' },
      { label: 'Mobile Apps', value: 'App Development', emoji: '📱' },
      { label: 'Design & Creativity', value: 'UI/UX Design', emoji: '🎨' },
      { label: 'Security & Cloud', value: 'Cybersecurity', emoji: '🔒' },
      { label: 'Machine Learning', value: 'Machine Learning', emoji: '🤖' },
    ],
  },
  {
    id: 'level',
    icon: FiAward,
    question: 'What is your current experience level?',
    subtitle: "Be honest — it helps us match the right difficulty",
    options: [
      { label: 'Total Beginner', value: 'Beginner', emoji: '🌱' },
      { label: 'Some Basics', value: 'Basics', emoji: '📖' },
      { label: 'Intermediate', value: 'Intermediate', emoji: '⚡' },
      { label: 'Advanced', value: 'Advanced', emoji: '🔥' },
    ],
  },
  {
    id: 'time',
    icon: FiClock,
    question: 'How much time can you dedicate per week?',
    subtitle: 'We will suggest course lengths accordingly',
    options: [
      { label: 'Less than 3 hours', value: 'short', emoji: '⏱️' },
      { label: '3–7 hours', value: 'medium', emoji: '🕐' },
      { label: '7–15 hours', value: 'long', emoji: '🕑' },
      { label: '15+ hours (intensive)', value: 'intensive', emoji: '💪' },
    ],
  },
  {
    id: 'style',
    icon: FiStar,
    question: 'How do you prefer to learn?',
    subtitle: 'Different people learn differently',
    options: [
      { label: 'Project-based learning', value: 'project', emoji: '🛠️' },
      { label: 'Theory first then practice', value: 'theory', emoji: '📚' },
      { label: 'Short bite-sized lessons', value: 'bite', emoji: '🍕' },
      { label: 'Comprehensive deep dives', value: 'deep', emoji: '🔬' },
    ],
  },
];

// ─── Recommendation Engine ─────────────────────────────────────────────────
function getRecommendations(answers) {
  const { domain, level, time, goal, style } = answers;

  let scored = STATIC_COURSES.map(course => {
    let score = 0;

    // Domain match (highest weight)
    if (domain && course.category === domain) score += 40;
    if (domain === 'Data Science' && course.category === 'Machine Learning') score += 20;
    if (domain === 'Machine Learning' && course.category === 'Data Science') score += 15;
    if (domain === 'Cybersecurity' && course.category === 'Cloud Computing') score += 10;

    // Level match
    if (level === 'Beginner' && course.level === 'Beginner') score += 20;
    if (level === 'Basics' && ['Beginner', 'Intermediate'].includes(course.level)) score += 15;
    if (level === 'Intermediate' && course.level === 'Intermediate') score += 20;
    if (level === 'Advanced' && course.level === 'Advanced') score += 20;

    // Time match
    if (time === 'short' && course.duration <= 20) score += 15;
    if (time === 'medium' && course.duration >= 20 && course.duration <= 32) score += 15;
    if (time === 'long' && course.duration >= 25 && course.duration <= 40) score += 15;
    if (time === 'intensive' && course.duration >= 35) score += 15;

    // Goal-based bonuses
    if (goal === 'job' && ['Web Development', 'Data Science', 'Machine Learning', 'Cybersecurity'].includes(course.category)) score += 10;
    if (goal === 'product' && ['Web Development', 'App Development', 'Blockchain'].includes(course.category)) score += 10;
    if (goal === 'upskill' && course.level !== 'Beginner') score += 8;
    if (goal === 'explore') score += 5; // slight boost to all

    // Style bonus
    if (style === 'project' && course.numOfVideos > 40) score += 8;
    if (style === 'bite' && course.duration <= 22) score += 8;
    if (style === 'deep' && course.duration >= 35) score += 8;

    // Rating bonus
    score += (course.rating || 0) * 2;

    return { ...course, _score: score };
  });

  // Sort by score desc, take top 6
  return scored.sort((a, b) => b._score - a._score).slice(0, 6);
}

// ─── Survey Component ──────────────────────────────────────────────────────
const SurveyScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const q = SURVEY[step];
  const progress = ((step) / SURVEY.length) * 100;

  const handleSelect = (value) => {
    if (animating) return;
    setSelected(value);
    setAnswers(prev => ({ ...prev, [q.id]: value }));

    setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        if (step < SURVEY.length - 1) {
          setStep(s => s + 1);
          setSelected(null);
          setAnimating(false);
        } else {
          onComplete({ ...answers, [q.id]: value });
        }
      }, 300);
    }, 250);
  };

  return (
    <Box minH="95vh" bg="#0a0a1e" display="flex" flexDirection="column" alignItems="center" justifyContent="center" px="4" py="12">
      {/* Background blobs */}
      <Box position="absolute" top="10%" left="10%" w="400px" h="400px" borderRadius="full"
        bg="radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)" pointerEvents="none" />
      <Box position="absolute" bottom="10%" right="10%" w="300px" h="300px" borderRadius="full"
        bg="radial-gradient(circle, rgba(0,201,167,0.1) 0%, transparent 70%)" pointerEvents="none" />

      <Box w="full" maxW="600px" position="relative" zIndex={2}>
        {/* Header */}
        <VStack spacing="3" mb="8" textAlign="center">
          <Box px="4" py="2" bg="rgba(124,92,252,0.15)" border="1px solid rgba(124,92,252,0.3)"
            borderRadius="full" fontSize="12px" color="rgba(255,255,255,0.7)"
            fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
          >
            ✨ AI Course Matcher · Step {step + 1} of {SURVEY.length}
          </Box>
          <Box w="full" bg="rgba(255,255,255,0.1)" borderRadius="full" h="4px">
            <Box h="full" borderRadius="full" bg="linear-gradient(90deg, #7c5cfc, #00c9a7)"
              style={{ width: `${progress + (100 / SURVEY.length)}%`, transition: 'width 0.5s ease' }}
            />
          </Box>
        </VStack>

        {/* Question card */}
        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.1)"
          borderRadius="24px" p={['6', '10']}
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(-10px)' : 'translateY(0)', transition: 'all 0.3s ease' }}
        >
          <VStack spacing="2" mb="8" textAlign="center">
            <Box w="52px" h="52px" bg="rgba(124,92,252,0.15)" border="1px solid rgba(124,92,252,0.3)"
              borderRadius="16px" display="flex" alignItems="center" justifyContent="center" mb="2"
            >
              <Icon as={q.icon} color="#7c5cfc" boxSize="24px" />
            </Box>
            <Heading fontFamily="'Syne', sans-serif" fontSize={['xl', '2xl']} fontWeight="800"
              color="white" letterSpacing="-0.02em" lineHeight="1.2"
            >
              {q.question}
            </Heading>
            <Text fontSize="14px" color="rgba(255,255,255,0.5)">{q.subtitle}</Text>
          </VStack>

          <Box display="grid" gridTemplateColumns={q.options.length > 4 ? ['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)'] : ['1fr', 'repeat(2, 1fr)']} gap="3">
            {q.options.map(opt => (
              <Box
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                cursor="pointer"
                bg={selected === opt.value ? 'rgba(124,92,252,0.3)' : 'rgba(255,255,255,0.05)'}
                border="1.5px solid"
                borderColor={selected === opt.value ? '#7c5cfc' : 'rgba(255,255,255,0.12)'}
                borderRadius="16px"
                p="5"
                display="flex"
                alignItems="center"
                gap="3"
                transition="all 0.2s"
                _hover={{
                  bg: 'rgba(124,92,252,0.2)',
                  borderColor: 'rgba(124,92,252,0.6)',
                  transform: 'translateY(-2px)',
                }}
                style={{ transform: selected === opt.value ? 'scale(0.98)' : 'scale(1)' }}
              >
                <Box fontSize="22px" flexShrink={0}>{opt.emoji}</Box>
                <Text fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="14px"
                  color={selected === opt.value ? 'white' : 'rgba(255,255,255,0.8)'} lineHeight="1.3"
                >
                  {opt.label}
                </Text>
                {selected === opt.value && (
                  <Box ml="auto" w="18px" h="18px" borderRadius="full" bg="#7c5cfc"
                    display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <Text fontSize="10px" color="white" fontWeight="900">✓</Text>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Skip */}
        {step > 0 && (
          <Box textAlign="center" mt="5">
            <Button variant="ghost" color="rgba(255,255,255,0.3)" fontSize="13px"
              _hover={{ color: 'rgba(255,255,255,0.6)' }}
              onClick={() => {
                if (step < SURVEY.length - 1) { setStep(s => s + 1); setSelected(null); }
                else onComplete(answers);
              }}
            >
              Skip this question →
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
const RecommendedCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const { loading } = useSelector(state => state.profile);

  const [phase, setPhase] = useState('survey'); // 'survey' | 'generating' | 'results'
  const [recommendations, setRecommendations] = useState([]);
  const [surveyAnswers, setSurveyAnswers] = useState(null);

  const addToPlaylistHandler = async (courseId) => {
    await dispatch(addToPlaylist(courseId));
    dispatch(loadUser());
    toast.success('Course added to your profile!');
    navigate('/profile');
  };

  const handleSurveyComplete = (answers) => {
    setSurveyAnswers(answers);
    setPhase('generating');

    // Simulate AI thinking delay
    setTimeout(() => {
      const recs = getRecommendations(answers);
      setRecommendations(recs);
      setPhase('results');
    }, 2200);
  };

  const purchasedIds = new Set((user?.playlist || []).map(p => p.course));

  // ── Generating screen ────────────────────────────────────────────────────
  if (phase === 'generating') {
    return (
      <Box minH="95vh" bg="#0a0a1e" display="flex" alignItems="center" justifyContent="center" px="4">
        <Box position="absolute" top="20%" left="50%" transform="translateX(-50%)" w="500px" h="500px"
          borderRadius="full" bg="radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)" pointerEvents="none"
        />
        <VStack spacing="6" textAlign="center" position="relative" zIndex={2}>
          <Box position="relative" w="80px" h="80px">
            <Box w="80px" h="80px" borderRadius="full" border="3px solid rgba(124,92,252,0.3)"
              style={{ animation: 'spin 1.5s linear infinite' }}
            />
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)"
              fontSize="28px"
            >
              🤖
            </Box>
          </Box>
          <VStack spacing="2">
            <Heading fontFamily="'Syne', sans-serif" fontSize="2xl" fontWeight="800" color="white">
              Analyzing your profile...
            </Heading>
            <Text color="rgba(255,255,255,0.5)" fontSize="14px">
              Our AI is matching courses to your goals, level & learning style
            </Text>
          </VStack>
          {[
            '🎯 Mapping your goals',
            '📊 Scoring 15+ courses',
            '✨ Personalizing recommendations',
          ].map((msg, i) => (
            <Box key={i} px="5" py="3" bg="rgba(255,255,255,0.06)" border="1px solid rgba(255,255,255,0.1)"
              borderRadius="12px" minW="260px"
              style={{ animation: `fadeIn 0.5s ease ${i * 0.6}s both` }}
            >
              <Text color="rgba(255,255,255,0.7)" fontSize="13px" fontWeight="500">{msg}</Text>
            </Box>
          ))}
        </VStack>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </Box>
    );
  }

  // ── Survey ────────────────────────────────────────────────────────────────
  if (phase === 'survey') {
    return <SurveyScreen onComplete={handleSurveyComplete} />;
  }

  // ── Results ───────────────────────────────────────────────────────────────
  const domainLabel = surveyAnswers?.domain || 'All topics';
  const levelLabel = surveyAnswers?.level || 'All levels';

  return (
    <Box bg="#f7f7f9" minH="95vh">
      {/* Hero */}
      <Box bg="linear-gradient(135deg, #0a0a1e 0%, #1a1a3e 100%)" py="16" px="8"
        textAlign="center" position="relative" overflow="hidden"
        _after={{
          content: '""', position: 'absolute', w: '500px', h: '500px',
          background: 'radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)',
          top: '-150px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }}
      >
        <Box display="inline-flex" alignItems="center" gap="2" px="4" py="2"
          bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200"
          borderRadius="full" fontSize="12px" color="whiteAlpha.700"
          fontWeight="600" mb="4" letterSpacing="0.06em" textTransform="uppercase"
        >
          ✨ AI-Personalized Just For You
        </Box>
        <Heading fontFamily="'Syne', sans-serif" fontSize={['3xl', '4xl', '5xl']} fontWeight="800"
          color="white" letterSpacing="-0.03em" mb="3" lineHeight="1.2"
        >
          Your{' '}
          <Box as="span" bgGradient="linear(to-r, #00c9a7, #00d9ff)" bgClip="text">
            Perfect Courses
          </Box>
        </Heading>
        <Text fontSize={['sm', 'md']} color="whiteAlpha.600" maxW="2xl" mx="auto" lineHeight="1.6">
          Based on your answers — {domainLabel} · {levelLabel}
        </Text>

        {/* Survey Summary Pills */}
        {surveyAnswers && (
          <Flex justify="center" gap="2" mt="5" flexWrap="wrap">
            {Object.entries(surveyAnswers).map(([key, val]) => (
              <Box key={key} px="3" py="1.5" bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.15)"
                borderRadius="full" fontSize="12px" color="rgba(255,255,255,0.8)" fontWeight="600"
              >
                {val}
              </Box>
            ))}
          </Flex>
        )}
      </Box>

      <Container maxW="container.xl" py="12">
        {/* Stats bar */}
        <Flex justify="space-between" align="center" mb="8" pb="6"
          borderBottom="1px solid" borderColor="gray.200" flexWrap="wrap" gap="4"
        >
          <Box>
            <Text fontSize="13px" color="gray.500" fontWeight="500">
              Showing <Box as="span" color="gray.800" fontWeight="700">{recommendations.length}</Box> AI-matched courses
            </Text>
          </Box>
          <HStack spacing="3">
            <Badge colorScheme="purple" variant="subtle" px="3" py="1" borderRadius="full" fontSize="11px">
              🤖 AI-Matched
            </Badge>
            <Button
              leftIcon={<FiRefreshCw size="13px" />}
              size="sm" variant="outline" borderColor="gray.200" borderRadius="8px"
              fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="12px"
              _hover={{ borderColor: '#7c5cfc', color: '#7c5cfc' }}
              onClick={() => setPhase('survey')}
            >
              Retake Survey
            </Button>
          </HStack>
        </Flex>

        {/* Courses Grid */}
        <Box display="grid" gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap="6" mb="12">
          {recommendations.map((course, index) => (
            <Box key={course._id || index} style={{ animationDelay: `${index * 0.08}s`, animation: 'fadeSlideIn 0.5s ease both' }}>
              <Course
                title={course.title}
                description={course.description}
                views={course.views}
                imageSrc={course.poster?.url || COURSE_IMAGES[course.category]}
                id={course._id}
                creator={course.createdBy}
                lectureCount={course.numOfVideos}
                addToPlaylistHandler={addToPlaylistHandler}
                loading={loading}
                category={course.category}
                rating={course.rating}
                price={Math.min(course.price || 0, 10)}
                level={course.level}
                duration={course.duration}
                enrolledStudents={course.enrolledStudents}
                isPurchased={purchasedIds.has(course._id)}
              />
            </Box>
          ))}
        </Box>

        <Box textAlign="center" py="8">
          <Text color="gray.600" mb="4" fontSize="sm">Want to explore everything?</Text>
          <Button h="46px" px="8" bg="#0a0a1e" color="white" fontFamily="'Syne', sans-serif"
            fontWeight="700" fontSize="14px" borderRadius="12px"
            _hover={{ bg: '#1a1a2e', transform: 'translateY(-2px)' }}
            onClick={() => navigate('/courses')}
          >
            Browse All Courses →
          </Button>
        </Box>
      </Container>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default RecommendedCourses;
