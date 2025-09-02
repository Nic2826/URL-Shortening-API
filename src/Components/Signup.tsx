import PopupWithForm from "./PopupWithForm"
type SignupProps = {
  onClose: () => void;
};
export default function Signup({onClose}:SignupProps) {

  
  return (
   <PopupWithForm 
          PopupWithFormInput="Email"
          PopupWithFormInputPassword="Password"
          PopupWithFormTitle="Sign Up"
          buttonText="Sign Up"
          onClose={onClose} 
          />
          
  )
}
