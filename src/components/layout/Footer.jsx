import { APP_NAME, currentYear } from '@/context/constants';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="page-container text-center text-md-start">
        {currentYear} © {APP_NAME}
      </div>
    </footer>
  );
};

export default Footer;
