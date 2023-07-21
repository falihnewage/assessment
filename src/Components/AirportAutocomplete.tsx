

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Polyline,
} from '@react-google-maps/api';

const center = { lat: 51.5, lng: -0.09 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [distance, setDistance] = useState<string>('');
  const [render, setRender] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('');
  const Location1 = {
    lat: 51.5,
    lng: -0.09,
  };

  // Location 2: Latitude and Longitude
  const Location2 = {
    lat: 51.52,
    lng: -0.12,
  };
  const [location1, setLocation1] = useState<any>({
    lat: null,
    lng: null
  })
  const [location2, setLocation2] = useState<any>({
    lat: null,
    lng: null
  })

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (
      originRef.current?.value === '' ||
      destinationRef.current?.value === ''
    ) {
      return;
    }
console.log(originRef?.current?.value ,'org ref');

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef?.current?.value!,
      destination: destinationRef?.current?.value!,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    console.log(results.routes[0].legs[0].distance,'results');
    
    setDistance(results.routes[0].legs[0].distance?.text || '');
    setDuration(results.routes[0].legs[0].duration?.text || '');
    await setLocation1({
      lat: results.routes[0].legs[0].end_location.lat(),
      lng: results.routes[0].legs[0].end_location.lng()
    })
    await setLocation2({
      lat: results.routes[0].legs[0].start_location.lat(),
      lng: results.routes[0].legs[0].start_location.lng()
    })
    setRender(true)
    let distance = calculateDistance(results?.routes[0]?.legs[0]?.end_location?.lat(), results.routes[0].legs[0].end_location.lng(), results.routes[0].legs[0].start_location.lat(), results.routes[0].legs[0].start_location.lng())
    setDistance(distance)
    console.log(  results.routes[0].legs[0].end_location.lat(),
     results.routes[0].legs[0].end_location.lng()
  ,'lat');
    
  }
  const polylineOptions = {
    strokeColor: "blue",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  function calculateDistance(lat1:any, lon1:any, lat2:any, lon2:any) {
    console.log(lat1, lon1, lat2, lon2, 'inside function');
    // Constants
    const R = 6371000; // Earth radius in meters

    // Convert latitude and longitude to radians
    const lat1Radians = lat1 * Math.PI / 180;
    const lon1Radians = lon1 * Math.PI / 180;
    const lat2Radians = lat2 * Math.PI / 180;
    const lon2Radians = lon2 * Math.PI / 180;

    // Calculate the difference in latitude and longitude
    const deltaLat = lat2Radians - lat1Radians;
    const deltaLon = lon2Radians - lon1Radians;

    // Calculate the distance between the two points
    const distance = Math.sqrt(
      Math.pow(deltaLat, 2) + Math.pow(Math.sin(deltaLon), 2) * Math.cos(lat1Radians) * Math.cos(lat2Radians)
    );

    return (  distance * R/1852).toFixed(2); ;
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
  }
 
  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
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
          onLoad={(map) => setMap(map as google.maps.Map)}
        >
          {/* <Marker position={center} /> */}
          {/* <Marker position={Location1} /> */}
          
          {/* <Marker position={location2} /> */}
          {render && 
          <div>
          <Polyline  path={[location1, location2]} options={polylineOptions} />
          </div>
          }

          
          {/* {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )} */}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete
            restrictions={{ country: 'us' }}
            types={['airport']}>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete
             restrictions={{ country: 'us' }}
             types={['airport']}
            >
              <Input
                type='text'
                placeholder='Destination'
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
         
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              if (map) {
                map.panTo(center);
                map.setZoom(15);
              }
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
