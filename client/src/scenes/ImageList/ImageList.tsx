import React, { useEffect, useState } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface Token {
  token: string;
}

interface Image {
  id: string;
  file_name: string;
  file_type: string;
  presigned_url: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(2),
    },
  })
);

const ImageList: React.FC = () => {

  const itemsPerPage = 2;
  const classes = useStyles();

  const token = useSelector((state: Token) => state?.token);
  const [images, setImages] = useState<Image[]>([]);
  const [imagesTotalCount, setImagesTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchImages = async () => {
    console.log("fetching images")
    try {
      const url = `${config.apiUrl}/images/list-images?p=${currentPage}&page_size=${itemsPerPage}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setImages(data.results);
      setImagesTotalCount(data.count);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages()
  }, [currentPage, token]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchImages()
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent="center">
        {images && images.map((image) => (
          <Grid item xs={6} key={image.id}>
            <img src={image.presigned_url} alt={image.file_name} style={{ width: '100%', height: 'auto' }} />
            <p>{image.file_name}</p>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(imagesTotalCount / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default ImageList;
