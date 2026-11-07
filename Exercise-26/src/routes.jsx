import { createBrowserRouter } from "react-router";
import App from './App';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Categories from './pages/Categories';
import NotFound from './components/NotFound';
import RecipesUser from "./pages/RecipesUser";



export const router = createBrowserRouter([
    {
        pat: "/",
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "recipes",
                element: <Recipes/>
            },
            {
                path: "recipes:id",
                element: <RecipesUser/>
            },
            {
                path: "categories",
                element: <Categories/>
            },
        ]
    }
])