import { GetAllMoviesAPI } from "../constants/Api"
import CookieManager from '@react-native-cookies/cookies';

// set a cookie
export interface Cookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    version?: string;
    expires?: string;
    secure?: boolean;
    httpOnly?: boolean;
  }
  
  export interface Cookies {
    [key: string]: Cookie;
  }

export function GetAllMovies() {
    CookieManager.set('http://www.quibs.com/ChooseMovie/GetAllMovies', {
        name: 'AppNameCookie',
        value: '95040BF229181347A15DDAA7F663964B30388669EBDE938AB4F9365FF39200FC462DC4F73D081D7F53F021BF9871F93D825376AEA0783E49D1D937A1B010D8F1F86882F2A548BA2624BF0DCB85B7B0F2C3A25B821C2665F4C37223BA2C6D30651F789FA590374380480CA2D10A94DA08',
        domain: 'http://www.quibs.com/',
        path: '/',
        version: '1',
        expires: '2024-05-30T12:30:00.00-05:00'
    }).then((done) => {
        console.log('CookieManager.set =>', done);
    });
    // CookieManager.setFromResponse(
    //     GetAllMoviesAPI,
    //     'user_session=abcdefg; path=/; expires=Thu, 1 Jan 2030 00:00:00 -0000; secure; HttpOnly')
    //       .then((success) => {
    //         console.log('CookieManager.setFromResponse =>', success);
    //       });
    const headerOptions = {
        method: 'GET',
        headers: {
            'cookie': 'ASP.NET_SessionId=s1hrebp1s1mxjiogfek4u5ox; AppNameCookie=95040BF229181347A15DDAA7F663964B30388669EBDE938AB4F9365FF39200FC462DC4F73D081D7F53F021BF9871F93D825376AEA0783E49D1D937A1B010D8F1F86882F2A548BA2624BF0DCB85B7B0F2C3A25B821C2665F4C37223BA2C6D30651F789FA590374380480CA2D10A94DA08'
        },

    }
    // fetch('http://www.quibs.com/ChooseMovie/GetAllMovies', headerOptions)
    //     .then(response => response.json())
    //     .then((json) => { console.log(json.title) })
    //     .catch(err => {
    //         console.log(err);
    //     })
}
