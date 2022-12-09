import { Box, Button, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance, { mediaUrl } from "../AxiosInstance";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { MdEventSeat } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi";
import logo from '../images/logo.png'

const popularMovieSx = {
  width: "214px",
  height: "290px",
  background: "green",
  borderRadius: "5px",
  "&:hover": {
    transform: "scale(1.1)",
    transition: "all 0.3s ease-in-out",
  },
};

export const MovieDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [movies, setMovies] = useState();
  const [currMovie, setCurrMovie] = useState();
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    axiosInstance.get("/movies/all").then((res) => {
      setMovies(res.data);
    });
    axiosInstance.get("/movies/" + id).then((res) => {
      setCurrMovie(res.data[0]);
    });
    axiosInstance.get("/get-booked-seats-for-movie/" + id).then((res) => {
      setBookedSeats(res.data);
    });
  }, [id]);

  const addSeat = (number) => {
    if (selectedSeat.indexOf(number) === -1) {
      setSelectedSeat([...selectedSeat, number]);
    } else {
      let temp = [...selectedSeat];
      const index = temp.indexOf(number);
      if (index > -1) {
        temp.splice(index, 1);
        setSelectedSeat(temp);
      }
    }
  };

  const bookSeats = () => {
    axiosInstance
      .post("/book-seat", {
        movieId: id,
        userId: sessionStorage.getItem("userId"),
        selectedSeat: selectedSeat,
      })
      .then((res) => {
        if (res.data === "Seats Booked successfully") {
          // window.location.href = "/movie-detail/" + id;
        }
      });
  };

  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  //function will get called when clicked on the pay button.
  async function displayRazorpayPaymentSdk() {
    const res = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. please check are you online?");
      return;
    }

    // creating a new order and sending order ID to backend
      const result = await axiosInstance.post("/razorpay_order", {
          "order_id" : "Order-5152",
          seats:selectedSeat.length
      });

      if (!result) {
          alert("Server error. please check are you online?");
          return;
      }
      console.log(result.data)
    // Getting the order details back
       const {merchantId=null , amount=null,currency=null,orderId=null } = result.data;

    const options = {
      key: "rzp_test_ZDi1axSFOde2A8",
      amount: "50000",
      currency: "INR",
      name: "Payement",
      description: "Test Transaction",
      image: logo,
      order_id: orderId,
        callback_url: "http://127.0.0.1:8000/api/razorpay_callback",
      redirect: true,
      prefill: {
        name: "Sahil Nawale",
        email: "sahil.nawale@spit.ac.in",
        contact: "7499850363",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    bookSeats();
  }

  return (
    <>
      <Box
        sx={{ width: "100%", height: "100px", background: "rgba(0,0,0,0)" }}
      />
      <Box>
        {currMovie ? (
          <Box sx={{ margin: "10px 20px" }}>
            <Stack spacing={2} direction="column">
              <Box sx={{ width: "100%" }}>
                <video width="100%" controls={true}>
                  <source src={mediaUrl + currMovie.trailer} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {currMovie.name}
              </Typography>
              <Typography variant="h6">
                {currMovie.year}
                <br />
                {currMovie.time}
              </Typography>
              <Typography>{currMovie.description}</Typography>
            </Stack>
          </Box>
        ) : null}
        <Divider
          sx={{
            background: "black",
            margin: "20px 20px",
            border: "2px solid black",
          }}
        />
        <Box
          sx={{
            padding: "10px 30px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5">Most Popular</Typography>
          <Button
            variant="contained"
            color="warning"
            endIcon={<ArrowForwardIcon />}
          >
            See All
          </Button>
        </Box>
        <Box sx={{ padding: "20px 30px 70px 30px" }}>
          <Stack
            spacing={4}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            {movies
              ? movies.map((movie) => (
                  <Box
                    sx={popularMovieSx}
                    onClick={() => navigate("/movie-detail/" + movie.id)}
                  >
                    <Box component="img" src={mediaUrl + movie.image} />
                    <Typography
                      sx={{
                        background: "black",
                        padding: "5px 10px",
                        borderRadius: "0px 0px 10px 10px",
                        color: "white",
                      }}
                    >
                      {movie.name}
                    </Typography>
                  </Box>
                ))
              : null}
          </Stack>
        </Box>
      </Box>
      <Divider
        sx={{
          background: "black",
          margin: "20px 20px",
          border: "2px solid black",
        }}
      />
      <Box sx={{ padding: "10px 30px" }}>
        <Typography variant="h5">
          <MdEventSeat style={{ margin: "-10px 15px" }} size="1.5em" />
          Select Seats
        </Typography>
      </Box>
      {sessionStorage.getItem("userId") ? (
        <>
          <Box
            sx={{
              padding: "30px",
              height: "100%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Stack spacing={3}>
              {[...Array(7).keys()].map((i) => (
                <Typography
                  sx={{
                    background: "black",
                    color: "white",
                    width: "40px",
                    borderRadius: "5px",
                    lineHeight: "40px",
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </Typography>
              ))}
            </Stack>
            <Stack spacing={3}>
              {[...Array(7).keys()].map((row) => (
                <Stack direction="row" spacing={5}>
                  {[...Array(7).keys()].map((col) =>
                    bookedSeats.indexOf(row * 7 + (col + 1)) !== -1 ? (
                      <Typography
                        sx={{
                          background: "#b4b4b4",
                          color: "white",
                          width: "40px",
                          borderRadius: "5px",
                          lineHeight: "40px",
                          textAlign: "center",
                        }}
                      >
                        {row * 7 + (col + 1)}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          background:
                            selectedSeat.indexOf(row * 7 + (col + 1)) === -1
                              ? "black"
                              : "orange",
                          color: "white",
                          width: "40px",
                          borderRadius: "5px",
                          lineHeight: "40px",
                          textAlign: "center",
                        }}
                        onClick={() => addSeat(row * 7 + (col + 1))}
                        type="button"
                      >
                        {row * 7 + (col + 1)}
                      </Typography>
                    )
                  )}
                </Stack>
              ))}
              <Typography
                variant="h5"
                sx={{ width: "100%", textAlignLast: "end" }}
              >
                Selected Seats : {selectedSeat.length}
              </Typography>
            </Stack>
          </Box>
          <Button
            variant="contained"
            color="warning"
            endIcon={<HiOutlineTicket />}
            sx={{ width: "200px", margin: "auto", display: "flex" }}
            disabled={selectedSeat.length === 0}
            onClick={displayRazorpayPaymentSdk}
          >
            Book Now
          </Button>
        </>
      ) : (
        <Typography variant="h4" sx={{ margin: "auto", textAlign: "center" }}>
          Please Login to book seats
        </Typography>
      )}
    </>
  );
};
