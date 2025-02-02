import { call, put, select, takeLeading } from 'redux-saga/effects';
import apiConfig from '../../apiConfig';
import { loginSelector } from '../userFarmSlice';
import { axios, getHeader } from '../saga';
import { createAction } from '@reduxjs/toolkit';
import {
  deleteCropVarietySuccess,
  postCropVarietySuccess,
  putCropVarietySuccess,
} from '../cropVarietySlice';
import history from '../../history';
import { postCropSuccess } from '../cropSlice';
import i18n from '../../locales/i18n';
import { enqueueErrorSnackbar, enqueueSuccessSnackbar } from '../Snackbar/snackbarSlice';

export const postVarietal = createAction(`postVarietalSaga`);

export function* postVarietalSaga({ payload: varietal }) {
  const { cropVarietyURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);

  try {
    const result = yield call(axios.post, cropVarietyURL + '/', { ...varietal, farm_id }, header);
    yield put(postCropVarietySuccess(result.data));
    history.push(`/crop/${result.data.crop_variety_id}/management`);
    yield put(enqueueSuccessSnackbar('Successfully saved varietal!'));
  } catch (e) {
    //TODO remove toastr messages
    if (e.response.data.violationError) {
      yield put(enqueueErrorSnackbar('Error: Varietal exists'));
      console.log('failed to add varietal to database');
    } else {
      console.log('failed to add varietal to database');
      yield put(enqueueErrorSnackbar('Error: failed to add varietal to database'));
    }
  }
}

export const postCropAndVarietal = createAction(`postCropAndVarietalSaga`);
export function* postCropAndVarietalSaga({ payload: cropData }) {
  const { cropURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);
  const varietyKeys = [
    'compliance_file_url',
    'crop_variety_name',
    'crop_variety_photo_url',
    'genetically_engineered',
    'lifecycle',
    'organic',
    'searched',
    'seeding_type',
    'supplier',
    'treated',
  ];
  const variety = Object.keys(cropData).reduce((acc, curr) => {
    if (varietyKeys.includes(curr)) {
      acc[curr] = cropData[curr];
      return acc;
    }
    return acc;
  }, {});
  const crop = Object.keys(cropData).reduce((acc, curr) => {
    if (varietyKeys.includes(curr)) {
      return acc;
    }
    acc[curr] = cropData[curr];
    return acc;
  }, {});
  crop.crop_group = crop.crop_group.value;
  const data = {
    crop: {
      ...crop,
      crop_photo_url: variety.crop_variety_photo_url,
      farm_id,
    },
    variety: {
      ...variety,
      farm_id,
    },
    farm_id,
  };
  try {
    const result = yield call(axios.post, `${cropURL}/crop_variety`, data, header);
    yield put(postCropVarietySuccess(result.data.variety));
    yield put(postCropSuccess(result.data.crop));
    history.push(`/crop/${result.data.variety.crop_variety_id}/management`);
    yield put(enqueueSuccessSnackbar('Successfully saved varietal!'));
  } catch (e) {
    if (e.response.data.violationError) {
      yield put(enqueueErrorSnackbar('Error: Varietal exists'));
      console.log('failed to add varietal to database');
    } else {
      console.log('failed to add varietal to database');
      yield put(enqueueErrorSnackbar('Error: failed to add varietal to database'));
    }
  }
}

export const patchVarietal = createAction(`patchVarietalSaga`);

export function* patchVarietalSaga({ payload: { variety_id, data } }) {
  const { cropVarietyURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);

  try {
    const result = yield call(
      axios.patch,
      `${cropVarietyURL}/${variety_id}`,
      { ...data, farm_id },
      header,
    );
    yield put(putCropVarietySuccess({ crop_variety_id: variety_id, ...data }));
    history.push(`/crop/${variety_id}/detail`);
    yield put(enqueueSuccessSnackbar(i18n.t('message:CROP_VARIETY.SUCCESS.UPDATE')));
  } catch (e) {
    yield put(enqueueErrorSnackbar(i18n.t('message:CROP_VARIETY.ERROR.UPDATE')));
    console.log('failed to update crop variety');
  }
}

export const deleteVarietal = createAction('deleteVarietalSaga');

export function* deleteVarietalSaga({ payload: { variety_id } }) {
  const { cropVarietyURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);
  try {
    const result = yield call(axios.delete, `${cropVarietyURL}/${variety_id}`, header);
    yield put(enqueueSuccessSnackbar(i18n.t('message:CROP_VARIETY.SUCCESS.DELETE')));
    history.push('/crop_catalogue');
    yield put(deleteCropVarietySuccess(variety_id));
  } catch (e) {
    console.log('failed to delete crop variety');
    yield put(enqueueErrorSnackbar(i18n.t('message:CROP_VARIETY.ERROR.DELETE')));
  }
}

export default function* varietalSaga() {
  yield takeLeading(postVarietal.type, postVarietalSaga);
  yield takeLeading(postCropAndVarietal.type, postCropAndVarietalSaga);
  yield takeLeading(patchVarietal.type, patchVarietalSaga);
  yield takeLeading(deleteVarietal.type, deleteVarietalSaga);
}
