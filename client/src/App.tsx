import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography } from '@mui/material';

interface Event{
  id: string;
  summary: string;
  start:{ dateTime:string };
  end:{ dateTime:string };
}
function App() {
  const [events, setEvents]=useState<Event[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchEvents=async(token:string)=>{
    try{
      const response=await axios.get(`http://localhost:5000/events?token=${token}`);
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

  useEffect(()=>{
    const urlParams=new URLSearchParams(window.location.search);
    const token=urlParams.get('token');
    if (token){
      fetchEvents(token);
    }else{
      setIsAuthenticated(false);
    }
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.summary}</TableCell>
                    <TableCell>{new Date(event.start.dateTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(event.end.dateTime).toLocaleString()}</TableCell>
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
