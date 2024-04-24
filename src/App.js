import React, { useEffect, useState,useCallback } from "react";
import Form from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App(props) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [error,setError]=useState(null)

  
const moviesHandler=async(movie)=>
{
 const res=await fetch('https://react-http-76e5c-default-rtdb.firebaseio.com/movies.json',{
    method:'post',
    body:JSON.stringify(movie),
    headers:{
      'Context-Type':'application/json'
    }
  })

  let content=await res.json()
  console.log(content)
  fetchMoviesHandler()
}


  const deleteMovieHandler=async(id)=>
  {
    console.log(id)

    let res= await fetch(`https://react-http-76e5c-default-rtdb.firebaseio.com/movies/${id}.json`,{
      method:'DELETE',
      headers:{
        'Context-Type':'application/json'
      }
    })

    let deleteRes=await res.json()

    console.log(deleteRes)
    fetchMoviesHandler()
  }


  const  fetchMoviesHandler=useCallback(async() =>{
    setIsLoading(true);
    setError(null)
    let res = await fetch("https://react-http-76e5c-default-rtdb.firebaseio.com/movies.json"); 
    try {
     
      console.log(res)

      if(!res.ok)
      {
        throw new Error('Something Went Wrong...Retrying')
      }

      let fetchMovies = await res.json(); 

      console.log(fetchMovies)

//here we are getting fetchMovies as object like: fetchMovies={a:{b:1,c:2,d:3}}
//i.e object with key "a", and this key contain value which is object {b:1,c:2,d:3}



      let addedMovies=[];

      for(const key in fetchMovies)
      {
        addedMovies.push({
          id:key,
          title:fetchMovies[key].title,
          openingText:fetchMovies[key].openingText,
          releaseDate:fetchMovies[key].releaseDate
        })
      }



      // let transformedMovies = fetchMovies.results.map((data) => {
      //   return {
      //     id: data.episode_id, 
      //     title: data.title,
      //     openingText: data.opening_crawl,
      //     releaseDate: data.release_date,
      //   };
      // });

      // console.log(transformedMovies)
      setMovies(addedMovies);
    } catch (err) {
      console.log(err);
      setError(err.message)
    }
    setIsLoading(false);
  },[])


  useEffect(()=>
  {
    fetchMoviesHandler()
  },[fetchMoviesHandler])

  //here we are using useEffect( ), so that when page load initially fetchMoviesHandler function get called and print movies
  // fetchMoviesHandler pass as dependency because if it may change in future due to external state then useEffect will execute again
  // Also we wrap this function inside callBack() because function is an object i.e refrence data type and js take it differnt not same therefor we use usecallback() so that react will not re-read it again, it will get re readed if its value change 


  let content=<p>No Movies</p>


  if(isLoading)
  {
    content=<p>Loading...</p>
  }

  if(!isLoading && movies.length>0 )
  {
    content=  <MoviesList movies={movies} deleteId={deleteMovieHandler} />
  }

  if(!isLoading && movies.length===0)
  {
    content=<p>Found no movies</p>
  }
  if(!isLoading && error)
  {
    content=<p>{error}<button onClick={clearIntervalHandler}>Cancel</button></p>
   let ID= setTimeout(()=>
    {
      fetchMoviesHandler()
    },5000);

  function clearIntervalHandler()
  {
    clearInterval(ID)
    
  }
  }
 

 


  return (
    <React.Fragment>
       <Form newMovies={moviesHandler}/>
      <section>
       
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {! isLoading && <MoviesList movies={movies} />}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>} */}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;