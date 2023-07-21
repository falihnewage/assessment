import React, { useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import {
  Box,
  Button,
  ButtonGroup,
  Typography ,
  IconButton,
  Input,
  
} from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';

const center = { lat: 41.85, lng: -87.65 };
const Location1 = { lat: 41.881832, lng: -87.623177 };
const Location2 = { lat: 34.180840, lng: -118.308968 };
const polylineOptions = { strokeColor: 'blue', strokeOpacity: 1, strokeWeight: 2 };

function App() {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<any>('');
  const [duration, setDuration] = useState<any>('');

  async function calculateRoute() {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    setDistance(results?.routes[0]?.legs[0]?.distance?.text  );
    setDuration(results?.routes[0]?.legs[0]?.duration?.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current!.value = '';
    destinationRef.current!.value = '';
  }

  return (
    <div
    >
       <Box position='relative' width={'100vw'} height={'100vh'}>
      {/* Google Map Box */}
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={map => setMap(map as google.maps.Map)}
      >
        <Marker position={Location1} />
        <Marker position={Location2} />
        <Polyline path={[Location1, Location2]} options={polylineOptions} />
      </GoogleMap>
      {/* Second div placed on top */}
      <Box position='absolute' top={2} left={'35%'} display='flex' flexDirection={'row'} gap={3} fontSize={20}  fontWeight={15} color={'#000'} borderRadius={6} boxShadow={`0px 4px 6px rgba(0, 0, 0, 0.2)`} width={'30%'} height={'5%'} padding={4}  >
       
        <Autocomplete
            restrictions={{ country: 'us' }}
            types={['airport']}>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
        <Autocomplete
        
            restrictions={{ country: 'us' }}
            types={['airport']}
            
            >
              <Input type='text' style={{color:'blue'}} placeholder='Origin' ref={destinationRef} />
            </Autocomplete>
            <Button variant='contained' color='primary' onClick={calculateRoute}>
          Calculate Route
        </Button>
        <Typography variant='subtitle1' style={{ color: 'blue' }}>New Text in a New Row</Typography>
      </Box>
    </Box>
      
     
       
            
      
    </div>
  )
}

export default App;
