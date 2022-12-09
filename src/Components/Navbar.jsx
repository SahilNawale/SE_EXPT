import { Avatar, Button, Collapse, Divider, IconButton, InputAdornment, OutlinedInput, Paper, TextField } from "@mui/material"
import  Box  from "@mui/material/Box"
import  Stack  from "@mui/material/Stack"
import  Dialog  from "@mui/material/Dialog"
import  Typography  from "@mui/material/Typography"
import { styled } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import logo from '../images/logo.png'
import LocalMoviesTwoToneIcon from '@mui/icons-material/LocalMoviesTwoTone';
import OndemandVideoTwoToneIcon from '@mui/icons-material/OndemandVideoTwoTone';
import { useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {AiOutlineUser} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {IoIosSettings} from 'react-icons/io'
import {HiOutlineTicket} from 'react-icons/hi'
import {GrClose} from 'react-icons/gr'
import {IoStatsChartSharp} from 'react-icons/io5'
import { useNavigate } from "react-router-dom"
import axiosInstance, { mediaUrl } from "../AxiosInstance"




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

export const Navbar = () =>{

    const navigate = useNavigate();
    
    const [open,setOpen] = useState(false);
    const [loginData,setLoginData] = useState({});
    const [signupData,setSignupData] = useState({});
    const [login,setLogin] = useState(true);
    const [msg,setMsg] = useState("");
    const [openProfile,setOpenProfile] = useState(false);
    const [openSearch,setOpenSearch] = useState(false);
    const [searchMovieData,setSearchMovieData] = useState();


    const handleData = (e)=>{
        setLoginData({...loginData,[e.target.name]:e.target.value});
        setSignupData({...signupData,[e.target.name]:e.target.value});
    }

    const handleLogin = () =>{
        axiosInstance.post('login',loginData).then(res=>{
            if(res.data!=="Invalid Credentials"){
                console.log(res.data)
                sessionStorage.setItem("userId",res.data[0].id)
                sessionStorage.setItem('username',loginData.username)
                setMsg("Login Success")
                sessionStorage.setItem('token',res.data[0].token)
                // window.location.href = '/';
            } else {
                setMsg("Invalid Credentials")
            }
        })
    }

    const handleLogout = () =>{
        sessionStorage.clear();
        setOpenProfile(false);
    }

    const handleSignup = () => {
        if(signupData.password!=signupData.confirm_password){
            setMsg("Password and Confirm Password do not match")
            return;
        }
        axiosInstance.post('signup',signupData).then(res=>{
            setMsg(res.data)
        })
    }

    const searchMovie = (text) =>{
        axiosInstance.get('search-movie/'+text).then(res=>{
            setSearchMovieData(res.data);
        })
    }

    const isLoggedIn = sessionStorage.getItem("token") ? true : false;

    return (
        <>
            <Box sx={{width:"100%",padding:"20px 0px",position:"absolute"}}>
                <Box sx={{margin:"auto 30px",height:"40px",display:"flex"}}>
                    <Typography sx={{width:"160px",height:"100%",marginRight:"20px",lineHeight:"44px"}} src={logo} variant='h6'>MY STOCKS</Typography>
                    <Stack direction="row" spacing={2} >
                        <Button startIcon={<HomeRoundedIcon/>} onClick={()=>navigate('/')}>Home</Button>  
                        <Button startIcon={<IoStatsChartSharp/>} onClick={()=>window.location.href = 'http://127.0.0.1:5500/charts.html'}>View Charts</Button>  
                    </Stack>
                    <Box sx={{marginLeft:"auto"}}>
                        {!isLoggedIn ? <Button variant="contained" color='warning' onClick={()=>setOpen(true)} id='sign_in_button'>Sign in</Button> :
                            <IconButton onClick={()=>setOpenProfile(!openProfile)} id='profile_button'>
                                <AiOutlineUser/>
                            </IconButton>
                        }
                    </Box>
                </Box>
            </Box>
            {login ? 
            <Dialog onClose={()=>setOpen(false)} open={open} sx={{borderRadius:"20px",'& .MuiPaper-root':{background:"rgba(0,0,0,0)"}}}>
                <Stack direction='column' spacing={3} sx={{background:"white",padding:"50px 30px",borderRadius:"20px",width:"250px"}}>
                    <Typography sx={{color:"#ed6c02",fontWeight:"600"}} variant='h6'><IconButton><AiOutlineUser fontSize='x-large' fontWeight='bold'/></IconButton> LOGIN</Typography>
                    <CustomTextField label="Username" value={loginData.username} name='username' onChange={handleData}/>
                    <CustomTextField type='password' label='Password' value={loginData.password} name='password' onChange={handleData}/>
                    <Button color='warning' variant='contained' fullWidth endIcon={<ArrowForwardIcon/>} onClick={handleLogin} name='submit'>Submit</Button>
                    <Button variant='contained' fullWidth onClick={()=>setLogin(!login)}>Or Signup Instead</Button>
                    <Typography sx={{fontSize:"14px",color:"red"}}>{msg}</Typography>
                </Stack>
            </Dialog> : 
            <Dialog onClose={()=>setOpen(false)} open={open} sx={{borderRadius:"20px",'& .MuiPaper-root':{background:"rgba(0,0,0,0)"}}}>
                <Stack direction='column' spacing={3} sx={{background:"white",padding:"50px 30px",borderRadius:"20px",width:"450px"}}>
                    <Typography sx={{color:"#ed6c02",fontWeight:"600"}} variant='h6'><IconButton><AiOutlineUser fontSize='x-large' fontWeight='bold'/></IconButton> SIGNUP</Typography>
                    <Box sx={{display:"flex",justifyContent:"space-between"}}>
                        <CustomTextField label='First Name' name='first_name' onChange={handleData}/>
                        <CustomTextField label='Last Name' name='last_name' onChange={handleData}/>
                    </Box>
                    <CustomTextField label="Email" type='email' name='email' onChange={handleData}/>
                    <CustomTextField label="Username" value={signupData.username} name='username' onChange={handleData} id='username'/>
                    <CustomTextField type='password' label='Password' value={signupData.password} name='password' onChange={handleData}/>
                    <CustomTextField type='password' label='Confirm Password' value={signupData.confirm_password} name='confirm_password' onChange={handleData}/>
                    <Button color='warning' variant='contained' fullWidth endIcon={<ArrowForwardIcon/>} onClick={handleSignup} >Submit</Button>
                    <Button variant='contained' fullWidth onClick={()=>setLogin(!login)}>Or Login Instead</Button>
                    <Typography sx={{fontSize:"14px",color:"red"}}>{msg}</Typography>
                </Stack>
            </Dialog>
            }
            <Collapse in={openProfile} sx={{position:'absolute',zIndex:"1",right:"0"}}>
                <Stack sx={{width:"200px",background:"white",padding:"20px 10px 22px 26px",borderBottomLeftRadius:"50px"}} spacing={2}>
                    <Avatar sx={{margin:"auto"}}/>
                    <Typography sx={{color:"gray",fontSize:"15px",textAlign:"center"}}>{sessionStorage.getItem('username')}</Typography>
                    <Divider sx={{width:"100%",background:"black"}}/>
                    <Stack alignItems='flex-start' spacing={1}>
                        <Button startIcon={<AiOutlineUser/>} onClick={()=>navigate('/profile')}>Profile</Button>
                        <Divider sx={{width:"100%"}}/>
                        <Button startIcon={<HiOutlineTicket/>} onClick={()=>navigate('/my-bookings')}>My Stocks</Button>
                        <Divider sx={{width:"100%"}}/>
                        <Button startIcon={<IoIosSettings/>}>Settings</Button>
                        <Divider sx={{width:"100%"}}/>
                        <Button startIcon={<FiLogOut/>} color='warning' onClick={handleLogout}>Logout</Button>
                    </Stack>
                    <IconButton sx={{position:"absolute",top:"0",left:"15px"}} size='small' onClick={()=>setOpenProfile(false)}><GrClose/></IconButton>
                </Stack>
            </Collapse>
        </>
    )
}