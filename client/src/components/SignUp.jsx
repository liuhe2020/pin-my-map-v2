import { useState, useContext } from 'react';
// import styled from 'styled-components';
// import { styled as muiStyled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import GlobalContext from '../context/GlobalContext';

export default function SignUp({ setIsSignUp }) {
  const { setAuthUser, setIsLoading } = useContext(GlobalContext);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setIsValidUsername(true);
    setIsValidEmail(true);
    setIsValidPassword(true);
    setIsValidConfirmPassword(true);

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
    <div className='w-full max-w-sm lg:max-w-md px-6 py-8 xs:p-10 bg-white shadow-neutral-200 shadow-lg border border-neutral-100 rounded-lg'>
      <h1 className='text-primary text-2xl text-center'>Create New Account</h1>
      <form className='flex flex-col items-center'>
        <input
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
        />
        <button variant='contained' color='warning' style={{ width: '100%' }} onClick={handleSubmit}>
          Sign up
        </button>
        <button variant='contained' color='primary' onClick={() => setIsSignUp(false)}>
          Back to login
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
