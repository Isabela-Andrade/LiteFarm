import React, { useState } from 'react';
import styles from './styles.module.scss';
import PageTitle from '../../components/PageTitle/v2';
import Button from '../../components/Form/Button';
import ProgressBar from '../../components/ProgressBar';
import LocationPicker from '../../components/LocationPicker';
import Layout from '../../components/Layout';

export default function PlantingLocation({ history }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  console.log(selectedLocation);

  const onContinue = (data) => {
    // TODO - add path 
    //history.push(``)
  }

  const 

  return (
    <>
      <Layout
        buttonGroup={
          <Button disabled={selectedLocation === null} fullLength>
            {'Continue'}
          </Button>
        }
      >
        <PageTitle title={'Add management plan'} onGoBack={() => {}} onCancel={() => {}} />
        <div
          style={{
            marginBottom: '24px',
            marginTop: '8px',
          }}
        >
          <ProgressBar value={37.5} />
        </div>
        <div className={styles.planting_label}>{'Select a planting location'}</div>
        <LocationPicker className={styles.mapContainer} setSelectedLocation={setSelectedLocation} />
        <div>
          <div className={styles.shown_label}>
            {'Only locations that can contain crops are shown'}
          </div>
        </div>
      </Layout>
    </>
  );
}
