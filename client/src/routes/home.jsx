import { useState, useContext } from 'react';
import { redirect, Link } from 'react-router-dom';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
// import Loader from '../components/Loader';
import GlobalContext from '../context/GlobalContext';

export default function Home() {
  const { isLoading, authUser } = useContext(GlobalContext);
  const [isSignUp, setIsSignUp] = useState(false);

  const year = new Date().getFullYear();

  if (authUser) return redirect('/map');

  return (
    <div className='flex flex-col min-h-screen px-6 md:px-10 gap-12 bg-cover'>
      <img className='w-10 mt-6' src='/img/pin_logo_s.png' alt='pin_my_map_logo' />
      <div className='flex-1 flex items-center justify-center'>
        <div className='flex flex-col gap-16 items-center lg:flex-row lg:items-start lg:gap-20 lg:pb-32'>
          <div className='max-w-lg text-center space-y-6 lg:text-left lg:w-2/5'>
            <h1 className='text-5xl font-bold text-primary sm:text-5xl'>Pin My Map</h1>
            <h2 className='text-2xl font-semibold text-dark'>Your World, Your Way.</h2>
            <h2 className='text-dark text-lg font-medium'>
              Create a personalised map of your world. Mark your favorite spots, travel footprints and explore new places. Pin your world your way – the
              possibilities are endless.
            </h2>
            <Link
              className='text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg p-2.5 focus:outline-none w-36 block mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
              to='/maps/1' // 1 is the ID of user named demo
            >
              View demo
            </Link>
          </div>
          {isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <SignIn setIsSignUp={setIsSignUp} />}
          {isLoading && <Loader />}
        </div>
      </div>
      <footer className='w-full text-center text-neutral-500 text-xs mb-4'>
        <p>{`© ${year} Pin My Map. All rights reserved.`}</p>
      </footer>
      <img src='../../public/img/background.jpg' className='fixed inset-0 object-cover h-full -z-10 opacity-20 object-left' />
    </div>
  );
}

// const Background = styled.img`
//   position: fixed;
//   left: 0;
//   top: 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   filter: opacity(0.25);
//   z-index: -1;
// `;

// const TitleWrapper = styled.div`
//   margin: 0 5vw 3vw 5vw;
//   width: 400px;

//   @media (max-width: 768px) {
//     width: 360px;
//     margin: 100px 0 50px 0;
//     text-align: center;
//   }

//   h1 {
//     color: #ed6c02;
//     font-weight: 700;
//     font-size: 60px;

//     @media (max-width: 500px) {
//       font-size: 48px;
//     }
//   }

//   h2 {
//     color: #212121;
//     font-weight: 500;
//     font-size: 24px;
//     line-height: 32px;
//     margin-top: 20px;
//   }

//   button {
//     margin-top: 20px;
//   }

//   a {
//     text-decoration: none;
//   }
// `;

// const FormWrapper = styled.div`
//   margin: 0 5vw;

//   @media (max-width: 768px) {
//     margin: 0 0 0 0;
//   }
// `;
