import { useNavigate } from 'react-router-dom';
import { setLogin } from '../../state/index'
import { useDispatch } from 'react-redux';
import {
    GoogleOAuthProvider,
    GoogleLogin,
    CredentialResponse,
    ErrorCode
} from '@react-oauth/google';

const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const googleOauthProviderClientId = process.env.REACT_APP_GOOGLE_OAUTH_PROVIDER_CLIENT_ID;
    console.log(googleOauthProviderClientId);

    const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
        const { credential } = credentialResponse;

        // Decode JWT token to get user information
        const decodedToken = parseJwt(credential as string);
        const fetchedUser = {
            name: decodedToken.name,
            email: decodedToken.email
        }
        console.log(fetchedUser);
        dispatch(setLogin(
            {
                user: fetchedUser,
            }
        ));
        navigate('/home');
    };

    const handleGoogleLoginError = (error?: ErrorCode) => {
        if (error) {
            console.log('Google Login Failed with error:', error);
        }
    };

    // Function to parse JWT token
    const parseJwt = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    };

    return (
        <GoogleOAuthProvider clientId={googleOauthProviderClientId as string}>
            <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
            />
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginButton;