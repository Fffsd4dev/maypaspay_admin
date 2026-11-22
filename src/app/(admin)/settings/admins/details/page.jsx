/**
 * Settings > Admins > one admin: profile, role permissions and actions.
 * Route: /settings/admins/:uuid (needs settings.admins)
 */
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { getAdmin } from '@/api/admins';
import { getErrorMessage } from '@/api/client';
import PageTitle from '@/components/PageTitle';
import { formatDateTime } from '@/utils/date';
import AdminActionsMenu from '../components/AdminActionsMenu';
import StatusBadge from '../components/StatusBadge';
import useRoles from '../useRoles';

const Detail = ({ label, children }) => (
  <div className="mb-3">
    <div className="text-muted fs-13">{label}</div>
    <div className="fw-medium">{children}</div>
  </div>
);

const AdminDetailsPage = () => {
  const { uuid } = useParams();
  const { roles } = useRoles();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAdmin(await getAdmin(uuid));
    } catch (err) {
      setError(err.response?.status === 404 ? 'This admin was not found.' : getErrorMessage(err, 'Could not load this admin.'));
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !admin) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <PageTitle title={admin?.name ?? 'Admin'} subTitle="Admins" />
      <Link to="/settings/admins" className="d-inline-block mb-3">
        ← Back to admins
      </Link>

      {error && <Alert variant="danger">{error}</Alert>}

      {admin && (
        <Row>
          <Col lg={4}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">{admin.name}</h5>
                    <div className="text-muted">{admin.email}</div>
                  </div>
                  <AdminActionsMenu admin={admin} roles={roles} onDone={load} />
                </div>
                <Detail label="Status">
                  <StatusBadge status={admin.status} isLocked={admin.is_locked} />
                </Detail>
                <Detail label="Role">{admin.role?.label}</Detail>
                <Detail label="Last sign-in">{formatDateTime(admin.last_login_at)}</Detail>
                <Detail label="Added">{formatDateTime(admin.created_at)}</Detail>
              </CardBody>
            </Card>
          </Col>

          <Col lg={8}>
            <Card>
              <CardBody>
                <h5 className="mb-1">Permissions</h5>
                <p className="text-muted fs-13">
                  These come from the <strong>{admin.role?.label}</strong> role. To change them, change the role.
                </p>
                {admin.permissions?.length ? (
                  <div className="d-flex flex-wrap gap-2">
                    {admin.permissions.map((permission) => (
                      <Badge key={permission} bg="light" text="dark" className="fs-13 fw-normal border">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">This role has no permissions.</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AdminDetailsPage;
