import { Link } from 'react-router-dom';
import IconifyIcon from './wrappers/IconifyIcon';
import { APP_NAME, DEFAULT_PAGE_TITLE } from '@/context/constants';
const PageTitle = ({
  title,
  subTitle
}) => {
  const defaultTitle = DEFAULT_PAGE_TITLE;
  return <>
      <title>{title ? `${title} | ${APP_NAME}` : defaultTitle}</title>
      <div className="page-title-head d-flex align-items-center gap-2">
        <div className="flex-grow-1">
          <h4 className="fs-16 text-uppercase fw-bold mb-0">{title}</h4>
        </div>
        <div className="text-end">
          <ol className="breadcrumb m-0 py-0 fs-13">
            <li className="breadcrumb-item"><Link to="/dashboard">MaypasPay</Link></li>
            <div className='mx-1  flex-centered'>
              <IconifyIcon className='mt-0' icon='tabler:chevron-right' height={12} width={12} />
            </div>
            {subTitle && <>
                <li className="breadcrumb-item"><Link to="">{subTitle}</Link></li>
                <div className='mx-1  flex-centered'>
                  <IconifyIcon className='mt-0' icon='tabler:chevron-right' height={12} width={12} />
                </div>
              </>}
            <li className="breadcrumb-item active">{title}</li>
          </ol>
        </div>
      </div>
    </>;
};
export default PageTitle;