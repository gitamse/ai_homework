import styles from './Button.module.css';

function Button({ onClick, children, isActive }) {
  return (
    <button
      className={isActive ? styles.active : styles.button}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export default Button;
