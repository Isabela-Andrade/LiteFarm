import { call, select, takeLeading } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import apiConfig from '../../../apiConfig';
import { loginSelector } from '../../userFarmSlice';
import { axios, getHeader } from '../../saga';
import { toastr } from 'react-redux-toastr';
import i18n from '../../../locales/i18n';

export const archiveDocument = createAction(`archiveDocumentSaga`);

export function* archiveDocumentSaga({ payload: document_id }) {
  const { documentUrl } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);
  try {
    const documentUrl = 'localhost:5000/document';
    const result = yield call(axios.patch, `${documentUrl}/${document_id}`, {}, header);
    if (result) {
      // yield put(archiveFileSuccess(resDocument));
    } else {
      toastr.error(i18n.t('message:ATTACHMENTS.ERROR.FAILED_archive'));
    }
  } catch (e) {
    toastr.error(i18n.t('message:ATTACHMENTS.ERROR.FAILED_archive'));
    console.log(e);
  }
}

export default function* managementPlanSaga() {
  yield takeLeading(archiveDocument.type, archiveDocumentSaga);
}
