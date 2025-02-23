import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Store as StoreIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Work as WorkIcon,
  Forum as ForumIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

const features = [
  {
    title: 'Student Marketplace',
    description: 'Buy, sell, or rent textbooks, gadgets, and find housing options.',
    icon: <StoreIcon sx={{ fontSize: 40 }} />,
    path: '/marketplace',
    color: '#2196f3',
  },
  {
    title: 'Study Groups',
    description: 'Connect with peers who share your academic interests.',
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    path: '/study-groups',
    color: '#4caf50',
  },
  {
    title: 'Campus Events',
    description: 'Discover and join exciting events happening around you.',
    icon: <EventIcon sx={{ fontSize: 40 }} />,
    path: '/events',
    color: '#ff9800',
  },
  {
    title: 'Internships & Jobs',
    description: 'Find local opportunities and kickstart your career.',
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    path: '/jobs',
    color: '#f44336',
  },
  {
    title: 'Community Forums',
    description: 'Engage in discussions about tech, fitness, gaming, and more.',
    icon: <ForumIcon sx={{ fontSize: 40 }} />,
    path: '/community',
    color: '#9c27b0',
  },
  {
    title: 'Mental Health Support',
    description: 'Access resources and connect with support groups.',
    icon: <SupportIcon sx={{ fontSize: 40 }} />,
    path: '/support',
    color: '#00bcd4',
  },
];

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random/?university)',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', py: 8 }}>
          <Typography
            component="h1"
            variant="h2"
            color="inherit"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Welcome to CampusHub
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Your one-stop platform for everything campus life.
            Connect, learn, and grow with your college community.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 4 }}
            onClick={() => navigate('/marketplace')}
          >
            Get Started
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => navigate(feature.path)}
              >
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: feature.color,
                    color: 'white',
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
