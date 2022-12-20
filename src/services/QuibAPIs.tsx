import { GetAllMoviesAPI, RecentQuibMovieAPI } from "../constants/Api"

interface props {
    user: string;
    pass: string;
}

export async function Login(props: props) {

}
//get the list of recent quib movie by user
export async function RecentQuib() {
    const headerOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    }
    let json;
    try {
        let response = await fetch(RecentQuibMovieAPI, headerOptions);
        json = await response.json()
        console.log(json);

    } catch (error) {
        console.log(error);

    }

    return json;
}

//get list of all movies
export async function GetAllMovies() {
    const headerOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    }
    let json;
    try {
        let response = await fetch(GetAllMoviesAPI, headerOptions);
        json = await response.json()

    } catch (error) {
        console.log(error);

    }

    return json;
}

