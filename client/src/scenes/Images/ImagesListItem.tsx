import React from 'react';
import { ImageListItem } from '@mui/material';
import Dropdown from './Dropdown';
import { useInView } from 'react-intersection-observer';
import Chip from '@mui/material-next/Chip';
import Stack from '@mui/material/Stack';

interface ImageItemProps {
    image: {
        id: string;
        file_name: string;
        file_type: string;
        presigned_url: string;
        labels: string[];
    };
}

const ImagesListItem: React.FC<ImageItemProps> = ({ image }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
    });
    return (
        <>
            <ImageListItem key={image.presigned_url}>
                <img
                    ref={ref}
                    src={inView ? image.presigned_url : undefined}
                    alt={image.file_name}
                />
            </ImageListItem>
            {/* <Stack direction="row" spacing={1}>
                {image.labels && image.labels.map((label) => (
                    <Chip label={label} color="success" size="small" variant="outlined"></Chip>
                ))}
            </Stack> */}
        </>
    );
};

export default ImagesListItem;
