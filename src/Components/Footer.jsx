import logo from '../images/logo.png';
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
export const Footer = () => {

    const scrollToTop  = () =>{
        document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth"
          })
    }

    return (
        <>
        <Box sx={{padding:"20px"}}>
            <Divider sx={{background:"black",height:"2px",margin:"30px"}}/>
            <Typography variant='body2' sx={{marginLeft:"100px",display:"flex"}}> @2022 | Copyright Reserved <IconButton color='warning' sx={{marginLeft:"auto"}} onClick={scrollToTop}><ArrowUpwardIcon/></IconButton></Typography>
            <Typography variant='body1' sx={{margin:"20px 100px"}}> 
                Follow On | 
                <IconButton sx={{color:"black"}}><FacebookIcon/></IconButton>
                <IconButton sx={{color:"black"}}><InstagramIcon/></IconButton>
                <Button size='small' sx={{marginLeft:"100px"}}>FeedBack</Button>
                <Button size='small' sx={{marginLeft:"20px"}}>Help</Button>
                <Button size='small' sx={{marginLeft:"20px"}}>FAQ's</Button>
            </Typography>
        </Box>    
        </>
    );
}