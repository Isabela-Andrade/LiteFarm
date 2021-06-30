import React from 'react';
import PureInterestedOrganic from '../../../components/InterestedOrganic';
import { useDispatch, useSelector } from 'react-redux';
import { patchInterested, postCertifiers } from '../saga';
import history from '../../../history';
import { certifierSurveySelector } from '../slice';

export default function UpdateInterestedOrganic() {
  const survey = useSelector(certifierSurveySelector);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const interested = data.interested;
    const callback = () =>
      interested ? history.push('/certification/selection') : history.push('/certification');
    if (survey.survey_id) {
      dispatch(patchInterested({ interested, callback }));
    } else {
      dispatch(postCertifiers({ survey: { interested }, callback }));
    }
  };

  const onGoBack = () => {
    history.push('/view_certification');
  };

  return (
    <>
      <PureInterestedOrganic
        onSubmit={onSubmit}
        onGoBack={onGoBack}
        defaultValues={{ interested: survey.interested }}
      />
    </>
  );
}
