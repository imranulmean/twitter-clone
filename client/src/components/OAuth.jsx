import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from "../firebase";
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailed } from "../redux/userSlice";
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const fireBaseGoogleResult = await signInWithPopup(auth, provider);
      await AWSCognitoId(fireBaseGoogleResult);      
       return; 
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(loginStart());
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  const AWSCognitoId= async(fireBaseGoogleResult) =>{

    //console.log('googleResult._tokenResponse.oauthIdToken',fireBaseGoogleResult._tokenResponse.oauthIdToken);
    console.log(fireBaseGoogleResult);
    // User pool name
    // twitterSigninUserPool
    // User pool ID
    // us-east-1_WGlDaLkZb
    // App client name
    // twitterSigninAppCognito
    // Client ID
    // 76mv44gknkbkj4uq6cdnsj6716    
    const twitterSigninURL = "https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
    const response = await fetch(twitterSigninURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${fireBaseGoogleResult._tokenResponse.oauthIdToken}`,
      },
    });   
    const data = await response.json();
    console.log('API Response:', data); 
        //const rawResponse= await fetch(twitterSigninURL);
        //console.log(await rawResponse.json());


}

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}
