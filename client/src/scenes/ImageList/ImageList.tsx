import React, { useEffect, useState } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';

interface Token {
  token: string;
}

interface Image {
    id: string;
    file_name: string;
    file_type: string;
    presigned_url: string;
}

const ImageList: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);
    const token = useSelector((state: Token) => state?.token);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/images/list-images?p=1&page_size=4`,  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    }
                  });
                const data = await response.json();
                console.log(data);
                setImages(data.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div>
            <h1>Image List</h1>
            <div>
                {images && images.map((image) => (
                    <div key={image.id}>
                        <img src={image.presigned_url} alt={image.file_name} width={205} height={505}/>
                        <p>{image.file_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageList;
