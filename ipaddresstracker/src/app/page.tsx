"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery } from "react-query";
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
import Image from "next/image"; // برای آیکون سفارشی

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
    const res = await fetch(`https://ipapi.co/${query}/json/`);
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
}

export default function Home() {
    const { register, handleSubmit } = useForm<FormData>();
    const { data, refetch, isLoading, isError, error } = useQuery<IPInfo, Error>(
        ["ipInfo", ""],
        () => fetchIPInfo(""),
        { enabled: false }
    );

    const onSubmit: SubmitHandler<FormData> = ({ query }) => {
        refetch({ queryKey: ["ipInfo", query] });
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
            {data && (
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
                  width: {xs : "80%", sm:"90%"},
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
                      {data.ip}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>LOCATION</Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ textAlign: { xs: "center", md: "left" } }}
                    >
                      {data.city}, {data.region}, {data.country}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>TIMEZONE</Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ textAlign: { xs: "center", md: "left" } }}
                    >
                      {data.timezone}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: "gray", textAlign: { xs: "center", md: "left" } }}>ISP</Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ textAlign: { xs: "center", md: "left" } }}
                    >
                      {data.org}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
            )}

            {/* Map Section */}
            {isLoading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
            {isError && <Alert severity="error">Error: {error.message}</Alert>}
            {data && (
                    <Map latitude={data.latitude} longitude={data.longitude} />
            )}
        </>
    );
}
