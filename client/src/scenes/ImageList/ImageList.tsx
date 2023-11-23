import React, { useEffect, useState, useRef } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import { setTags, setImages } from '../../state';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ImageItem from './ImageItem';

interface Token {
  token: string;
}
interface Tags {
  tags: Label[];
}

interface Label {
  id: number;
  name: string;
}

interface Images {
  images: Image[];
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
  const itemsPerPage = 8;
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state: Token) => state?.token);
  const tags = useSelector((state: Tags) => state?.tags);
  const images = useSelector((state: Images) => state?.images);
  const [imagesTotalCount, setImagesTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchLabels = async () => {
    console.log("fetchLabels called");
    try {
      const response = await fetch(`${config.apiUrl}/images/label`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parsedResponse = await response.json();
      dispatch(setTags({ tags: parsedResponse.labels }));
      console.log("tags = ", tags);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  }
  const fetchImages = async () => {
    console.log("fetchImges called");
    try {
      const url = `${config.apiUrl}/images/list-images?p=${currentPage}&page_size=${itemsPerPage}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const parsedResponse = await response.json();
      dispatch(setImages({ images: parsedResponse.results }));
      console.log("images = ", images);
      setImagesTotalCount(parsedResponse.count);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchImages();
  };

  useEffect(() => {
    fetchLabels();
    fetchImages();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent="space-around">
        {images && images.map((image, index) => (
          <ImageItem image={image} index={index} />
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
