import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  const [page, setPage] = useState<number>(1); // Current page
  const eventsPerPage = 5; // Number of events per page

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`https://g-cal-sso-backend.vercel.app/events`, {
        withCredentials: true,
      });
      setEvents(response.data);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      if (err.response && err.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          await fetchEvents();
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://g-cal-sso-backend.vercel.app/refresh-token', {}, { withCredentials: true });
      return response.data.accessToken;
    } catch (err) {
      console.error('Error refreshing access token:', err);
      setIsAuthenticated(false);
      return null;
    }
  };

  const handleSSO = () => {
    window.location.href = 'https://g-cal-sso-backend.vercel.app/auth/google';
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://g-cal-sso-backend.vercel.app/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Error during logout:', err);
    }
    setIsAuthenticated(false);
    setEvents([]);
    setFilterDate('');
  };

  const extractDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  const extractTime = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleTimeString();
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchEvents();
    };

    fetchData();
  }, []);

  // Log the events data
  useEffect(() => {
    console.log('Events:', events);
  }, [events]);
  const filteredEvents = filterDate
    ? events.filter((event) => {
        const dateTime = event.start?.dateTime || ''; // Provide a default value
        return dateTime.startsWith(filterDate);
      })
    : events;

  // Pagination logic
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
                label="Filter by Date"
                type="date"
                InputLabelProps={{ shrink: true }}
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
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Event Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Start Time</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.summary}</TableCell>
                          <TableCell>{extractDate(event.start.dateTime)}</TableCell>
                          <TableCell>{extractTime(event.start.dateTime)}</TableCell>
                          <TableCell>{event.location || ' '}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
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