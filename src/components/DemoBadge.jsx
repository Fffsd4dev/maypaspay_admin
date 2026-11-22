import { Badge } from 'react-bootstrap';

/**
 * Marks a widget that still shows sample data, so nobody mistakes it for real figures.
 * Remove it from a widget once that widget is connected to the API.
 */
const DemoBadge = () => (
  <Badge bg="secondary-subtle" text="secondary" className="fw-normal fs-11 text-uppercase" title="Sample data — not connected to the API yet">
    Demo data
  </Badge>
);

export default DemoBadge;