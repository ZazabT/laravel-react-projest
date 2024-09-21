import  {createBrowserRouter} from 'react-router-dom';
import Login from './views/LoginPage';
import Register from './views/RegisterPage';
import Error404 from './views/Error404';

const router  =createBrowserRouter(
    [
      {
        path: '/login',
        element:<Login/>
      },

      {
        path:'/register',
        element:<Register/>
      },

      {
        path:'*',
        element:<Error404/>
      }

    ]
);


export default router;