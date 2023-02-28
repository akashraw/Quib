import { addBumpAPI, addQuibAPI, deleteBumpAPI, deleteQuibAPI, FollowUserAPI, GetAllMoviesAPI, getFolloweeByUserIdAPI, getFollowersByUserIdAPI, getMovieByIdAPI, getMovieByUserIdAPI, getMovieLengthAPI, getQuibByMovieAndUserIdAPI, GetQuibsByIdAPI, getUserByIdAPI, MostActiveQuibAPI, MoviePosterByIdAPI, RecentQuibMovieAPI, UnFollowUserAPI } from "../constants/Api"

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
type QuibUnfollow = {
    FollowerId: string,
    FolloweeId: string,

}
type QuibFollow = {
    FollowerId: string,
    FolloweeId: string,

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
        return json;
    } catch (error) {
        console.log('getRecentMovies API error: ' + error);

    }


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
        return json;

    } catch (error) {
        console.log('getMostActiveMovies API Error: ' + error);
    }
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
        console.log('getAllMovies API Error: ' + error);

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
        console.log('GetQuibsById API error: ' + error);

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
        let response = await fetch(`${MoviePosterByIdAPI}?MovieId=${id}`, headerOptions);
        json = await response.json();

        return json;
    }
    catch (error) {
        console.log('getMoviePoster API ERROR: ' + error);

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
        console.log('getMovieLength API Error: ' + error);

    }
}

//get user profile
export async function getUserProfile(id: any) {

}

//add Bumb Quib
export async function AddBump(Bump: BumpProp) {
    const headerOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        await fetch(`${addBumpAPI}?quibId=${Bump.quibId}&userId=${Bump.userId}&movieId=${Bump.MovieId}`, headerOptions);
        // let json = await response.json();
        // console.log(json)
    }
    catch (error) {
        console.log('AddBump API error: ' + error);

    }

}

//Delete Bumb Quib
export async function DeleteBump(Bump: BumpProp) {
    // Bump.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    console.log(Bump.MovieId, Bump.quibId, Bump.userId);

    const headerOptions = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        await fetch(`${deleteBumpAPI}?quibId=${Bump.quibId}&userId=${Bump.userId}&movieId=${Bump.MovieId}`, headerOptions);
        // json = await response.json();
        // return;
    }
    catch (error) {
        console.log('DeleteBump API error: ' + error);

    }
}

//Delete Quib by id
export async function DeleteQuib(QuibId: number) {
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
        // return;
    }
    catch (error) {
        console.log('DeleteQuib API error: ' + error);

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
    // Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getQuibByMovieAndUserIdAPI}?MovieId=${Quib.MovieId}&UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        // console.log(json)
        return json;
    }
    catch (error) {
        console.log('QuibByMovieAndUserId API error: ' + error);

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
    console.log(Quib.body)
    // Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    // console.log(Quib.tim
    try {
        let json;
        let response = await fetch(`${addQuibAPI}?body=${Quib.body}&UserId=${Quib.userId}&MovieId=${Quib.MovieId}&isSeedQuib=false&isSeedQuibType=null&isScreenShot=false&Time=${Quib.time}`, headerOptions);
        json = await response.json();
        console.log(json)
        // return json;
    }
    catch (error) {
        console.log('AddQuib API error: ' + error);

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
    // Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getMovieByUserIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        // console.log(json)
        return json;
    }
    catch (error) {
        console.log('getMovieByUserId Api Error: ' + error);

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
    // Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getFollowersByUserIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        // console.log(json)
        return json;
    }
    catch (error) {
        console.log('getFollowerByUserId Api :' + error);

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
    // Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getFolloweeByUserIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        return json;
    }
    catch (error) {
        console.log('getFolloweeByUserId Api  ' + error);

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


    try {
        let json;
        let response = await fetch(`${getUserByIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        return json;
    }
    catch (error) {
        console.log('getUserById Api error ' + error);
    }

}

// Get other user details 
export async function getOtherUserById(Quib: QuibUserIdProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    try {
        let json;
        let response = await fetch(`${getUserByIdAPI}?UserId=${Quib.userId}`, headerOptions);
        json = await response.json();
        return json;
    }
    catch (error) {
        console.log('getOtherUserById api error ' + error);

    }

}

// unFollow a user 
export async function UnFollowUser(Quib: QuibUnfollow) {
    const headerOption = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    try {
        // let json;
        await fetch(`${UnFollowUserAPI}?FollowerId=${Quib.FollowerId}&FolloweeId=${Quib.FolloweeId}`, headerOption);
        // json = await response.json();
    } catch (error) {
        console.log('unFollowUser Api call: ' + error)
    }

}
// Follow a user 
export async function FollowUser(Quib: QuibFollow) {
    const headerOption = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    try {
        // let json;
        await fetch(`${FollowUserAPI}?FollowerId=${Quib.FollowerId}&FolloweeId=${Quib.FolloweeId}`, headerOption);
        // json = await response.json();
        // return json;
    } catch (error) {
        console.log('FollowUser Api call: ' + error)
    }

}

// Get other user details 
export async function GetMovieById(Quib: QuibProp) {
    const headerOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    }
    // Quib.userId = 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c';
    try {
        let json;
        let response = await fetch(`${getMovieByIdAPI}?MovieId=${Quib.MovieId}`, headerOptions);
        json = await response.json();
        return json;
    }
    catch (error) {
        console.log('GetMovieById api error ' + error);

    }

}