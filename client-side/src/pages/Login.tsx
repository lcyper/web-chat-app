import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppProvider';
import styles from './Login.module.css'

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { nickName, setNickName } = useAppContext();
  const rememberMeChecked = localStorage.getItem('nickName') != undefined;

  const nickNameIsEmpty = nickName == '';
  useEffect(() => {
    if (localStorage.getItem('nickName') != null) {
      setNickName(localStorage.getItem('nickName') as string);

    }
  }, [nickNameIsEmpty, setNickName]);





  const handleLogin = (event: React.MouseEvent) => {
    event.preventDefault();
    // Lógica de autenticación en el boton
    setNickName(nickName)
    const rememberMe = document.getElementById('rememberMe') as HTMLInputElement;
    if (rememberMe != undefined && rememberMe.checked) {
      localStorage.setItem('nickName', nickName);
    } else {
      localStorage.removeItem('nickName')
    }
    navigate('/chat');
  };


  return (
    <form className={styles.formStyle}>
      <h1>Welcome to the Chat</h1>
      <label htmlFor="nickName">
        Enter your Nick Name:
      </label>
      <input type="text" name='nickName' defaultValue={nickName} onChange={(event) => setNickName(event.target.value)} />
      <span className={styles.checkbox}>
        <input type="checkbox" name="rememberMe" id="rememberMe" defaultChecked={rememberMeChecked} />
        {/* checked={localStorage.getItem('nickName') != undefined ? true : false} */}
        <label htmlFor="rememberMe">Remember me.</label>
      </span>
      <button className={styles.btnStyle} disabled={nickName.length == 0} onClick={handleLogin}>
        Enter the Chat Room
      </button>
    </form>
  );
};

export default Login;
