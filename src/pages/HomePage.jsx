import Typography  from "@mui/material/Typography";
import Box  from "@mui/material/Box";
import background from '../images/background.png'
import TextField  from "@mui/material/TextField";
import InputAdornment  from "@mui/material/InputAdornment";
import Button  from "@mui/material/Button";
import { Stack } from "@mui/system";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance, { API_KEY, mediaUrl } from "../AxiosInstance";
import { useNavigate } from "react-router-dom";
import {SiScrollreveal} from 'react-icons/si'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {AiOutlineSearch,AiOutlinePlus,AiOutlineMinus} from 'react-icons/ai';
import { IconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import axios from "axios";


const popularMovieSx = {width:"214px",height:"290px",background:"green",borderRadius:'5px','&:hover':{
    transform:'scale(1.1)',
    transition:"all 0.3s ease-in-out"
}
};
const upcomingMovieSx = {width:"400px",height:"240px",background:"green",borderRadius:'5px','&:hover':{
    transform:'scale(1.1)',
    transition:"all 0.3s ease-in-out"
}};

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];


export const HomePage = () =>{

    const navigate = useNavigate();
    const [stocks,setStocks] = useState();
    const [searchText,setSearchText] = useState("all");
    const [open,setOpen] = useState(false);
    const [quantity,setQuantity] = useState(0);
    const [stockDetails,setStockDetails] = useState();
    const [msg,setMsg] = useState("");
    
    useEffect(()=>{
        axiosInstance.get('/stocks/'+searchText).then(res=>{
            console.log(res.data)
            setStocks(res.data.bestMatches)
        })
    },[])

    const browseStocks = () => {
        document.documentElement.scrollTo({
            top:550,
            behavior:"smooth"
        })
    }

    const searchStocks = () =>{
        axiosInstance.get('/stocks/'+searchText).then(res=>{
            console.log(res.data)
            setStocks(res.data.bestMatches)
        })
    }

    const handleStock = (symbol,name) => {
        console.log(symbol)
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&interval=5min&apikey=${API_KEY}`).then(res=>{
            let price = Object.values(res.data['Time Series (Daily)'])[0]['1. open']
            setStockDetails({
                "name":name,
                "symbol":symbol,
                "price":price
            })
        })
    }

    const handleBuy = () =>{
        let id = sessionStorage.getItem('userId')
        axiosInstance.post('/buy-stock',{id,quantity,price:stockDetails.price,symbol:stockDetails.symbol}).then(res=>{
            setMsg(res.data)
        })
    }

    return(
        <>
        <Box component="img" sx={{width:"100%",backgroundRepeat:'repeat',backgroundSize:'cover',zIndex:"-1",position:"absolute",opacity:"0.5",height:"200vh"}} src={background}></Box>
        <Box sx={{zIndex:"1",padding:"150px 100px"}}>
            <Typography variant='h6' sx={{color:"#ed6c02"}} >
                Welcome to My Stocks
            </Typography>
            <Typography variant='h3' sx={{margin:"20px 0px"}}>
                Easily Buy and <br/>
                Sell Stocks <br/>
                in just a click 
            </Typography>
           <Button color="warning" variant="contained" endIcon={<SiScrollreveal/>} onClick={browseStocks}>View Stocks</Button>
        </Box>
        <Box sx={{padding:"30px 30px",display:'flex',justifyContent:"space-between"}}>
            <Typography variant="h5">Top Stocks</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end',background:"white",padding:"5px",borderRadius:"10px"}}>
                <IconButton onClick={searchStocks}><AiOutlineSearch/></IconButton>
                <TextField variant="standard" onChange={(e)=>setSearchText(e.target.value)}/>
            </Box>
        </Box>
        <Box sx={{padding:"20px 30px 70px 30px"}}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Stock Name</TableCell>
                        <TableCell align="right">Symbol&nbsp;</TableCell>
                        <TableCell align="right">Buy&nbsp;</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {stocks ? stocks.map((stock) => (
                        <TableRow key={stock['2. name']} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{stock['2. name']}</TableCell>
                        <TableCell align="right">{stock['1. symbol']}</TableCell>
                        <TableCell align="right"><Button disabled={!sessionStorage.getItem("userId")} variant='contained' color='warning' onClick={()=>{setOpen(true);setMsg("");handleStock(stock['1. symbol'],stock['2. name'])}}>Buy</Button></TableCell>
                        </TableRow>
                    )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        {stockDetails ? 
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <Paper elevation={6} sx={{padding:"30px",width:"300px",display:'flex',justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
                    <Typography sx={{width:"90%"}} variant='h3'>{stockDetails.symbol}</Typography>
                    <Typography sx={{width:"90%"}} variant='h5'>{stockDetails.name}</Typography>
                    <Typography sx={{width:"90%",color:"orange"}} variant='h3'>${stockDetails.price}</Typography>
                    <Stack direction='row' justifyContent='center' alignItems='center'>
                        <IconButton sx={{background:"green",color:"white",padding:"15px",margin:"20px"}} onClick={()=>setQuantity(quantity+1)}><AiOutlinePlus/></IconButton>
                        <TextField sx={{width:"100px"}} value={quantity}/>
                        <IconButton sx={{background:"#e8732f",color:"white",padding:"15px",margin:"20px"}} onClick={()=>setQuantity(Math.max(0,quantity-1))}><AiOutlineMinus/></IconButton>
                    </Stack>
                    <Typography sx={{width:"90%",margin:"10px 0px"}} variant='h5'>Total Amount : {(stockDetails.price*quantity).toFixed(3)}$</Typography>
                    <Button variant='contained' color="success" fullWidth onClick={handleBuy}>Buy</Button>
                    <Typography sx={{color:"red",marginTop:"15px"}}>{msg}</Typography>
                </Paper>
            </Dialog>
        :null}
        </>
    );
}