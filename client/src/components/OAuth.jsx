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
 
     AWS.config.region = 'us-east-1';
     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
       IdentityPoolId: 'us-east-1:b0a755d9-bcfb-4784-929f-9742e02b4e64', // MAKE SURE YOU REPLACE THIS
       Logins: {
         'accounts.google.com': fireBaseGoogleResult._tokenResponse.oauthIdToken
       }
     });
     AWS.config.credentials.get(async function(err) {
        if (!err) {
          console.log('showing AWS.config.credentials');
          console.log(AWS.config.credentials);
          console.log('Exchanged to Cognito Identity Id: ' + AWS.config.credentials.identityId);

            // Use AWS SDK to sign the request
        // Create a request object
        const twitterSigninURL = "https://uhsck9agdk.execute-api.us-east-1.amazonaws.com/dev/twittersignin";
      //   var httpRequest = new AWS.HttpRequest(twitterSigninURL, "us-east-1");
      //   httpRequest.headers.host = twitterSigninURL; // Do not specify http or https!!     
      //   httpRequest.method = "GET";
      //   var v4signer = new AWS.Signers.V4(httpRequest, "execute-api");
      //   v4signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());        

      //   const rawResponse = await fetch(httpRequest.endpoint.href , {
      //     method: httpRequest.method,
      //     headers: httpRequest.headers,
      //     // body: httpRequest.body
      // });
      const rawResponse= await fetch(twitterSigninURL);
      console.log(await rawResponse.json());
        
        } else {
          console.log(err);
        }   
   })
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
