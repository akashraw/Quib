import { GetAllMoviesAPI, MostActiveQuibAPI, RecentQuibMovieAPI } from "../constants/Api"

interface props {
    user: string;
    pass: string;
}

export async function Login(props: props) {

}
//get the list of recent quib movie by user
export async function getRecentMovies() {
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

    } catch (error) {
        console.log(error);

    }

    return json;
}
//get the list of Most Active Quib
export async function getMostActiveMovies() {
    let json;
    const headerOptions = {
        method: 'GET',
        Headers: {
            Accept: 'application/json'
        }
    }
    try {
        let response = await fetch(MostActiveQuibAPI, headerOptions);
        json = await response.json()
    } catch (error) {
        console.log(error);
    }
    return json;
}
//get list of all movies
export async function getAllMovies() {
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

