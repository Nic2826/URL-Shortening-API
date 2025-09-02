import { useAuth } from '../Contexts/AuthContext';

export default function Main() {
  const { isLoggedIn, userName } = useAuth();

  return (

    <div className="main">

      <p className='main__username'>{isLoggedIn ? `Welcome, ${userName}`:"" }</p>
      
    
      <h1 className="main__title">More than just 
        <br></br>
        shorter links</h1>

      <p className="main__description">
        Build your brand's recognition and get detailed 
        <br></br>
        insights on how your
        links are performing
      </p>

      <img className="main__img" src="/public/images/illustration-working.svg" alt="" />
    </div>
  );
}
