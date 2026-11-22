/**
 * My account: the signed-in admin's profile, role and permissions (from GET /admin/auth/me).
 * Route: /account (any signed-in admin)
 */
import { useState } from 'react';
import { Badge, Button, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/api/client';
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import StatusBadge from '@/app/(admin)/settings/admins/components/StatusBadge';
import { formatDateTime } from '@/utils/date';
import { getInitials } from '@/utils/format';
import { groupByArea, groupTitle } from '@/utils/permissions';

const Detail = ({ label, children }) => (
  <div className="d-flex justify-content-between py-2 border-bottom border-light">
    <span className="text-muted">{label}</span>
    <span className="fw-medium text-end">{children}</span>
  </div>
);

const AccountPage = () => {
  const { admin, refreshAdmin } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await refreshAdmin();
      toast.success('Your account details are up to date.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not refresh your account.'));
    } finally {
      setRefreshing(false);
    }
  };

  if (!admin) return null;
  const groups = groupByArea(admin.permissions);

  return (
    <>
      <PageTitle title="My account" />

      <Row>
        <Col lg={4}>
          <Card>
            <CardBody>
              <div className="text-center mb-3">
                <span
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold fs-22 mb-2"
                  style={{ width: 72, height: 72 }}
                >
                  {getInitials(admin.name)}
                </span>
                <h4 className="mb-1">{admin.name}</h4>
                <div className="text-muted">{admin.email}</div>
              </div>

              <Detail label="Role">{admin.role?.label}</Detail>
              <Detail label="Status">
                <StatusBadge status={admin.status} isLocked={admin.is_locked} />
              </Detail>
              <Detail label="Last sign-in">{formatDateTime(admin.last_login_at)}</Detail>
              <Detail label="Member since">{formatDateTime(admin.created_at)}</Detail>

              <div className="d-grid gap-2 mt-3">
                <Link to="/settings/change-password" className="btn btn-light">
                  <IconifyIcon icon="tabler:key" className="me-1" /> Change password
                </Link>
                <Button variant="light" onClick={refresh} disabled={refreshing}>
                  {refreshing ? <Spinner size="sm" /> : <><IconifyIcon icon="tabler:refresh" className="me-1" /> Refresh details</>}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <CardBody>
              <h5 className="mb-1">What you can access</h5>
              <p className="text-muted fs-13">
                {admin.is_super_admin
                  ? 'You are a super admin, so you have every permission.'
                  : `These come from your role (${admin.role?.label}). Ask a super admin if you need more access.`}
              </p>

              {Object.keys(groups).length === 0 ? (
                <p className="text-muted mb-0">Your role has no permissions yet.</p>
              ) : (
                <Row className="g-3">
                  {Object.entries(groups).map(([area, permissions]) => (
                    <Col md={6} key={area}>
                      <div className="border rounded p-3 h-100">
                        <h6 className="mb-2">{groupTitle(area)}</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {permissions.map((permission) => (
                            <Badge key={permission} bg="light" text="dark" className="fw-normal border">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AccountPage;