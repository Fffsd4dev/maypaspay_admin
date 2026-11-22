/**
 * Shared layout for every auth screen (login, code, logout).
 * Change the logo or footer here once and every auth page updates.
 * (React 19 moves the <title> below into the document head automatically.)
 */
import { Card, Col, Row } from 'react-bootstrap';
import logoDark from '@/assets/images/logo-dark.png';
import logo from '@/assets/images/logo.png';
import { APP_NAME, currentYear } from '@/context/constants';

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <title>{`${title} | ${APP_NAME}`}</title>

      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xl={4} lg={5} md={6}>
          <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
            <div className="auth-brand mb-4">
              <img src={logoDark} alt={APP_NAME} height={26} className="logo-dark" />
              <img src={logo} alt={APP_NAME} height={26} className="logo-light" />
            </div>

            <h4 className="fw-semibold mb-2 fs-18">{title}</h4>
            {subtitle && <p className="text-muted mb-4">{subtitle}</p>}

            {children}

            <p className="mt-auto mb-0 text-muted fs-13">
              {currentYear} © {APP_NAME}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuthCard;
