import { useState, ChangeEvent, useEffect } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import { Button, Grid, TextField } from '@material-ui/core';
import Navbar from '../Navbar/Navbar'

interface Token {
  token: string;
}

interface DirectUploadData {
  file_name: string;
  file_type: string;
  file: File;
}

const Admin = () => {
  const token = useSelector((state: Token) => state?.token);
  const [fileInput, setfile] = useState<File | null>(null);
  const [registeredmsg, setRegisteredmsg] = useState<string | null>(null);
  const [errormsg, setErrormsg] = useState<string | null>('');
  const [showError, setShowError] = useState(false);
  const [showMsg, setMsg] = useState(false);
  const [labelName, setLabelName] = useState<string>('');

  const displayErrorFor5Seconds = () => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrormsg(null);
    }, 2000);
  };

  const displayMsgTimer = () => {
    setMsg(true);
    setTimeout(() => {
      setMsg(false);
      setRegisteredmsg(null)
    }, 2000000);
  };

  useEffect(() => {
    if (registeredmsg) {
      displayMsgTimer()
    }
    if (errormsg) {
      displayErrorFor5Seconds();
    }
  }, [registeredmsg, errormsg]);

  const directUploadStart = async ({ file_name, file_type, file }: DirectUploadData) => {
    setRegisteredmsg("Uploading file...")
    setfile(null);
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
        try {
          await uploadFileToS3(file, signedUrlData.url, signedUrlData.fields);
          await directUploadFinish({ file_id: signedUrlData.id });
          setRegisteredmsg('File upload completed!');
        } catch (err) {
          setErrormsg('Error uploading image');
        }
      } else {
        setErrormsg('Error obtaining presigned URL');
      }
    } catch (error) {
      setErrormsg('File upload failed!');
    }
  };

  const uploadFileToS3 = async (file: File, url: string, fields: any) => {
    try {
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
    } catch (err) {
      console.log(err);
    }
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
    setfile(event.target.files?.[0] ?? null);
  };

  const fileData = () => {
    if (fileInput) {
      return (
        <div className="container my-3">
          <p>Selected File: {fileInput.name}</p>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              directUploadStart({
                file_name: fileInput.name,
                file_type: fileInput.type,
                file: fileInput,
              });
            }}
          >
            Upload
          </button>
        </div>
      );
    }
  };


  const createLabel = async (name: string) => {
    const response = await fetch(`${config.apiUrl}/images/label`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    setLabelName('');
    setRegisteredmsg("Label created!")
    const res = await response.json();
    console.log(res);
  }

  return (
    <div>

      <Navbar />
      <Grid container spacing={2} alignItems="center" style={{ marginLeft: "5px" }}>
        <Grid item>
          <TextField
            label="Label Name"
            variant="outlined"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          />
        </Grid>
        <Grid item>
          <button disabled={labelName.trim() === ''} type="button" className="btn btn-dark" onClick={() => { createLabel(labelName) }}>
            Create Label
          </button>
        </Grid>
        <Grid item>
          <label htmlFor="input" className="btn btn-dark">
            Select Image
            <input id="input" type="file" onChange={onInputChange} style={{ display: 'none' }} />
          </label>
        </Grid>
      </Grid>
      {fileData()}
      {showError && <p style={{ color: '#8B0000', border: '8px' }}>{errormsg}</p>}
      {showMsg && <p style={{ color: '#008000', border: '8px' }}>{registeredmsg}</p>}
    </div>
  );
};

export default Admin;
