import React, { useEffect, useState } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import { setTags, setImages, setPageNumber } from '../../state';
import { useDispatch } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImagesListItem from './ImagesListItem';

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

interface SelectedLabel {
  selectedLabel: string;
}

interface Image {
  id: string;
  file_name: string;
  file_type: string;
  presigned_url: string;
  labels: string[];
}

interface PageNumber {
  pageNumber: number;
}

const ImagesList: React.FC = () => {
  const itemsPerPage = 8;
  const dispatch = useDispatch();
  const token = useSelector((state: Token) => state?.token);
  const tags = useSelector((state: Tags) => state?.tags);
  const images = useSelector((state: Images) => state?.images);
  const currentPage = useSelector((state: PageNumber) => state?.pageNumber);
  const selectedLabel = useSelector((state: SelectedLabel) => state.selectedLabel);
  const [imagesTotalCount, setImagesTotalCount] = useState<number>(0);

  const fetchLabels = async () => {
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
    try {
      const url = `${config.apiUrl}/images/list-images?p=${currentPage}&page_size=${itemsPerPage}&label=${selectedLabel}`;
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
    dispatch(setPageNumber(page));
    fetchImages();
  };

  // Callback function to update labels in the parent component
  const handleLabelAddition = (imageId: string, addedLabel: string) => {
    const updatedImages = images.map((image) =>
      image.id === imageId
        ? { ...image, labels: [...image.labels, addedLabel] }
        : image
    );
    dispatch(setImages({ images: updatedImages }));
  };

  useEffect(() => {
    fetchLabels();
    fetchImages();
  }, [selectedLabel, currentPage]);

  return (
    <Box sx={{ width: 1, p: 2, overflowY: 'scroll', textAlign: 'center' }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images && images.map((image) => (
          <ImagesListItem
            key={image.presigned_url}
            image={image}
            onLabelAddition={handleLabelAddition}
          />
        ))}
      </ImageList>
      <Pagination
        count={Math.ceil(imagesTotalCount / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default ImagesList;
