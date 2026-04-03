import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Heading, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CgGoogle, CgYoutube } from 'react-icons/cg';
import { SiCoursera, SiUdemy } from 'react-icons/si';
import { DiAws } from 'react-icons/di';
import vg from '../../assets/images/bg.png';
import introVideo from '../../assets/videos/intro.mp4';
import './home.css';

const brands = [
  { Icon: CgGoogle,   color: '#4285F4', label: 'Google'   },
  { Icon: CgYoutube,  color: '#FF0000', label: 'YouTube'  },
  { Icon: SiCoursera, color: '#0056D2', label: 'Coursera' },
  { Icon: SiUdemy,    color: '#A435F0', label: 'Udemy'    },
  { Icon: DiAws,      color: '#FF9900', label: 'AWS'      },
];

const courses = [
  { cat: 'Web Dev',      title: 'React & Node.js Fullstack',    students: '4.2k', rating: '4.9', color: '#7c5cfc', emoji: '⚛️', price: '$9', inr: '₹747', duration: '24h', level: 'Intermediate' },
  { cat: 'Data Science', title: 'Python for ML & AI',           students: '6.8k', rating: '4.8', color: '#00c9a7', emoji: '📊', price: '$8', inr: '₹664', duration: '32h', level: 'Beginner' },
  { cat: 'DSA',          title: 'Data Structures & Algorithms', students: '3.1k', rating: '4.9', color: '#ff5f3a', emoji: '🧩', price: '$7', inr: '₹581', duration: '28h', level: 'Advanced' },
  { cat: 'App Dev',      title: 'Flutter Mobile Development',   students: '2.4k', rating: '4.7', color: '#f5b800', emoji: '📱', price: '$9', inr: '₹747', duration: '35h', level: 'Intermediate' },
];

const features = [
  { icon: '🎥', title: 'HD Video Lectures',    desc: 'Crystal-clear recordings from industry veterans' },
  { icon: '📜', title: 'Verified Certificates', desc: 'Credentials employers actually recognise'       },
  { icon: '⚡', title: 'Self-Paced',            desc: 'No deadlines — rewatch anytime, forever'        },
  { icon: '🌍', title: 'Global Community',      desc: '12,000+ learners from 80+ countries'            },
];

const testimonials = [
  { name: 'Priya K.',  role: 'SWE @ Google',    quote: "Got my dream job 3 months after completing the fullstack bootcamp. The course quality is unreal.", av: 'PK', g: '#7c5cfc,#ff5f3a' },
  { name: 'Arjun M.',  role: 'Data Scientist',   quote: "The ML course is hands-down the best I've found anywhere online. Worth every rupee.",             av: 'AM', g: '#00c9a7,#4f46e5' },
  { name: 'Sana R.',   role: 'Product Manager',  quote: "Completed 4 courses in 2 months. The instructors are incredible and the community is supportive.", av: 'SR', g: '#f5b800,#ff5f3a' },
];

const Counter = ({ end, suffix = '' }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.max(1, Math.ceil(parseInt(end) / 55));
    const t = setInterval(() => {
      v += step;
      if (v >= parseInt(end)) { setN(parseInt(end)); clearInterval(t); }
      else setN(v);
    }, 18);
    return () => clearInterval(t);
  }, [end]);
  return <>{n}{suffix}</>;
};

/* ── helpers ── */
// Build a per-user streak from their joined date (days since joining, capped at 30)
const getStreakDays = (createdAt) => {
  if (!createdAt) return null;
  const days = Math.floor((Date.now() - new Date(createdAt)) / 86400000);
  return Math.min(days, 30);
};

// Pick the most recent playlist item as "Now Learning"
const getLatestPlaylistItem = (playlist) => {
  if (!playlist || playlist.length === 0) return null;
  return playlist[playlist.length - 1]; // last added = most recent
};

export default function Home() {
  const [vidIn, setVidIn] = useState(false);
  const vidRef = useRef();

  // ── Real user data from Redux ──
  const { user, isAuthenticated } = useSelector(state => state.user);

  const streak        = isAuthenticated ? getStreakDays(user?.createdAt) : null;
  const latestItem    = isAuthenticated ? getLatestPlaylistItem(user?.playlist) : null;
  const playlistCount = user?.playlist?.length || 0;

  // Playlist progress — we don't have per-lecture progress in this app,
  // so we show how many courses are saved as a proxy
  const playlistProgress = Math.min(playlistCount * 10, 100); // 10% per saved course, max 100%

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVidIn(true); },
      { threshold: 0.15 }
    );
    if (vidRef.current) io.observe(vidRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <Box className="hr" overflow="hidden">

      {/* ══════════════════════════
          HERO
      ══════════════════════════ */}
      <Box className="h-wrap" minH="100vh" display="flex" flexDir="column"
        justifyContent="center" position="relative">
        <Box className="h-noise" />
        <Box className="h-blob1" />
        <Box className="h-blob2" />
        <Box className="h-blob3" />
        <Box className="h-grid" />

        <Container maxW="1300px" px={['5','8','12']} pt={['28','32']} pb={['16','20']}
          position="relative" zIndex={3}>
          <Stack direction={['column','column','row']} align="center"
            justify="space-between" spacing={['12','16']}>

            {/* ── Left ── */}
            <VStack align={['center','center','flex-start']} spacing="8" flex="1"
              maxW={['100%','100%','580px']} className="h-left">

              <Box className="h-pill">
                <span className="h-pill-dot" />
                <span>New courses added every week</span>
              </Box>

              <Box textAlign={['center','center','left']}>
                <Box className="h-title-line h-tl1">Learn</Box>
                <Box className="h-title-line h-tl2">Without</Box>
                <Box className="h-title-line h-tl3">Limits<span className="h-dot">.</span></Box>
              </Box>

              <Text className="h-sub" textAlign={['center','center','left']}>
                Expert-led video courses at affordable prices. Master real-world skills and
                land the job you deserve — on your own schedule.
              </Text>

              <HStack spacing="3" flexWrap="wrap" justify={['center','center','flex-start']}
                className="h-ctas">
                <Link to="/courses">
                  <Box className="btn-fire">Explore Courses <span>→</span></Box>
                </Link>
                <Link to="/recommend">
                  <Box className="btn-outline-light">AI Recommendations</Box>
                </Link>
              </HStack>

              <Box className="h-stats">
                {[
                  { n:'12', s:'k+', l:'Students'    },
                  { n:'300', s:'+', l:'Courses'      },
                  { n:'98',  s:'%', l:'Satisfaction' },
                ].map((x, i) => (
                  <React.Fragment key={i}>
                    <Box className="h-stat">
                      <Box className="h-stat-n"><Counter end={x.n} suffix={x.s} /></Box>
                      <Box className="h-stat-l">{x.l}</Box>
                    </Box>
                    {i < 2 && <Box className="h-stat-div" />}
                  </React.Fragment>
                ))}
              </Box>
            </VStack>

            {/* ── Right — visual ── */}
            <Box flex="1" display={['none','none','flex']} justifyContent="center"
              alignItems="center" position="relative" minH="520px" className="h-right">

              <Box className="h-ring r1" />
              <Box className="h-ring r2" />
              <Box className="h-ring r3" />

              <Image src={vg} w="360px" objectFit="contain" className="h-img"
                position="relative" zIndex={2}
                filter="drop-shadow(0 30px 60px rgba(124,92,252,0.35)) drop-shadow(0 0 80px rgba(124,92,252,0.15))" />

              

              {/* ── FLOATING CARD 2: Streak (real join date) ── */}
              {isAuthenticated && streak !== null ? (
                <Box className="fc fc-streak" position="absolute" top="40px" right="-20px" zIndex={4}>
                  <span style={{ fontSize:'18px' }}>
                    {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '🌱'}
                  </span>
                  <Box>
                    <Box className="fc-title">
                      {streak >= 7
                        ? `${streak}-day streak!`
                        : streak >= 1
                        ? `${streak} day${streak > 1 ? 's' : ''} in`
                        : 'Just joined!'}
                    </Box>
                    <Box className="fc-label">
                      {streak >= 14 ? 'On fire 🔥' : streak >= 7 ? 'Keep it up!' : 'Welcome aboard'}
                    </Box>
                  </Box>
                </Box>
              ) : !isAuthenticated ? (
                /* Guest fallback */
                <Box className="fc fc-streak" position="absolute" top="40px" right="-20px" zIndex={4}>
                  <span style={{ fontSize:'18px' }}>🔥</span>
                  <Box>
                    <Box className="fc-title">7-day streak!</Box>
                    <Box className="fc-label">Keep it up</Box>
                  </Box>
                </Box>
              ) : null}

              {/* ── FLOATING CARD 3: Courses owned / CTA ── */}
              {isAuthenticated ? (
                <Box className="fc fc-cert" position="absolute" top="180px" right="-50px" zIndex={4}>
                  <span style={{ fontSize:'18px' }}>📚</span>
                  <Box>
                    <Box className="fc-title">
                      {(user?.playlist?.length || 0) > 0
                        ? `${user.playlist.length} Course${user.playlist.length > 1 ? 's' : ''} Owned`
                        : 'No Courses Yet'}
                    </Box>
                    <Box className="fc-label">
                      {(user?.playlist?.length || 0) > 0
                        ? <Link to="/profile" style={{ color:'#00c9a7' }}>View My Courses →</Link>
                        : <Link to="/courses" style={{ color:'#7c5cfc' }}>Browse Courses →</Link>}
                    </Box>
                  </Box>
                </Box>
              ) : (
                /* Guest fallback */
                <Box className="fc fc-cert" position="absolute" top="180px" right="-50px" zIndex={4}>
                  <span style={{ fontSize:'18px' }}>🏆</span>
                  <Box>
                    <Box className="fc-title">From just $6</Box>
                    <Box className="fc-label">No subscription</Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Stack>
        </Container>

        <Box className="h-scroll" position="absolute" bottom="28px" left="50%"
          transform="translateX(-50%)" zIndex={3}>
          <Box className="h-scroll-track"><Box className="h-scroll-dot" /></Box>
        </Box>
      </Box>

      {/* ══════════════════════════
          BRAND STRIP
      ══════════════════════════ */}
      <Box className="brand-strip">
        <Container maxW="1300px" px={['5','8','12']}>
          <Text className="brand-label">Trusted by learners from</Text>
          <HStack justify="space-evenly" flexWrap="wrap" gap="8" mt="5">
            {brands.map(({ Icon, color, label }, i) => (
              <VStack key={i} className="brand-item" spacing="1">
                <Icon size={36} color={color} />
                <Text fontSize="11px" fontWeight="600" color="rgba(255,255,255,0.25)">{label}</Text>
              </VStack>
            ))}
          </HStack>
        </Container>
      </Box>

      {/* ══════════════════════════
          FEATURES
      ══════════════════════════ */}
      <Box className="feat-section" py={['16','24']}>
        <Container maxW="1300px" px={['5','8','12']}>
          <Box textAlign="center" mb={['12','16']}>
            <Box className="eyebrow">Why EduFlow</Box>
            <Heading className="section-h" mt="3" mb="4">
              Everything you need to{' '}
              <Box as="span" className="grad-text">level up</Box>
            </Heading>
            <Text className="section-sub">
              From absolute beginner to job-ready — we've got the path, the mentors, and the community.
            </Text>
          </Box>
          <Box display="grid" gridTemplateColumns={['1fr','repeat(2,1fr)','repeat(4,1fr)']} gap="5">
            {features.map((f, i) => (
              <Box key={i} className="feat-card" style={{ '--d': `${i * 70}ms` }}>
                <Box className="feat-icon">{f.icon}</Box>
                <Box className="feat-title">{f.title}</Box>
                <Box className="feat-desc">{f.desc}</Box>
                <Box className="feat-shine" />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════
          POPULAR COURSES STRIP
      ══════════════════════════ */}
      <Box className="courses-strip" py={['16','24']}>
        <Container maxW="1300px" px={['5','8','12']}>
          <Stack direction={['column','row']} justify="space-between"
            align={['flex-start','center']} mb={['10','14']}>
            <Box>
              <Box className="eyebrow" style={{ color:'rgba(255,255,255,0.5)', borderColor:'rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)' }}>
                Popular Courses
              </Box>
              <Heading className="section-h" mt="3" color="white">Trending right now</Heading>
            </Box>
            <Link to="/courses">
              <Box className="btn-outline-light" style={{ marginTop:'0' }}>View All Courses →</Box>
            </Link>
          </Stack>
          <Box display="grid" gridTemplateColumns={['1fr','repeat(2,1fr)','repeat(4,1fr)']} gap="5">
            {courses.map((c, i) => (
              <Link to="/courses" key={i}>
                <Box className="course-card" style={{ '--cc': c.color, '--d': `${i * 80}ms` }}>
                  <Box className="course-emoji-wrap">
                    <Box className="course-emoji">{c.emoji}</Box>
                  </Box>
                  <Box className="course-cat">{c.cat}</Box>
                  <Box className="course-name">{c.title}</Box>
                  <HStack className="course-meta" justify="space-between" mt="4">
                    <Box className="course-meta-pill">⭐ {c.rating}</Box>
                    <Box className="course-meta-pill">{c.students} students</Box>
                  </HStack>
                  <HStack className="course-meta" justify="space-between" mt="2">
                    <Box className="course-meta-pill">{c.level}</Box>
                    <Box className="course-meta-pill">{c.duration}</Box>
                  </HStack>
                  <Box className="course-price">
                    {c.price}{' '}
                    <Box as="span" style={{fontSize:'12px', opacity:0.65, fontWeight:500}}>{c.inr}</Box>
                  </Box>
                  <Box className="course-cta">Watch Now →</Box>
                  <Box className="course-glow" />
                </Box>
              </Link>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════
          VIDEO SECTION
      ══════════════════════════ */}
      <Box className="vid-section" py={['16','24']} ref={vidRef}>
        <Container maxW="1300px" px={['5','8','12']}>
          <Stack direction={['column','column','row']} spacing={['12','16']} align="center">
            <VStack align={['center','center','flex-start']} spacing="6" flex="1"
              maxW={['100%','100%','420px']}>
              <Box className="eyebrow">See it in action</Box>
              <Heading className="section-h" color="white" textAlign={['center','center','left']}>
                Watch how EduFlow works
              </Heading>
              <Text fontSize="14px" color="rgba(255,255,255,0.45)" lineHeight="1.8"
                textAlign={['center','center','left']}>
                See why thousands of students choose EduFlow to build real-world skills
                and land better jobs — in just a few minutes.
              </Text>
              <HStack spacing="6" className="vid-stats">
                {[
                  { v:'4.9★', l:'Avg rating'    },
                  { v:'50+',  l:'Hours content'  },
                  { v:'12k+', l:'Students'       },
                ].map((s, i) => (
                  <Box key={i} className="vid-stat">
                    <Box className="vid-stat-v">{s.v}</Box>
                    <Box className="vid-stat-l">{s.l}</Box>
                  </Box>
                ))}
              </HStack>
              <Link to="/courses">
                <Box className="btn-fire">Start Learning <span>→</span></Box>
              </Link>
            </VStack>

            <Box flex="1" className={`vid-wrap ${vidIn ? 'vid-in' : ''}`}>
              <Box className="vid-glow" />
              <Box className="vid-frame">
                <video autoPlay controls muted disablePictureInPicture disableRemotePlayback
                  controlsList="nodownload nofullscreen noremoteplayback"
                  src={introVideo}
                  style={{ width:'100%', height:'auto', display:'block', borderRadius:'16px' }} />
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ══════════════════════════
          TESTIMONIALS
      ══════════════════════════ */}
      <Box className="testi-section" py={['16','24']}>
        <Container maxW="1300px" px={['5','8','12']}>
          <Box textAlign="center" mb={['10','14']}>
            <Box className="eyebrow">Student Stories</Box>
            <Heading className="section-h" mt="3">Real results from real learners</Heading>
          </Box>
          <Box display="grid" gridTemplateColumns={['1fr','repeat(2,1fr)','repeat(3,1fr)']} gap="5">
            {testimonials.map((t, i) => (
              <Box key={i} className="tcard" style={{ '--d': `${i * 90}ms` }}>
                <Box className="tcard-stars">★★★★★</Box>
                <Text className="tcard-quote">"{t.quote}"</Text>
                <HStack mt="5" spacing="3">
                  <Box className="tcard-av" style={{ background:`linear-gradient(135deg,${t.g})` }}>{t.av}</Box>
                  <Box>
                    <Box className="tcard-name">{t.name}</Box>
                    <Box className="tcard-role">{t.role}</Box>
                  </Box>
                </HStack>
                <Box className="tcard-bg-q">"</Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════
          FINAL CTA
      ══════════════════════════ */}
      <Box className="cta-section" py={['16','24']} px={['5','8']}>
        <Container maxW="860px">
          <Box className="cta-card">
            <Box className="cta-orb cta-orb1" />
            <Box className="cta-orb cta-orb2" />
            <Box className="cta-orb cta-orb3" />
            <VStack spacing="6" position="relative" zIndex={2} textAlign="center">
              <Box className="eyebrow" style={{ color:'rgba(255,255,255,0.5)', borderColor:'rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)' }}>
                {isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0]} 👋` : 'Get started today'}
              </Box>
              <Heading fontFamily="'Syne',sans-serif" fontSize={['2xl','3xl','4xl']}
                fontWeight="800" color="white" letterSpacing="-0.03em" lineHeight="1.1">
                {isAuthenticated
                  ? (user?.playlist?.length || 0) > 0
                    ? <>Keep learning,<br />{user?.name?.split(' ')[0]}.</>
                    : <>Your first course<br />awaits.</>
                  : <>Ready to transform<br />your career?</>}
              </Heading>
              <Text fontSize="15px" color="rgba(255,255,255,0.45)" maxW="420px" lineHeight="1.7">
                {isAuthenticated && (user?.playlist?.length || 0) > 0
                  ? `You own ${user.playlist.length} course${user.playlist.length > 1 ? 's' : ''}. Keep the momentum going.`
                  : 'Join 12,000+ students building in-demand skills. Every course is $10 or less — no subscription needed.'}
              </Text>
              <HStack spacing="3" flexWrap="wrap" justify="center" pt="2">
                <Link to="/courses">
                  <Box className="btn-fire">Browse Courses <span>→</span></Box>
                </Link>
                <Link to="/recommend">
                  <Box className="btn-outline-light">Get AI Picks</Box>
                </Link>
              </HStack>
              <HStack spacing="6" pt="1" flexWrap="wrap" justify="center">
                {['✓ No subscription','✓ All courses under $10','✓ 7-day refund'].map((x, i) => (
                  <Text key={i} fontSize="12px" color="rgba(255,255,255,0.3)" fontWeight="500">{x}</Text>
                ))}
              </HStack>
            </VStack>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}