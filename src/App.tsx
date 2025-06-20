import Header from "./Components/Header";
import Main from "./Components/Main";
import Shortener from "./Components/Shortener";
import Statistics from './Components/Statistics';

export default function App() {
  return (
    <div>
      <Header />

      <Main />
      <Shortener />
      <Statistics/>
    </div>
  );
}
