import {
  ADD_FERTILIZER,
  ADD_FERTILIZER_LOG,
  EDIT_FERTILIZER_LOG,
  GET_FERTILIZERS,
} from './constants';
import { getFertilizers, setFertilizersInState } from './actions';
import { call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';
import apiConfig from '../../../apiConfig';
import history from '../../../history';
import { loginSelector } from '../../userFarmSlice';
import { axios, getHeader } from '../../saga';
import i18n from '../../../locales/i18n';
import { enqueueErrorSnackbar, enqueueSuccessSnackbar } from '../../Snackbar/snackbarSlice';

export function* getFertilizerSaga() {
  const { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);
  const { fertUrl } = apiConfig;
  try {
    const result = yield call(axios.get, fertUrl + '/farm/' + farm_id, header);
    if (result) {
      yield put(setFertilizersInState(result.data));
    }
  } catch (e) {
    console.log('fail to fetch fertilizers');
  }
}

export function* addFertilizerToDB(payload) {
  const { fertUrl } = apiConfig;
  const { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);

  let fertConfig = payload.fertConfig;
  let fert = {
    fertilizer_type: 'CUSTOM - ' + fertConfig.fertilizer_type,
    farm_id: farm_id,
    moisture_percentage: parseFloat(fertConfig.moisture_percentage),
    n_percentage: parseFloat(fertConfig.n_percentage),
    p_percentage: parseFloat(fertConfig.p_percentage),
    k_percentage: parseFloat(fertConfig.k_percentage),
    nh4_n_ppm: parseFloat(fertConfig.nh4_n_ppm),
  };

  try {
    const result = yield call(axios.post, fertUrl + '/farm/' + farm_id, fert, header);
    if (result) {
      fertConfig.fertilizer_id = result.data.fertilizer_id;
      yield put(getFertilizers());
    }
  } catch (e) {
    console.log('failed to add fert');

    yield put(enqueueErrorSnackbar(i18n.t('message:FERTILIZER.ERROR.ADD')));
  }
}

export function* addLog(payload) {
  const { logURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);

  let fertConfig = payload.fertConfig;
  let log = {
    activity_kind: fertConfig.activity_kind,
    date: fertConfig.date,
    user_id: user_id,
    quantity_kg: fertConfig.quantity_kg,
    crops: fertConfig.crops,
    locations: fertConfig.locations,
    fertilizer_id: parseInt(fertConfig.fertilizer_id, 10),
    notes: fertConfig.notes,
  };

  try {
    const result = yield call(axios.post, logURL, log, header);
    if (result) {
      history.push('/log');
      yield put(enqueueSuccessSnackbar(i18n.t('message:LOG.SUCCESS.ADD')));
    }
  } catch (e) {
    console.log('failed to add log');
    yield put(enqueueErrorSnackbar(i18n.t('message:LOG.ERROR.ADD')));
  }
}

export function* editLog(payload) {
  const { logURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);

  let fertConfig = payload.fertConfig;
  let log = {
    activity_id: fertConfig.activity_id,
    activity_kind: fertConfig.activity_kind,
    date: fertConfig.date,
    user_id: user_id,
    quantity_kg: fertConfig.quantity_kg,
    crops: fertConfig.crops,
    locations: fertConfig.locations,
    fertilizer_id: parseInt(fertConfig.fertilizer_id, 10),
    notes: fertConfig.notes,
  };

  try {
    const result = yield call(axios.put, logURL + `/${fertConfig.activity_id}`, log, header);
    if (result) {
      history.push('/log');
      yield put(enqueueSuccessSnackbar(i18n.t('message:LOG.SUCCESS.EDIT')));
    }
  } catch (e) {
    console.log('failed to edit log');
    yield put(enqueueErrorSnackbar(i18n.t('message:LOG.ERROR.EDIT')));
  }
}

export default function* fertSaga() {
  yield takeLatest(GET_FERTILIZERS, getFertilizerSaga);
  yield takeLeading(ADD_FERTILIZER, addFertilizerToDB);
  yield takeLeading(ADD_FERTILIZER_LOG, addLog);
  yield takeLeading(EDIT_FERTILIZER_LOG, editLog);
}
