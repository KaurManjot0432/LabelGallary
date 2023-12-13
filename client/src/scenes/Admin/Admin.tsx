import Navbar from '../Navbar/Navbar'
import CreateLabel from './CreateLabel';
import UploadFile from './UploadFile';

const Admin = () => {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
        <CreateLabel />
        <UploadFile />
      </div>

    </>
  );
};

export default Admin;
