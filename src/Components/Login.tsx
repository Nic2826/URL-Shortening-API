import PopupWithForm from "./PopupWithForm"

type LoginProps = {
  onClose: () => void;
};
export default function Login({onClose}: LoginProps) {
    
  return (
        <PopupWithForm 
        PopupWithFormInput="Username"
        PopupWithFormInputPassword="Password"
        PopupWithFormTitle="Log in"
        buttonText="Log in"
        onClose={onClose} />
  )
}
