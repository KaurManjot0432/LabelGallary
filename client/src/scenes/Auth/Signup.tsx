import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import * as yup from 'yup'
import { Box, TextField } from '@mui/material'
import { Formik } from 'formik';
import {
    MDBContainer,
    MDBTabsContent,
    MDBBtn,
}
    from 'mdb-react-ui-kit';

function Signup() {
    const [registeredmsg, setRegisteredmsg] = useState<string | null>(null);
    const [errormsg, setErrormsg] = useState<string | null>('');
    const [showError, setShowError] = useState(false);
    const [showMsg, setMsg] = useState(false);

    const navigate = useNavigate();

    const userSignupSchema = yup.object().shape({
        username: yup.string().required('Required'),
        email: yup.string().email().required('Required'),
        password: yup.string().min(8, 'Password must be ateast 8 charactors').required('Required')
    })

    const initialSignupValues = {
        username: '',
        email: '',
        password: ''
    }

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
        }, 2000);
    };

    useEffect(() => {
        if (registeredmsg) {
            displayMsgTimer()
        }
        if (errormsg) {
            displayErrorFor5Seconds();
        }
    }, [registeredmsg, errormsg]);

    const handleRegisterClick = (values: any, onSubmitProps: any) => {
        handleRegister(values, onSubmitProps)
    }
    const handleRegister = async (values: any, onSubmitProps: any) => {
        const savedUserResponse = await fetch(`${config.apiUrl}/users/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });
        const savedUser = await savedUserResponse.json();
        console.log(savedUser);
        if (savedUser.success) {
            setRegisteredmsg("successfully Registered!");
            navigate('/')
        } else {
            console.log(savedUser.error);
            setErrormsg(savedUser.error);
        }
        onSubmitProps.resetForm();
    }
    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
            <MDBTabsContent>
                <Formik initialValues={initialSignupValues} validationSchema={userSignupSchema} onSubmit={handleRegisterClick}>{({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    resetForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box marginBottom={'10px'}>
                            <TextField onBlur={handleBlur}
                                label={'User Name'}
                                onChange={handleChange}
                                value={values.username}
                                name='username'
                                error={Boolean(touched.username) && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                id='username'
                                type='text'
                                variant="outlined" size="small"
                                sx={{ width: '100%', padding: "7px" }} />

                            <TextField onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name='email'
                                label='Email'
                                error={Boolean(touched.email) && Boolean(errors.email)}
                                helperText={touched.email && errors.email} id='email' type='email'
                                variant="outlined" size="small"
                                sx={{ width: '100%', padding: "7px" }} />

                            <TextField onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name='password'
                                label='password'
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                variant="outlined" size="small"
                                helperText={touched.password && errors.password} id='password' type='text'
                                sx={{ width: '100%', padding: "7px" }} />

                            <MDBBtn type='submit' className="mb-4 w-100">Sign up</MDBBtn>
                        </Box>
                        {showError && <p style={{ color: '#8B0000', border: '8px' }}>{errormsg}</p>}
                        {showMsg && <p style={{ color: '#8B0000', border: '8px' }}>{registeredmsg}</p>}
                    </form>
                )
                }
                </Formik>
            </MDBTabsContent>
        </MDBContainer>
    );
}

export default Signup;