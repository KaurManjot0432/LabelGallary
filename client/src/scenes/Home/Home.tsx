import { useState, ChangeEvent } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import ImageList from '../ImageList/ImageList';

interface Token {
  token: string;
}

interface DirectUploadData {
  file_name: string;
  file_type: string;
  file: File;
}

const Home = () => {
  const [message, setMessage] = useState<string | undefined>();
  const token = useSelector((state: Token) => state?.token);

  const directUploadStart = async ({ file_name, file_type, file }: DirectUploadData) => {
    const values = { file_name, file_type };

    try {
      // Make a request to get the presigned URL
      const signedUrlResponse = await fetch(`${config.apiUrl}/images/upload-image/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (signedUrlResponse.ok) {
        const signedUrlData = await signedUrlResponse.json();
        console.log("presigned url response");
        console.log(signedUrlData.url, signedUrlData.fields);
        // Upload the file to S3 using the presigned URL
        await uploadFileToS3(file, signedUrlData.url, signedUrlData.fields);

        // Notify Django about the completion of the upload
        await directUploadFinish({ file_id: signedUrlData.id });
        setMessage('File upload completed!');
      } else {
        setMessage('Error obtaining presigned URL');
      }
    } catch (error) {
      setMessage('File upload failed!');
    }
  };

  const uploadFileToS3 = async (file: File, url: string, fields: any) => {
    const formData = new FormData();

    // Append additional fields to the FormData
    Object.keys(fields).forEach((key) => {
      formData.append(key, fields[key]);
    });

    // Append the file to the FormData
    formData.append('file', file);

    // Use the presigned URL to upload the file to S3
    await fetch(url, {
      method: 'POST',
      body: formData,
    });
  };

  const directUploadFinish = async ({ file_id }: { file_id: number }) => {
    // Make a request to notify Django about the completion of the upload
    await fetch(`${config.apiUrl}/images/upload-image/finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ file_id }),
    });
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files?.[0];

    if (fileInput) {
      directUploadStart({
        file_name: fileInput.name,
        file_type: fileInput.type,
        file : fileInput
      });
    }
  };

  return (
    <div>
      <h1>Direct upload</h1>
      <div>Select files to upload:</div>

      <input id="input" type="file" onChange={onInputChange} />

      <div>{message}</div>
      <ImageList/>
    </div>
  );
};

export default Home;
