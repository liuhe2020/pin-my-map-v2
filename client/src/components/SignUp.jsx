import { useState, useContext } from 'react';
// import styled from 'styled-components';
// import { styled as muiStyled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import GlobalContext from '../context/GlobalContext';

export default function SignUp({ setIsSignUp }) {
  const { setAuthUser, setIsLoading } = useContext(GlobalContext);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // form validation
    if (newUser.username.length < 3) {
      setIsValidUsername(false);
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newUser.email)) {
      setIsValidEmail(false);
      return;
    }
    if (newUser.password.length < 6) {
      setIsValidPassword(false);
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      setIsValidConfirmPassword(false);
      return;
    }

    setIsLoading(true);

    const submitValues = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
    };

    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitValues),
    });
    if (res.status !== 200) {
      toast.error('Failed to sign up, please use a different username/email or try again later.');
    } else {
      const data = await res.json();
      localStorage.setItem('pin-my-map-user', JSON.stringify(data));
      setAuthUser(data);
      toast(`Welcome to Pin My Map, ${submitValues.username}.`);
    }

    setIsLoading(false);
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <h1 className='text-primary text-2xl text-center font-semibold'>Create New Account</h1>
      {/* <input
          id='outlined-basic-1'
          variant='outlined'
          color='warning'
          label='Username'
          name='username'
          value={newUser.username}
          onChange={handleChange}
          error={!isValidUsername && true}
          helperText={!isValidUsername && 'Minimum 3 characters'}
        />
        <input
          id='outlined-basic-2'
          variant='outlined'
          color='warning'
          label='Email'
          name='email'
          value={newUser.email}
          onChange={handleChange}
          error={!isValidEmail && true}
          helperText={!isValidEmail && 'Invalid email address'}
        />
        <input
          id='outlined-basic-3'
          variant='outlined'
          color='warning'
          type='password'
          label='Password'
          name='password'
          value={newUser.password}
          onChange={handleChange}
          error={!isValidPassword && true}
          helperText={!isValidPassword && 'Minimum 6 characters'}
        />
        <input
          id='outlined-basic-4'
          variant='outlined'
          color='warning'
          type='password'
          label='Confirm password'
          name='confirmPassword'
          value={newUser.confirmPassword}
          onChange={handleChange}
          error={!isValidConfirmPassword && true}
          helperText={!isValidConfirmPassword && 'Passwords do not match'}
        /> */}
      <input
        type='email'
        name='email'
        placeholder='Email'
        className='border border-neutral-300 text-dark rounded-lg focus:outline-primary block w-full p-3'
        required
        value={newUser.email}
        onChange={handleChange}
      />
      <input
        type='text'
        name='username'
        placeholder='Username'
        className='border border-neutral-300 text-dark rounded-lg focus:outline-primary block w-full p-3'
        required
        value={newUser.username}
        onChange={handleChange}
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        className='border border-neutral-300 text-dark rounded-lg focus:outline-primary block w-full p-3'
        required
        value={newUser.password}
        onChange={handleChange}
      />
      <input
        type='password'
        name='confirmPassword'
        placeholder='Confirm Password'
        className='border border-neutral-300 text-dark rounded-lg focus:outline-primary block w-full p-3'
        required
        value={newUser.confirmPassword}
        onChange={handleChange}
      />
      <button
        type='button'
        className='text-white bg-primary hover:bg-primaryDark font-medium rounded-lg p-2.5 focus:outline-none w-full shadow-neutral-300 shadow-md'
      >
        Sign up
      </button>
      <span className='w-full block bg-neutral-300 h-[0.5px]' />
      <button
        type='button'
        className='text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg p-2.5 focus:outline-none w-full shadow-neutral-300 shadow-md'
        onClick={() => setIsSignUp(false)}
      >
        Back to sign in
      </button>
    </form>
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
