import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import SimpleReactLightbox from 'simple-react-lightbox';
import { GlobalProvider } from './context/GlobalContext';
import HomePage from './routes/home';
// import MapPage from './pages/MapPage';
// import UserMapPage from './pages/UserMapPage';
// import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <GlobalProvider>
      {/* <SimpleReactLightbox> */}
      <Routes>
        <Route exact path='/' component={HomePage}></Route>
        {/* <Route exact path='/map' component={MapPage}></Route>
              <Route path='/maps/:id' component={UserMapPage}></Route>
              <Route path='/*' component={NotFoundPage}></Route> */}
      </Routes>
      {/* </SimpleReactLightbox> */}

      <ToastContainer
        position='bottom-left'
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        transition={Slide}
      />
    </GlobalProvider>
  );
}
