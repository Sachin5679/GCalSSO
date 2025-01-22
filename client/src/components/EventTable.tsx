import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { extractDate, extractTime } from '../utils/dateUtils';

// Define the Event type directly in this file
interface Event {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
}

interface EventTableProps {
  events: Event[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  return (
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
          {events.map((event) => (
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
  );
};

export default EventTable;