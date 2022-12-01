export function TempGetMovies() {
    return (
        fetch('http://10.0.2.2:3000/GetAllMovies')
        .then((res)=>console.log(res)
        )
        // .then((data)=>console.log(data))
    )
}