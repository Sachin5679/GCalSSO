import React, { useEffect, useState } from 'react';
import { fetchEvents, logout } from './services/api';
import EventTable from './components/EventTable';
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Pagination,
} from '@mui/material';
import { Logout } from '@mui/icons-material';


interface Event {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
}

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const eventsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await fetchEvents();
        setEvents(events);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error fetching events:', err);
        setIsAuthenticated(false);
      }
    };

    fetchData();
  }, []);

  const handleSSO = () => {
    window.location.href = 'https://g-cal-sso-backend.vercel.app/auth/google';
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setEvents([]);
      setFilterDate('');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const filteredEvents = filterDate
    ? events.filter((event) => {
        const dateTime = event.start?.dateTime || '';
        return dateTime.startsWith(filterDate);
      })
    : events;

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (page - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Google Calendar Events
          </Typography>
          {isAuthenticated && (
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {!isAuthenticated ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '70vh',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome to Google Calendar Events
            </Typography>
            <Button variant="contained" color="info" onClick={handleSSO} size="large">
              Login with Google
            </Button>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                type="date"
                onChange={(e) => setFilterDate(e.target.value)}
                sx={{ width: '220px' }}
              />
              <Button
                variant="contained"
                onClick={() => setFilterDate('')}
                disabled={!filterDate}
              >
                Clear Filter
              </Button>
            </Box>

            {filteredEvents.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                No events found for the selected date.
              </Typography>
            ) : (
              <>
                <EventTable events={paginatedEvents} />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;