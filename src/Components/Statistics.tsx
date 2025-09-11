import Card from './Card';
import { useAuth } from '../Contexts/AuthContext';


export default function Statistics() {
  const { isLoggedIn, userInfo } = useAuth();

  return (
    <div className='Statistics'>
        <h2 className='Statistics__title'>Advanced Statistics</h2>
        <p className='Statistics__description'>Track how your links are performing across the web with 
            <br />
            our advanced statistics dashboard.</p>
            <p>{isLoggedIn && userInfo ? ` ${userInfo.linksCount}` : ""}</p>
            <div className='Statistics__cards'>
            <Card src='icon-brand-recognition.svg' alt='Brand Recognition' title='Brand Recognition' description='Boost your brand recognition with each click. Generic links don’t mean a thing. Branded links help instil confidence in your content.'/>
            <Card src='icon-detailed-records.svg' alt='Detailed Records' title='Detailed Records' description='Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.'/>
            <Card src='icon-fully-customizable.svg' alt='Fully Customizable' title='Fully Customizable' description='Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.'/>
            </div>
    </div>
  )
}
