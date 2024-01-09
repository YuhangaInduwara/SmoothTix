isAuthenticated().then(result => {
    if (result === true) {
        const jwtToken = localStorage.getItem('jwtToken');
        const decodedToken = decodeJWT(jwtToken);
        const privilege_level = decodedToken.user_role;
        console.log(privilege_level)
        changePage(privilege_level)
    } else {
        console.log('Unauthenticated');
    }
});