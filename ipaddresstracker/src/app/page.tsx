"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    TextField,
    IconButton,
} from "@mui/material";
import Image from "next/image"; 
import axios from "axios";

const Map = dynamic(() => import("../components/Map"));

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
    const {data} = await axios.get(`https://ipapi.co/${query}/json/`);
    return data;
}

export default function Home() {
    const { register, handleSubmit } = useForm<FormData>();
    const queryClient = useQueryClient();

    const mutation = useMutation<IPInfo, Error, string>({
        mutationFn: fetchIPInfo,
        onSuccess: (data) => {
            queryClient.setQueryData(["ipInfo", data.ip], data);
        },
    });

    const onSubmit: SubmitHandler<FormData> = ({ query }) => {
        mutation.mutate(query);
    };

    return (
        <>
            {/* Header Section */}
            <Box
                sx={{
                    position: "relative",
                    backgroundImage: "url(/images/pattern-bg-desktop.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: { xs: "30vh", md: "35vh" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    textAlign="center"
                    color="white"
                    gutterBottom
                >
                    IP Address Tracker
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        backgroundColor: "white",
                        borderRadius: 5,
                        overflow: "hidden",
                        width: "100%",
                        maxWidth: "600px",
                        marginTop: 2,
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Search for any IP address or Domain"
                        fullWidth
                        {...register("query", { required: true })}
                        sx={{
                            border: "none",
                            outline: "none",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 0,
                                padding: "5px 10px",
                            },
                        }}
                    />
                    <IconButton
                        type="submit"
                        sx={{
                            bgcolor: "black",
                            color: "white",
                            borderRadius: 0,
                            width: 60,
                            height: 66,
                            "&:hover": { bgcolor: "gray" },
                        }}
                    >
                        <Image src="/icon/icon-arrow.svg" alt="Arrow Icon" width={16} height={16} />
                    </IconButton>
                </Box>
            </Box>

            {/* Info Section */}
            {mutation.data && (
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "white",
                        padding: 5,
                        borderRadius: 2,
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                        maxWidth: "1200px",
                        width: { xs: "80%", sm: "90%" },
                        zIndex: 2,
                        top: "35vh",
                    }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        divider={
                            <Box
                                sx={{
                                    width: "1px",
                                    bgcolor: "gray",
                                    display: { xs: "none", md: "block" },
                                }}
                            />
                        }
                        spacing={{ xs: 2, md: 4 }}
                        justifyContent="space-around"
                        alignItems={{ xs: "center", md: "flex-start" }}
                    >
                        <Box>
                            <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>IP ADDRESS</Typography>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ textAlign: { xs: "center", md: "left" } }}
                            >
                                {mutation.data.ip}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>LOCATION</Typography>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ textAlign: { xs: "center", md: "left" } }}
                            >
                                {mutation.data.city}, {mutation.data.region}, {mutation.data.country}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>TIMEZONE</Typography>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ textAlign: { xs: "center", md: "left" } }}
                            >
                                {mutation.data.timezone}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>ISP</Typography>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ textAlign: { xs: "center", md: "left" } }}
                            >
                                {mutation.data.org}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            )}

            {/* Map Section */}
            {mutation.isPending && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
            {mutation.isError && <Alert severity="error">Error: {mutation.error.message}</Alert>}
            {mutation.isSuccess && mutation.data && (
                <Map latitude={mutation.data.latitude} longitude={mutation.data.longitude} />
            )}
        </>
    );
}
