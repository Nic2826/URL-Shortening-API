import Popup from "./Popup"
type SignupProps = {
  onClose: () => void;
};
export default function Signup({onClose}:SignupProps) {
  return (
   <Popup 
          popupInput="Email"
          popupInputPassword="Password"
          popupTitle="Sign Up"
          buttonText="Sign Up"
          onClose={onClose} 
          />
          
  )
}
