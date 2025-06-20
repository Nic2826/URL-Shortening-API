import Popup from "./Popup"

type LoginProps = {
  onClose: () => void;
};
export default function Login({onClose}: LoginProps) {
    
  return (
        <Popup 
        popupInput="Username"
        popupInputPassword="Password"
        popupTitle="Log in"
        buttonText="Log in"
        onClose={onClose} />
  )
}
