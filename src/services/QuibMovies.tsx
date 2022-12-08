import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAllMoviesAPI } from "../constants/Api"

export function GetAllMovies() {
    const headerOptions = {
        method: 'GET',
        headers: {
            'set-cookie': 'ASP.NET_SessionId=s1hrebp1s1mxjiogfek4u5ox; AppNameCookie=95040BF229181347A15DDAA7F663964B30388669EBDE938AB4F9365FF39200FC462DC4F73D081D7F53F021BF9871F93D825376AEA0783E49D1D937A1B010D8F1F86882F2A548BA2624BF0DCB85B7B0F2C3A25B821C2665F4C37223BA2C6D30651F789FA590374380480CA2D10A94DA08'
        },

    }
    let a: any;
    AsyncStorage.getItem('token').then((value: any) => {
        a = value;
    })
    console.log(a);
    fetch('http://www.quibs.com/ChooseMovie/GetAllMovies', headerOptions)
        .then(response => response.json())
        .then((json) => { console.log(json.title) })
        .catch(err => {
            console.log(err);
        })
}
