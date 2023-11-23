import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dropdown from './Dropdown';
import { useInView } from 'react-intersection-observer';

interface ImageItemProps {
    image: {
        id: string;
        file_name: string;
        file_type: string;
        presigned_url: string;
    };
    index: number;
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

const ImageItem: React.FC<ImageItemProps> = ({ image, index }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
    });
    return (
        <Grid item xs={6}>
            <img
                ref={ref}
                src={inView ? image.presigned_url : undefined}
                alt={image.file_name}
                style={{ width: '80%', height: '80%', margin: '20px' }}
            />
            <Dropdown imageId={image.id} />
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginLeft: '30px' }}>
                {image.file_name}
            </p>
        </Grid>
    );
};

export default ImageItem;
