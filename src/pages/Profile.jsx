import { Box, Button, IconButton, OutlinedInput, Paper, Stack, TextField, Typography, useScrollTrigger } from "@mui/material";
import profileImage from '../images/profileImage.jpg'
import {MdModeEditOutline} from 'react-icons/md'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {AiOutlineUser,AiOutlinePlus} from 'react-icons/ai'
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../AxiosInstance";



const CustomTextField = styled(TextField)(({theme})=>({
    '& .MuiInputBase-input':{
        color:'black'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black',
    },
    '&:hover fieldset': {
        borderColor: 'black',
      },
    },
    '& .MuiInputLabel-root':{
        color:'black'
    },
    '& label.Mui-focused': {
        color: '#ed6c02',
    },
}));



export const Profile = () =>{

    const [disabled,setDisabled] = useState(true)
    const [userDetails,setUserDetails] = useState()
    const [errorMsg,setErrorMsg] = useState("")
    const [a,setAmount] = useState(0)
    
    useEffect(()=>{
        axiosInstance.get('get-user-details/'+sessionStorage.getItem('userId')).then(res=>{
            setUserDetails(res.data[0])
            console.log(res.data)
        })
    },[])

    const handleChange = (e)=>{
        setUserDetails({...userDetails,[e.target.name]:e.target.value})
        console.log(userDetails)
    }

    const handleUpdate = () =>{
        axiosInstance.put('update-user-details',userDetails).then(res=>{
            setErrorMsg(res.data)
        })
        setDisabled(true)
    }

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
              "amount":a*100
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
          amount: amount,
          currency: "INR",
          name: "Payement",
          description: "Test Transaction",
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
        axiosInstance.put('update-user-details',{...userDetails,balance:userDetails.balance+parseInt(a)}).then(res=>{
            setErrorMsg(res.data)
        })
      }


    return (
        <>  
            <Box sx={{width:"100%",height:"100px",background:"rgba(0,0,0,0)"}}/>
            <Paper elevation={6} sx={{width:"500px",margin:"auto",borderRadius:"20px",overflow:"hidden"}}>
                <Box sx={{background:"orange",width:"500px",height:"200px",textAlign:"center",padding:"30px 0px"}}>
                    <Box component='img' src={profileImage} sx={{width:"200px",margin:"auto"}}/>
                    {disabled?
                    <Button onClick={()=>setDisabled(false)} 
                        sx={{position:"absolute",transform:"translate(-170px,210px)",borderRadius:"20px"}}
                        variant='contained' color='warning'
                        endIcon={<MdModeEditOutline/>}>Edit Profile</Button>:null}
                </Box>
                <Box sx={{width:"100%",marginTop:"20px"}}>
                    {userDetails?
                    <Stack direction='column' spacing={3} sx={{background:"white",padding:"50px 30px",borderRadius:"20px",width:"450px"}} onChange={handleChange}>
                        <Box sx={{display:"flex",justifyContent:"space-between"}}>
                            <CustomTextField disabled={disabled} label='First Name' name='first_name' value={userDetails.first_name}/>
                            <CustomTextField disabled={disabled} label='Last Name' name='last_name' value={userDetails.last_name}/>
                        </Box>
                        <CustomTextField disabled={disabled} label="Email" type='email' name='email' value={userDetails.email}/>
                        <CustomTextField disabled={disabled} label="Username" name='username' value={userDetails.username}/>
                        <CustomTextField disabled={disabled} type='password' label='Password'  name='password' value={userDetails.password}/>
                        <Button variant='contained' fullWidth endIcon={<ArrowForwardIcon/>} onClick={handleUpdate}>Submit</Button>
                        <Typography sx={{fontSize:"14px",color:"red"}}>{errorMsg}</Typography>
                        <Typography variant="h6">Account Balance</Typography>
                        <Typography sx={{color:"orange"}} variant='h4'>$ {userDetails.balance}</Typography>
                    </Stack>
                    :null}
                    <OutlinedInput onChange={(e)=>{
                        setAmount(e.target.value);
                    }}
                    sx={{margin:"0px 20px 20px 20px"}}
                    name='balance' placeholder="Amount" type="number" 
                    endAdornment={<Button sx={{width:"200px"}} endIcon={<AiOutlinePlus/>} variant='contained' color='success' onClick={displayRazorpayPaymentSdk}>Add Funds</Button>}/>
                </Box>
            </Paper>
        </>
    );
}