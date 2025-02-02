const parseCrops = (formValues) => {
  let selectedCrops = [];
  if (formValues.crop != null) {
    // eslint-disable-next-line
    Object.keys(formValues.crop).map((k) => {
      if (!!formValues.crop[k]) {
        // hacky way for harvest log to work, will delete after fixing harvest;
        if (!Array.isArray(formValues.crop[k])) {
          return selectedCrops.push({ management_plan_id: formValues.crop[k].value });
        }
        //
        return formValues.crop[k].map((c) => {
          return selectedCrops.push({ management_plan_id: c.value });
        });
      }
    });
  }
  // console.log(selectedCrops);
  return selectedCrops;
};

export default parseCrops;
