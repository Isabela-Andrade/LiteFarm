import { useSelector } from 'react-redux';
import { selectedCertificationSelector } from '../organicCertifierSurveySlice';
import { certifierSurveySelector } from '../slice';
import { PureViewNotInterestedInCertification } from '../../../components/ViewCertification/PureViewNotInterestedInCertification';
import { PureViewUnsupportedCertification } from '../../../components/ViewCertification/PureViewUnsupportedCertification';
import { PureViewSupportedCertification } from '../../../components/ViewCertification/PureViewSupportedCertification';
import { certifiersByCertificationSelector } from '../certifierSlice';

export default function ViewCertification({ history }) {
  const { interested } = useSelector(certifierSurveySelector);

  const certification = useSelector(selectedCertificationSelector);

  const allSupportedCertifierTypes = useSelector(
    certifiersByCertificationSelector(certification.certification_id),
  );
  const isNotSupported =
    certification.certificationName === 'Other' || allSupportedCertifierTypes.length < 1;
  const onExport = () => {};
  const onAddCertification = () => history.push('/certification/interested_in_organic');
  const onChangePreference = onAddCertification;

  return (
    <>
      {!interested ? (
        <PureViewNotInterestedInCertification
          onAddCertification={onAddCertification}
          onExport={onExport}
        />
      ) : isNotSupported ? (
        <PureViewUnsupportedCertification
          onChangePreference={onChangePreference}
          onExport={onExport}
        />
      ) : (
        <PureViewSupportedCertification
          onChangePreference={onChangePreference}
          onExport={onExport}
        />
      )}
    </>
  );
}
