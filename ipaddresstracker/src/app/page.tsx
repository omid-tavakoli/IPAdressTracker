"use client"
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery } from 'react-query';
import dynamic from 'next/dynamic';
import { Box, Button, TextField, Typography, CircularProgress, Alert, Stack, Divider, ListItem } from '@mui/material';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

interface FormData {
    query: string;
}

interface IPInfo {
    ip: string;
    city: string;
    region: string;
    country: string;
    timezone: string;
    org: string;
    latitude: number;
    longitude: number;
}

async function fetchIPInfo(query: string): Promise<IPInfo> {
    const res = await fetch(`https://ipapi.co/${query}/json/`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export default function Home() {
    const { register, handleSubmit } = useForm<FormData>();
    const { data, refetch, isLoading, isError, error } = useQuery<IPInfo, Error>(
        ['ipInfo', ''],
        () => fetchIPInfo(''),
        { enabled: false }
    );

    const onSubmit: SubmitHandler<FormData> = ({ query }) => {
        refetch({ queryKey: ['ipInfo', query] });
    };

    return (
        <>
            <Box sx={{  justifyItems : 'center' , position: 'relative', backgroundImage: 'url(images/pattern-bg-desktop.png)', height : '15vw' , backgroundSize: "cover", padding: 3 }}>
                <Typography variant="h4" component="h1" textAlign="center" color='white' gutterBottom>
                    IP Address Tracker
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', gap: 2 , marginTop : 5 }}>
                    <TextField
                        label="Search for any IP address or Domain"
                        variant="standard"
                        sx={{ backgroundColor: 'white', borderRadius: 5, padding: 1, border: 0,  width : '40rem '}}
                        {...register('query', { required: true })}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Search
                    </Button>
                </Box>
                {data && (
                    <Box sx={{ width: '80%', position: 'absolute', bottom: '-25%' , left : '8%', right : '50%', zIndex : 10 ,bgcolor: 'white', padding: 2, paddingY: 5, borderRadius: 6 }}>
                        <Stack

                            direction="row"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={2}
                        >
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <Typography sx={{ color: 'gray' }}>IP ADDRESS</Typography>
                                <Typography variant="h5" fontWeight={700}>{data.ip}</Typography>
                            </ListItem>
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <Typography sx={{ color: 'gray' }}>LOCATION</Typography>
                                <Typography variant="h5" fontWeight={700}> {data.city}, {data.region}, {data.country}</Typography>
                            </ListItem>
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <Typography sx={{ color: 'gray' }}>TIMEZONE</Typography>
                                <Typography variant="h5" fontWeight={700}>{data.timezone}</Typography>
                            </ListItem>
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                                <Typography sx={{ color: 'gray' }}>ISP</Typography>
                                <Typography variant="h5" fontWeight={700}>{data.org}</Typography>
                            </ListItem>
                        </Stack>
                    </Box>
                )}
            </Box>
            {isLoading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            {isError && <Alert severity="error">Error: {error.message}</Alert>}
            {data && (
                <div>
                    <Map latitude={data.latitude} longitude={data.longitude} />
                </div>
            )}
        </>
    );
}
