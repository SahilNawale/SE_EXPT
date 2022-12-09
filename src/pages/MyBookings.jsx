import { Box, Button, Collapse, Dialog, DialogActions, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { HiOutlineTicket } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import axiosInstance, { API_KEY } from "../AxiosInstance";
import {AiOutlineSearch,AiOutlinePlus,AiOutlineMinus} from 'react-icons/ai';


export const MyBookings = () =>{


    const [stocks,setStocks] = useState();
    const [open,setOpen] = useState(false);
    const [stock,setStock] = useState();
    const [currPrice,setCurrPrice] = useState(0);
    const [quantity,setQuantity] = useState(0);

    useEffect(()=>{
        const userId = sessionStorage.getItem("userId")
        axiosInstance.post('/purchased-stock',{userId}).then(res=>{
            console.log(res.data);
            setStocks(res.data);
        })
    },[]);

    const getStock = (symbol) =>{
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&interval=5min&apikey=${API_KEY}`).then(res=>{
            let price = Object.values(res.data['Time Series (Daily)'])[0]['1. open']
            setCurrPrice(price)
            console.log(res.data)
        })
    }
    // const cancelBooking = (movieId,seat) => {
    //     axiosInstance.delete('cancel-booked-seat',{
    //         data: {
    //             userId:sessionStorage.getItem('userId'),
    //             movieId,
    //             seat
    //         }
    //       })
    //     let temp = bookedSeats.filter(function(s){
    //         return !(s.movieId === movieId && s.seat===seat)
    //     })
    //     setBookedSeats(temp)
    //     setOpen(false)
    // }

    const sellStock = (symbol,profit,quantity) =>{
        setOpen(false)
        let userId = sessionStorage.getItem('userId')
        axiosInstance.post('/sell-stock',{userId,"stock":symbol,profit,quantity}).then(res=>{
            console.log(res.data)
        })
    }

    return (
        <>
            <Box sx={{width:"100%",height:"100px",background:"rgba(0,0,0,0)"}}/>
            <Paper elevation={7} sx={{width:"600px",borderRadius:"30px",margin:"auto",padding:"15px"}}>
                <Typography variant='h5' textAlign='center' sx={{color:"#ed6c02",textShadow:"1px 1px 1px black"}}>My Stocks</Typography>
                <Divider sx={{background:"black",border:"1px solid black",margin:"10px 0px"}}/>
                    <Stack spacing={3}>
                    {stocks ? 
                    stocks.map((s)=>(
                        <Paper sx={{padding:"20px",borderRadius:"20px",display:"flex",justifyContent:"space-around",alignItems:'center'}} elevation={4}>
                            <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                                <HiOutlineTicket fontSize="40px"/>
                                <Typography sx={{margin:"0px 20px"}}>{s.stock}</Typography>
                            </Box>
                            <Typography  sx={{background:"black",color:"white",padding:"10px",borderRadius:"5px",lineHeight:"40px",textAlign:"center",margin:"0px 5px"}}>Purchase price : {s.stock_price} / {s.quantity}</Typography>
                            <Button color="warning" onClick={()=>{setOpen(true);getStock(s.stock)}}>Sell</Button>
               
                            <Dialog open={open} onClose={()=>setOpen(false)}>
                                <Box sx={{padding:"20px"}}>
                                    <Typography>Are you sure you want to Sell the Stock?</Typography>
                                    <Typography>Curr Price :{currPrice}</Typography>
                                    <DialogActions>
                                        <Button color='success' variant='contained' onClick={()=>setOpen(false)}>No</Button>
                                        <Stack direction='row' justifyContent='center' alignItems='center'>
                                            <IconButton sx={{background:"green",color:"white",padding:"15px",margin:"20px"}} onClick={()=>setQuantity(Math.min(quantity+1,s.quantity))}><AiOutlinePlus/></IconButton>
                                            <TextField sx={{width:"100px"}} value={quantity}/>
                                            <IconButton sx={{background:"#e8732f",color:"white",padding:"15px",margin:"20px"}} onClick={()=>setQuantity(Math.max(0,quantity-1))}><AiOutlineMinus/></IconButton>
                                        </Stack>
                                        <Button color='warning' variant='contained' autoFocus onClick={()=>sellStock(s.stock,currPrice*quantity,s.quantity-quantity)}>
                                            Yes
                                        </Button>
                                        </DialogActions>
                                </Box>
                            </Dialog>
                        </Paper>
                    )): <>Loading..</>}
                    </Stack>
            </Paper>

            
        </>
    );
}