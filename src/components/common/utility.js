const isLoggedIn = () => {
    return !!getCookie('loginToken');
}

const setLogIn = (value) => {
    return sessionStorage.setItem('isLoggedIn', value);
}

const getUserData = () => {
    return JSON.parse(sessionStorage.getItem('userData'));
}

const setUserData = (value) => {
    return sessionStorage.setItem('userData', JSON.stringify(value));
}

const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname = 'loginToken') => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const deleteCookie = (key, domain = null, path = '/') => {
    const domainPart = domain ? `domain=${domain};` : '';

    document.cookie = `${key}=;${domainPart}path=${path};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

export { isLoggedIn, setLogIn, getUserData, setUserData, setCookie, getCookie, deleteCookie };