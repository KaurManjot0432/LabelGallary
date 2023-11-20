import React, { useEffect, useState, useRef } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import { setTags } from '../../state';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useInView } from 'react-intersection-observer';
import Dropdown from './Dropdown';

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
  const dispatch = useDispatch();
  const token = useSelector((state: Token) => state?.token);
  const tags = useSelector((state:Tags) => state?.tags);
  const [images, setImages] = useState<Image[]>([]);
  const [imagesTotalCount, setImagesTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const fetchLabels = async () => {
    const response = await fetch(`${config.apiUrl}/images/label`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const parsedResponse= await response.json();
    console.log(parsedResponse);
    console.log(parsedResponse.labels);
    dispatch(setTags({tags : parsedResponse.labels}));
    console.log("tags --")
    console.log(tags);
  }
  const fetchImages = async () => {
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchImages();
  };

  useEffect(() => {
    fetchLabels();
    fetchImages();
  }, [currentPage, token, inView]);

  const handleLabelSelect = async (
    label: string,
    imageId: string
  ) => {
    try {
      const response = await fetch(`${config.apiUrl}/images/label-image/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label
        }),
      });

      if (response.ok) {
        console.log(response);
      } else {
        console.log('got error');
      }
    } catch (error) {
      console.error('Error assigning label:', error);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent="space-around">
        {images.map((image, index) => (
          <Grid item xs={6} key={image.id}>
            <img
              ref={index === images.length - 1 ? ref : undefined}
              src={inView ? image.presigned_url : undefined}
              alt={image.file_name}
              style={{ width: '80%', height: '80%', margin: '20px' }}
            />
            <Dropdown
              labels={tags}
              onSelect={(labelName) =>
                handleLabelSelect(labelName, image.id)
              }
            />
            <p
              style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginLeft: '30px' }}>
              {image.file_name}
            </p>
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
