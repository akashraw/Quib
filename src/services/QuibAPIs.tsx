import { addBumpAPI, addQuibAPI, deleteBumpAPI, deleteQuibAPI, GetAllMoviesAPI, getFolloweeByUserIdAPI, getFollowersByUserIdAPI, getMovieByUserIdAPI, getMovieLengthAPI, getQuibByMovieAndUserIdAPI, GetQuibsByIdAPI, getUserByIdAPI, MostActiveQuibAPI, MoviePosterByIdAPI, RecentQuibMovieAPI } from "../constants/Api"

interface props {
    user: string;
    pass: string;
}
type BumpProp = {
    quibId: number,
    MovieId: number,
    userId: string,
}
type QuibProp = {
    MovieId: number,
    userId: string,
}
type QuibUserIdProp = {
    userId: string,
}
type PostQuibProp = {
    MovieId: number,
    body: string,
    userId: string,
    time: number,
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
//Get all the Quib by movie ID
export async function GetQuibsById(id: any) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        let json;
        let response = await fetch(`${GetQuibsByIdAPI}?MovieId=${id.MovieId}`, headerOptions);
        json = await response.json();
        return json;
    }
    catch (error) {
        console.log(error);

    }
}
//get movie poster

export async function getMoviePoster(id: any) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        let json;
        let response = await fetch(`${MoviePosterByIdAPI}?MovieId=${id.MovieId}`, headerOptions);
        json = await response.json();

        return json;
    }
    catch (error) {
        console.log(error);

    }
}

//getMovie length
export async function getMovieLength(id: any) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        let json;
        let response = await fetch(`${getMovieLengthAPI}?MovieId=${id.MovieId}`, headerOptions);
        json = await response.json();
        console.log(json)
        return json;
    }
    catch (error) {
        console.log(error);

    }
}

//get user profile
export async function getUserProfile(id: any) {

}

//add Bumb Quib
export async function AddBump(Bump: BumpProp) {
    console.log(Bump.MovieId, Bump.quibId, Bump.userId);

    const headerOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Bump.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        await fetch(`${addBumpAPI}?quibId=${Bump.quibId}&userId=${Bump.userId}&movieId=${Bump.MovieId}`, headerOptions);
        // json = await response.json();
        // console.log(response)
        return;
    }
    catch (error) {
        console.log(error);

    }

}

//Delete Bumb Quib
export async function DeleteBump(Bump: BumpProp) {
    console.log(Bump.MovieId, Bump.quibId, Bump.userId);

    const headerOptions = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Bump.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        await fetch(`${deleteBumpAPI}?quibId=${Bump.quibId}&userId=${Bump.userId}&movieId=${Bump.MovieId}`, headerOptions);
        // json = await response.json();
        return;
    }
    catch (error) {
        console.log(error);

    }
}

//Delete Quib by id
export async function DeleteQuib(QuibId:number) {
    const headerOptions = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        await fetch(`${deleteQuibAPI}?quibId=${QuibId}`, headerOptions);
        // json = await response.json();
        return;
    }
    catch (error) {
        console.log(error);

    }
}

//get Quib by user and movie ID
export async function QuibByMovieAndUserId(Quib: QuibProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getQuibByMovieAndUserIdAPI}?MovieId=${Quib.MovieId}&UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        console.log(json)
        return json;
    }
    catch (error) {
        console.log('my stream ' + error);

    }

}

export async function AddQuib(Quib: PostQuibProp) {
    const headerOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${addQuibAPI}?body=${Quib.body}&UserId=${Quib.userId}=${Quib.MovieId}&isSeedQuib=false&isSeedQuibType=null&isScreenShot=false&Time=${Quib.time}`, headerOptions);
        json = await response.json();
        console.log(json)
        // return json;
    }
    catch (error) {
        console.log('my stream ' + error);

    }

}

//Get Movie by userid
export async function getMovieByUserId(Quib: QuibUserIdProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getMovieByUserIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        console.log(json)
        return json;
    }
    catch (error) {
        console.log('my stream ' + error);

    }

}
//get follower list by user id
export async function getFollowersByUserId(Quib: QuibUserIdProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getFollowersByUserIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        console.log(json)
        return json;
    }
    catch (error) {
        console.log('my stream ' + error);

    }

}
export async function getFolloweeByUserId(Quib: QuibUserIdProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getFolloweeByUserIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        console.log(json)
        return json;
    }
    catch (error) {
        console.log('my stream ' + error);

    }

}
// Get user details 
export async function getUserById(Quib: QuibUserIdProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getUserByIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        console.log(json)
        return json;
    }
    catch (error) {
        console.log('my stream ' + error);

    }

}