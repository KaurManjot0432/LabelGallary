import Navbar from "../Navbar/Navbar";
import ImagesList from "../Images/ImagesList";
import Labelbar from "../Labelbar/Labelbar";
import Divider from '@mui/material/Divider'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Labelbar/>
    <Divider/>
    <ImagesList/>
    </>
  );
};

export default Home;
