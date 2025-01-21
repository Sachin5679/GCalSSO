import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography } from '@mui/material';

interface Event{
  id: string;
  summary: string;
  start:{ dateTime:string };
  end:{ dateTime:string };
  location?: string;
}
function App() {
  const [events, setEvents]=useState<Event[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchEvents=async()=>{
    try{
      const response=await axios.get(`http://localhost:5000/events`,{
        withCredentials:true,
      });
      setEvents(response.data);
      setIsAuthenticated(true);
    } catch(err){
      console.error('Error fetching events:', err);
      setIsAuthenticated(false);
    }
  }

  const handleSSO=()=>{
    window.location.href='http://localhost:5000/auth/google';
  }
  const handleLogout=async()=>{
    // localStorage.removeItem('accessToken');
    // window.history.replaceState({}, document.title, window.location.pathname);
    // setIsAuthenticated(false);
    try{
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
    }catch(err){
      console.error('Error during logout:', err);
    }
    setIsAuthenticated(false);
    setEvents([]);
    setFilterDate('');
  }

  const extractDate=(dateTime: string): string=>{
    return new Date(dateTime).toLocaleDateString();
  }

  const extractTime=(dateTime: string): string=>{
    return new Date(dateTime).toLocaleTimeString()
  }

  useEffect(()=>{
    fetchEvents();
    // const urlParams=new URLSearchParams(window.location.search);
    // const token=urlParams.get('token');
    // if (token){
    //   localStorage.setItem('accessToken', token)
    //   fetchEvents();
    // }else{
    //   setIsAuthenticated(false);
    // }
  },[]);

  const filteredEvents=filterDate?events.filter((event)=>event.start.dateTime.startsWith(filterDate)):events;

  return (
    <>
    <div>
      {!isAuthenticated ? (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
          <Typography variant="h5" gutterBottom>
            Welcome to Google Calendar Events
          </Typography>
          <Button variant="contained" color="primary" onClick={handleSSO}>
            Login with Google
          </Button>
        </div>
      ) : (
        <div>
          <TextField
            label="Filter by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
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
        </div>
      )}
    </div>

    </>
  )
}

export default App
