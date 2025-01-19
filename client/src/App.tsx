// import React, { useState } from 'react';
import { Button, Typography } from "@mui/material"
function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Log in to see your calendar
        </Typography>
        <Button variant="contained" color="primary">
          Login with Google
        </Button>
      </div>
    </div>

    </>
  )
}

export default App
