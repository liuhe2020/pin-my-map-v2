import { useState, useContext } from 'react';
// import styled from 'styled-components';
// import { styled as muiStyled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import GlobalContext from '../context/GlobalContext';

export default function SignIn({ setIsSignUp }) {
  const { setAuthUser, setIsLoading } = useContext(GlobalContext);
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (res.status !== 200) {
      toast.error('Failed to log in, please try again.');
    } else {
      const data = await res.json();
      localStorage.setItem('pin-my-map-user', JSON.stringify(data));
      setAuthUser(data);
      toast.info('Tip: double click on the map to add a new pin.', {
        position: 'bottom-right',
        autoClose: false,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className='w-full max-w-sm lg:max-w-md px-6 py-8 xs:p-10 bg-white shadow-neutral-200 shadow-lg border border-neutral-100 rounded-lg'>
      <form className='flex flex-col items-center gap-6'>
        <h1 className='text-primary text-2xl text-center font-semibold'>Account Sign In</h1>
        {/* <input
          id='outlined-password-input'
          label='Username or email address'
          name='identifier'
          value={loginCreds.identifier}
          onChange={handleChange}
          // error={!hasEmail && true}
          // helperText={!hasEmail && 'Email address is required.'}
        /> */}
        {/* <input
          id='outlined-basic'
          type='password'
          autoComplete='current-password'
          label='Password'
          name='password'
          value={loginCreds.password}
          onChange={handleChange}
          // error={!hasPassword && true}
          // helperText={!hasPassword && 'Password is required.'}
        /> */}
        <input
          type='text'
          name='identifier'
          placeholder='Username or email address'
          className='border border-neutral-300 text-dark rounded-lg focus:outline-primary block w-full p-3'
          required
          value={credentials.identifier}
          onChange={handleChange}
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          className='border border-neutral-300 text-dark rounded-lg focus:outline-primary block w-full p-3'
          required
          value={credentials.password}
          onChange={handleChange}
        />
        <button
          type='button'
          className='text-white bg-primary hover:bg-primaryDark font-medium rounded-lg p-2.5 focus:outline-none w-full shadow-neutral-300 shadow-md'
          onClick={handleSubmit}
        >
          Sign in
        </button>
        <span className='w-full block bg-neutral-300 h-[0.5px]' />
        <button
          type='button'
          className='text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg p-2.5 focus:outline-none w-full shadow-neutral-300 shadow-md'
          onClick={() => setIsSignUp(true)}
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

// const Container = styled.div`
//   width: 360px;
//   box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
//   padding: 30px 35px;
//   background-color: #fff;

//   h1 {
//     color: #ed6c02;
//     font-size: 26px;
//     margin-bottom: 15px;
//     text-align: center;
//   }
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const StyledTextField = muiStyled(TextField)`
//   width: 100%;
//   margin: 10px 0;
// `;

// const StyledButton = muiStyled(Button)`
//   margin-top: 10px;
// `;

// const BreakLine = styled.span`
//   width: 100%;
//   height: 0.5px;
//   background-color: #bdbdbd;
//   margin: 20px 0 8px;
// `;
